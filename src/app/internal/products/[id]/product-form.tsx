"use client";

import { useActionState, useState, useEffect } from "react";
import { createProductAction, updateProductAction, publishProductAction, archiveProductAction, unpublishProductAction, uploadImageAction, deleteImageAction, setPrimaryImageAction, updateImageMetadataAction, updateImageOrderAction } from "@/modules/products/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSlug } from "@/modules/products/validations";
import { Plus, Trash, Image as ImageIcon, Star, StarOff, Upload, ArrowUp, ArrowDown, Save } from "lucide-react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({
  product,
  categories,
  brands,
  specifications = [],
  images = []
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brands: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specifications: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
}) {
  const isNew = !product;
  const [specs, setSpecs] = useState(specifications.map(s => ({ ...s, clientKey: crypto.randomUUID() })));
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);

  // Form action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [state, formAction] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (isNew ? createProductAction : updateProductAction) as unknown as (state: any, payload: FormData) => Promise<{error?: string; success?: boolean}>, 
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success("Product saved successfully");
    }
  }, [state]);

  const addSpec = () => {
    setSpecs([...specs, { clientKey: crypto.randomUUID(), groupName: "", key: "", value: "", sortOrder: specs.length }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const handlePublish = async () => {
    if (!product?.id) return;
    const res = await publishProductAction(product.id);
    if (res?.error) toast.error(res.error);
    else toast.success("Product published");
  };

  const handleArchive = async () => {
    if (!product?.id) return;
    const res = await archiveProductAction(product.id);
    if (res?.error) toast.error(res.error);
    else toast.success("Product archived");
  };

  const handleUnpublish = async () => {
    if (!product?.id) return;
    const res = await unpublishProductAction(product.id);
    if (res?.error) toast.error(res.error);
    else toast.success("Product moved to draft");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product?.id || !e.target.files?.length) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    toast.promise(uploadImageAction(product.id, formData), {
      loading: "Uploading image...",
      success: (res) => {
        if (res.error) throw new Error(res.error);
        return "Image uploaded";
      },
      error: (e) => e.message,
    });
    
    e.target.value = ''; // Reset input
  };

  const handleUpdateAltText = async (imageId: string, altText: string) => {
    if (!product?.id) return;
    toast.promise(updateImageMetadataAction(imageId, product.id, { altText }), {
      loading: "Saving alt text...",
      success: "Alt text saved",
      error: "Failed to save alt text"
    });
  };

  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    if (!product?.id) return;
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    } else return;
    
    toast.promise(updateImageOrderAction(product.id, newImages.map(img => img.id)), {
      loading: "Reordering...",
      success: "Order updated",
      error: "Failed to reorder"
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <form action={formAction} id="product-form" className="space-y-6">
          {product && <input type="hidden" name="id" value={product.id} />}
          <input type="hidden" name="specifications" value={JSON.stringify(specs)} />
          <input type="hidden" name="isFeatured" value={isFeatured.toString()} />

          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    name="name" 
                    value={name} 
                    onChange={e => {
                      const val = e.target.value;
                      setName(val);
                      if (autoSlug) setSlug(generateSlug(val));
                    }} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input name="sku" defaultValue={product?.sku || ""} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input name="slug" value={slug} onChange={e => { setSlug(e.target.value); setAutoSlug(false); }} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    name="categoryId" 
                    defaultValue={product?.categoryId || ""} 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c.id as string} value={c.id as string}>{c.name as string}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <select 
                    name="brandId" 
                    defaultValue={product?.brandId || ""}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select Brand</option>
                    {brands.map(b => <option key={b.id as string} value={b.id as string}>{b.name as string}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Public Price (Optional)</label>
                  <Input name="publicPrice" defaultValue={product?.publicPrice || ""} placeholder="e.g. 1500000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">Tracking Mode</label>
                  <select 
                    name="trackingMode" 
                    defaultValue={product?.trackingMode || 'QUANTITY'}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="QUANTITY">Quantity (Standard)</option>
                    <option value="SERIALIZED">Serialized (Unique S/N)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Textarea name="shortDescription" defaultValue={product?.shortDescription || ""} rows={2} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <Textarea name="description" defaultValue={product?.description || ""} rows={6} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Dynamic key-value pairs for this product.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="w-4 h-4 mr-2" /> Add Spec
              </Button>
            </CardHeader>
            <CardContent>
              {specs.length === 0 ? (
                <div className="text-center py-4 text-slate-500 border rounded-lg border-dashed">No specifications added.</div>
              ) : (
                <div className="space-y-3">
                  {specs.map((spec, i) => (
                    <div key={spec.clientKey} className="flex gap-3 items-start">
                      <Input placeholder="Group (e.g. Dimensions)" value={spec.groupName || ""} onChange={e => updateSpec(i, 'groupName', e.target.value)} className="w-1/4" />
                      <Input placeholder="Key (e.g. Height)" value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} required className="w-1/4" />
                      <Input placeholder="Value (e.g. 10 cm)" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} required className="flex-1" />
                      <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => removeSpec(i)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status & Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Status</label>
              <Badge variant={product?.status === 'PUBLISHED' ? "default" : product?.status === 'ARCHIVED' ? "destructive" : "secondary"}>
                {product?.status || 'DRAFT'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-y">
              <label className="text-sm font-medium">Featured Product</label>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={isFeatured as boolean} 
                onChange={e => setIsFeatured(e.target.checked)} 
              />
            </div>

            {product && (
              <div className="space-y-2 pt-2">
                {product.status !== 'PUBLISHED' && (
                  <Button variant="default" className="w-full" onClick={handlePublish}>Publish Product</Button>
                )}
                {product.status === 'PUBLISHED' && (
                  <Button variant="secondary" className="w-full" onClick={handleUnpublish}>Move to Draft</Button>
                )}
                {product.status !== 'ARCHIVED' && (
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleArchive}>Archive Product</Button>
                )}
              </div>
            )}
            
            {!product && (
              <p className="text-xs text-muted-foreground text-center">Save the product first to enable publishing and image uploads.</p>
            )}
          </CardContent>
        </Card>

        {product && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Images</CardTitle>
              <label className="cursor-pointer">
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </div>
                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
              </label>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-6 text-slate-500 border rounded-lg border-dashed flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No images uploaded</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <div key={img.id} className="relative group border rounded-lg overflow-hidden bg-slate-100 flex flex-col">
                      <div className="aspect-square relative">
                        {/* Using standard img tag for internal preview, skipping next/image to avoid host config issues */}
                        <img src={img.url} alt={img.altText || ""} className="w-full h-full object-cover" />
                        
                        {img.isPrimary && (
                          <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-950 text-xs px-1.5 py-0.5 rounded flex items-center shadow-sm">
                            <Star className="w-3 h-3 mr-1 fill-current" /> Primary
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                          {!img.isPrimary && (
                            <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setPrimaryImageAction(img.id, product.id)}>
                              <Star className="w-3 h-3 mr-1" /> Make Primary
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => deleteImageAction(img.id, product.id)}>
                            <Trash className="w-3 h-3 mr-1" /> Delete
                          </Button>
                        </div>
                        
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-6 w-6" disabled={i === 0} onClick={() => handleMoveImage(i, 'up')}>
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-6 w-6" disabled={i === images.length - 1} onClick={() => handleMoveImage(i, 'down')}>
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 border-t bg-white">
                        <Input 
                          placeholder="Alt text..." 
                          defaultValue={img.altText || ""} 
                          className="h-8 text-xs"
                          onBlur={(e) => {
                            if (e.target.value !== (img.altText || "")) {
                              handleUpdateAltText(img.id, e.target.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.currentTarget.blur();
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
