import { CompareProvider } from "@/components/compare-provider";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompareProvider>{children}</CompareProvider>;
}
