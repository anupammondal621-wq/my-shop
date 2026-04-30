import "./globals.css";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "BongoMithai",
  description: "My online shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
      </head>

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