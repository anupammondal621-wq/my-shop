export type Product = {
  slug: string;
  name: string;
  price: number;
  buttonPrice: string;
  image: string;
  pack?: string;
};

export const products: Product[] = [
  {
    slug: "product-one",
    name: "Kaju Katli - Box of 18",
    price: 499,
    buttonPrice: "Rs. 499",
    image: "/product-1.jpg",
  },
  {
    slug: "product-two",
    name: "Kaju Katli - Box of 36",
    price: 899,
    buttonPrice: "Rs. 899",
    image: "/product-2.jpg",
  },
  {
    slug: "product-three",
    name: "Mysore Pak - Box of 6",
    price: 399,
    buttonPrice: "Rs. 399",
    image: "/product-3.jpg",
  },
  {
    slug: "product-four",
    name: "Mysore Pak - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749",
    image: "/product-4.jpg",
  },
  {
    slug: "product-five",
    name: "Pistabarfi - Box of 6",
    price: 899,
    buttonPrice: "Rs. 899",
    image: "/product-5.jpg",
  },
  {
    slug: "product-six",
    name: "Pistabarfi - Box of 12",
    price: 1699,
    buttonPrice: "Rs. 1699",
    image: "/product-6.jpg",
  },
  {
    slug: "product-seven",
    name: "Khajur Barfi - Box of 6",
    price: 399,
    buttonPrice: "Rs. 399",
    image: "/product-6.jpg",
  },
  {
    slug: "product-eight",
    name: "Khajur Barfi - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749",
    image: "/product-6.jpg",
  },
  {
    slug: "product-nine",
    name: "Matichur Laddu - Box of 6",
    price: 739,
    buttonPrice: "Rs. 399",
    image: "/product-6.jpg",
  },
  {
    slug: "product-ten",
    name: "Matichur Laddu - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749.00",
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