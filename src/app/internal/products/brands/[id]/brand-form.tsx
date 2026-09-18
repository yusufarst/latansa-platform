"use client";

import { useActionState, useState, useEffect } from "react";
import { createBrandAction, updateBrandAction } from "@/modules/products/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSlug } from "@/modules/products/validations";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BrandForm({ brand }: { brand: any }) {
  const isNew = !brand;
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);

  const [state, formAction] = useActionState(isNew ? createBrandAction : updateBrandAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} id="brand-form" className="space-y-4 max-w-xl">
          {brand && <input type="hidden" name="id" value={brand.id} />}
          <input type="hidden" name="isActive" value={isActive.toString()} />
          
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
            <label className="text-sm font-medium">Slug</label>
            <Input name="slug" value={slug} onChange={e => { setSlug(e.target.value); setAutoSlug(false); }} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" defaultValue={brand?.description || ""} rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort Order</label>
            <Input name="sortOrder" type="number" defaultValue={brand?.sortOrder || 0} />
          </div>

          <div className="flex items-center justify-between py-2 border-y mt-4">
            <label className="text-sm font-medium">Active (Visible)</label>
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)} 
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
