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
  price: number;
  image: string;
  quantity: number;
  created_at?: string;
};

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
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
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

  return (data as CartItem[]) ?? [];
}

export async function addToCart(product: ProductForCart) {
  const supabase = createClient();
  const user = await getLoggedInUser();
  const quantityToAdd = product.quantity ?? 1;

  if (!user) {
    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingProductIndex = cart.findIndex(
      (item) => item.slug === product.slug
    );

if (existingProductIndex !== -1) {
  cart[existingProductIndex].quantity += quantityToAdd;
  cart[existingProductIndex].price = product.price; 
} else {
  cart.push({
    slug: product.slug,
    name: product.name,
    price: product.price, 
    image: product.image,
    quantity: quantityToAdd,
  });
}

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  const { data: existingItem, error: existingItemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", product.slug)
    .maybeSingle();

  if (existingItemError) {
    console.error("Error checking existing cart item:", existingItemError.message);
    return;
  }

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantityToAdd,
        price: String(product.price),
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
      price: String(product.price),
      image: product.image,
      quantity: quantityToAdd,
    });

    if (error) {
      console.error("Error inserting cart item:", error.message);
      return;
    }
  }

  window.dispatchEvent(new Event("cartUpdated"));
}

export async function updateCartItemQuantity(
  slug: string,
  quantity: number
) {
  const supabase = createClient();
  const user = await getLoggedInUser();

  if (!user) {
    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const updatedCart =
      quantity <= 0
        ? cart.filter((item) => item.slug !== slug)
        : cart.map((item) =>
            item.slug === slug ? { ...item, quantity } : item
          );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
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
      console.error("Error updating cart quantity:", error.message);
      return;
    }
  }

  window.dispatchEvent(new Event("cartUpdated"));
}

export async function removeCartItem(slug: string) {
  await updateCartItemQuantity(slug, 0);
}

export async function mergeGuestCartIntoUserCart() {
  const supabase = createClient();
  const user = await getLoggedInUser();

  if (!user) return;

  const localCartRaw = localStorage.getItem("cart");
  const localCart: CartItem[] = localCartRaw ? JSON.parse(localCartRaw) : [];

  if (localCart.length === 0) return;

  for (const localItem of localCart) {
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("slug", localItem.slug)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking cart item during merge:", fetchError.message);
      continue;
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + localItem.quantity,
          price: String(localItem.price),
        })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating merged cart item:", updateError.message);
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: user.id,
        slug: localItem.slug,
        name: localItem.name,
        price: String(localItem.price),
        image: localItem.image,
        quantity: localItem.quantity,
      });

      if (insertError) {
        console.error("Error inserting merged cart item:", insertError.message);
      }
    }
  }

  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cartUpdated"));
}