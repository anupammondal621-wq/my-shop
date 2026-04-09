export type Product = {
  slug: string;
  name: string;
  price: string;
  buttonPrice: string;
  image: string;
  pack?: string;
};

export const products: Product[] = [
  {
    slug: "product-one",
    name: "AAM PAPAD STRIPS",
    price: "From ₹ 249.00",
    buttonPrice: "₹249",
    image: "/product-1.jpg",
  },
  {
    slug: "product-two",
    name: "ASSORTED MITHAI - BOX OF 16",
    price: "₹ 1149.00",
    buttonPrice: "₹1149",
    pack: "Box of 16 - Rs. 1149.00",
    image: "/product-2.jpg",
  },
  {
    slug: "product-three",
    name: "ASSORTED MITHAI - BOX OF 8",
    price: "₹ 649.00",
    buttonPrice: "₹649",
    pack: "Box of 8 - Rs. 649.00",
    image: "/product-3.jpg",
  },
  {
    slug: "product-four",
    name: "GAJAR HALWA IN CAN",
    price: "₹ 199.00",
    buttonPrice: "₹199",
    pack: "Can of 1 - Rs. 199.00",
    image: "/product-4.jpg",
  },
  {
    slug: "product-five",
    name: "PRODUCT FIVE",
    price: "₹ 299.00",
    buttonPrice: "₹299",
    pack: "Pack of 1 - Rs. 299.00",
    image: "/product-5.jpg",
  },
  {
    slug: "product-six",
    name: "PRODUCT SIX",
    price: "₹ 399.00",
    buttonPrice: "₹399",
    pack: "Pack of 1 - Rs. 399.00",
    image: "/product-6.jpg",
  },
];

export const websiteSuggestions = [
  { label: "All products", href: "/shop" },
  { label: "Home page", href: "/" },
  { label: "Cart", href: "/cart" },
  { label: "Returns", href: "/returns" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];