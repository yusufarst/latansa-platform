import { getProductsAdmin } from "@/modules/products/services/internal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function ProductsPage() {
  const productsList = await getProductsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage product master data</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/internal/products/categories" className={buttonVariants({ variant: "outline" })}>Categories</Link>
          <Link href="/internal/products/brands" className={buttonVariants({ variant: "outline" })}>Brands</Link>
          <Link href="/internal/products/new" className={buttonVariants()}>Add Product</Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>A list of all products in the master data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell className="font-medium">{prod.sku}</TableCell>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>
                    <Badge variant={prod.status === 'PUBLISHED' ? "default" : prod.status === 'DRAFT' ? "secondary" : "destructive"}>
                      {prod.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {prod.trackingMode}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/internal/products/${prod.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>Edit</Link>
                  </TableCell>
                </TableRow>
              ))}
              {productsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
