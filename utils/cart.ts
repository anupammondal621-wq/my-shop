import { createClient } from "@/utils/supabase/client";

export type ProductForCart = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

export type CartItem = {
  id?: string;
  user_id?: string;
  slug: string;
  name: string;
  price: number | string;
  image: string;
  quantity: number;
  created_at?: string;
};

const CART_KEY = "cart";

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function getLoggedInUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function loadCart(): Promise<CartItem[]> {
  const supabase = createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return getLocalCart();
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading cart:", error.message);
    return [];
  }

  return data ?? [];
}

export async function addToCart(product: ProductForCart) {
  const supabase = createClient();
  const user = await getLoggedInUser();
  const quantityToAdd = product.quantity ?? 1;

  if (!user) {
    const cart = getLocalCart();

    const existingIndex = cart.findIndex((item) => item.slug === product.slug);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantityToAdd;
      cart[existingIndex].price = product.price;
    } else {
      cart.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantityToAdd,
      });
    }

    saveLocalCart(cart);
    notifyCartUpdated();
    return;
  }

  const { data: existingItem, error: existingError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", product.slug)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking cart item:", existingError.message);
    return;
  }

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantityToAdd,
        price: product.price,
        name: product.name,
        image: product.image,
      })
      .eq("id", existingItem.id);

    if (error) {
      console.error("Error updating cart item:", error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantityToAdd,
    });

    if (error) {
      console.error("Error inserting cart item:", error.message);
      return;
    }
  }

  notifyCartUpdated();
}

export async function updateCartItemQuantity(slug: string, quantity: number) {
  const supabase = createClient();
  const user = await getLoggedInUser();

  if (!user) {
    const cart = getLocalCart();

    const updatedCart =
      quantity <= 0
        ? cart.filter((item) => item.slug !== slug)
        : cart.map((item) =>
            item.slug === slug ? { ...item, quantity } : item
          );

    saveLocalCart(updatedCart);
    notifyCartUpdated();
    return;
  }

  if (quantity <= 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("slug", slug);

    if (error) {
      console.error("Error deleting cart item:", error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("slug", slug);

    if (error) {
      console.error("Error updating quantity:", error.message);
      return;
    }
  }

  notifyCartUpdated();
}

export async function removeCartItem(slug: string) {
  await updateCartItemQuantity(slug, 0);
}

export async function clearCartAfterLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_KEY);
    notifyCartUpdated();
  }
}

export async function mergeGuestCartIntoUserCart() {
  const supabase = createClient();
  const user = await getLoggedInUser();

  if (!user) return;

  const localCart = getLocalCart();

  if (localCart.length === 0) return;

  for (const localItem of localCart) {
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("slug", localItem.slug)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + localItem.quantity,
          price: localItem.price,
          name: localItem.name,
          image: localItem.image,
        })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        slug: localItem.slug,
        name: localItem.name,
        price: localItem.price,
        image: localItem.image,
        quantity: localItem.quantity,
      });
    }
  }

  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
}