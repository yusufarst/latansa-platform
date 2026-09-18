import { requireRole } from "@/modules/auth/authorization";
import { getCategoryById } from "@/modules/products/services/internal";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import CategoryForm from "./category-form";

export default async function CategoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["SUPER_ADMIN", "PRODUCT_SALES_ADMIN"]);
  const { id } = await params;

  let category = null;
  if (id !== "new") {
    category = await getCategoryById(id);
    if (!category) notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {category ? "Edit Category" : "New Category"}
          </h1>
          <p className="text-muted-foreground">
            {category ? `Editing ${category.name}` : "Create a new product category"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/internal/products/categories" className={buttonVariants({ variant: "outline" })}>Back to List</Link>
          <Button type="submit" form="category-form">Save Category</Button>
        </div>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
