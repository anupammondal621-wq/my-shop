export type ProductForCart = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

export type CartItem = {
  slug: string;
  name: string;
  price: number | string;
  image: string;
  quantity: number;
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

export async function loadCart(): Promise<CartItem[]> {
  return getLocalCart();
}

export async function addToCart(product: ProductForCart) {
  const cart = getLocalCart();
  const quantityToAdd = product.quantity ?? 1;

  const existingIndex = cart.findIndex((item) => item.slug === product.slug);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantityToAdd;
    cart[existingIndex].price = product.price;
    cart[existingIndex].name = product.name;
    cart[existingIndex].image = product.image;
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
}

export async function updateCartItemQuantity(slug: string, quantity: number) {
  const cart = getLocalCart();

  const updatedCart =
    quantity <= 0
      ? cart.filter((item) => item.slug !== slug)
      : cart.map((item) =>
          item.slug === slug ? { ...item, quantity } : item
        );

  saveLocalCart(updatedCart);
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
  notifyCartUpdated();
}