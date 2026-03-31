import "./globals.css";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "My Shop",
  description: "My online shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Header />
        <div className="pt-[70px]">
          <Breadcrumb />
          {children}
        </div>
      </body>
    </html>
  );
}