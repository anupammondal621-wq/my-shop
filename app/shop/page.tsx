import ShopClient from "./ShopClient";

export default function ShopPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search?.toLowerCase().trim() || "";

  return <ShopClient search={search} />;
}