import { requireRole } from "@/modules/auth/authorization";
import { getProductById, getCategoriesAdmin, getBrandsAdmin, getProductSpecifications, getProductImages } from "@/modules/products/services/internal";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ProductForm from "./product-form";

export default async function ProductEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const { id } = await params;

  let product = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let specifications: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let images: any[] = [];
  
  if (id !== "new") {
    product = await getProductById(id);
    if (!product) notFound();
    
    specifications = await getProductSpecifications(id);
    images = await getProductImages(id);
  }

  const categories = await getCategoriesAdmin();
  const brands = await getBrandsAdmin();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {product ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-muted-foreground">
            {product ? `Editing ${product.sku} - ${product.name}` : "Create a new product in the catalog"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/internal/products" className={buttonVariants({ variant: "outline" })}>Back to List</Link>
          <Button type="submit" form="product-form">Save Changes</Button>
        </div>
      </div>

      <ProductForm 
        product={product} 
        categories={categories} 
        brands={brands} 
        specifications={specifications}
        images={images}
      />
    </div>
  );
}
