import { requireRole } from "@/modules/auth/authorization";
import { getBrandById } from "@/modules/products/services/internal";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import BrandForm from "./brand-form";

export default async function BrandEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const { id } = await params;

  let brand = null;
  if (id !== "new") {
    brand = await getBrandById(id);
    if (!brand) notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {brand ? "Edit Brand" : "New Brand"}
          </h1>
          <p className="text-muted-foreground">
            {brand ? `Editing ${brand.name}` : "Create a new product brand"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/internal/products/brands" className={buttonVariants({ variant: "outline" })}>Back to List</Link>
          <Button type="submit" form="brand-form">Save Brand</Button>
        </div>
      </div>

      <BrandForm brand={brand} />
    </div>
  );
}
