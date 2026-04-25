import ShopClient from "./ShopClient";

type ShopPageProps = {
  searchParams?: {
    search?: string;
  };
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  const search =
    typeof searchParams?.search === "string"
      ? searchParams.search.toLowerCase().trim()
      : "";

  return <ShopClient search={search} />;
}