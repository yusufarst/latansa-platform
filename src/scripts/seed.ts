import "dotenv/config";
import { db } from "../db";
import { categories, brands, products, productSpecifications } from "../modules/products/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "../modules/products/validations";

async function seed() {
  console.log("Starting seed process...");

  // 1. Categories
  const categoryData = [
    { name: "Hospital Beds", desc: "Medical and patient beds" },
    { name: "Surgical Instruments", desc: "High-precision tools" },
    { name: "Patient Monitoring", desc: "Vital signs and telemetry" },
    { name: "Imaging Equipment", desc: "X-ray, Ultrasound, MRI" },
    { name: "Laboratory", desc: "Centrifuges and analyzers" },
    { name: "Mobility Aids", desc: "Wheelchairs and walkers" },
    { name: "Dental Equipment", desc: "Chairs and instruments" },
    { name: "Sterilization", desc: "Autoclaves and cleaners" },
  ];

  const categoryMap = new Map<string, string>();
  
  for (let i = 0; i < categoryData.length; i++) {
    const c = categoryData[i];
    const slug = generateSlug(c.name);
    
    let [existing] = await db.select().from(categories).where(eq(categories.slug, slug));
    if (!existing) {
      [existing] = await db.insert(categories).values({
        name: c.name,
        slug,
        description: c.desc,
        sortOrder: i,
        isActive: true,
      }).returning();
      console.log(`Created category: ${c.name}`);
    }
    categoryMap.set(c.name, existing.id);
  }

  // 2. Brands
  const brandData = [
    "GE Healthcare", "Philips Medical", "Siemens Healthineers", 
    "Medtronic", "Johnson & Johnson", "Stryker", 
    "Baxter", "Abbott", "Boston Scientific", 
    "Becton Dickinson", "Zimmer Biomet", "Olympus"
  ];

  const brandMap = new Map<string, string>();
  
  for (let i = 0; i < brandData.length; i++) {
    const name = brandData[i];
    const slug = generateSlug(name);
    
    let [existing] = await db.select().from(brands).where(eq(brands.slug, slug));
    if (!existing) {
      [existing] = await db.insert(brands).values({
        name,
        slug,
        sortOrder: i,
        isActive: true,
      }).returning();
      console.log(`Created brand: ${name}`);
    }
    brandMap.set(name, existing.id);
  }

  // 3. Products
  const productsToCreate = [
    { name: "Advanced ICU Bed A100", brand: "Stryker", cat: "Hospital Beds", price: "45000000" },
    { name: "Standard Patient Bed B200", brand: "Stryker", cat: "Hospital Beds", price: "12000000" },
    { name: "Premium Surgical Table", brand: "Stryker", cat: "Hospital Beds", price: "120000000" },
    { name: "IntelliVue Patient Monitor", brand: "Philips Medical", cat: "Patient Monitoring", price: "85000000", featured: true },
    { name: "Portable Vital Signs Monitor", brand: "Philips Medical", cat: "Patient Monitoring", price: "25000000" },
    { name: "EPIQ 7 Ultrasound System", brand: "Philips Medical", cat: "Imaging Equipment", price: "500000000", featured: true },
    { name: "MRI System Spectra 3T", brand: "Siemens Healthineers", cat: "Imaging Equipment", price: null },
    { name: "Mobile C-Arm X-Ray", brand: "GE Healthcare", cat: "Imaging Equipment", price: "850000000" },
    { name: "High-Speed Centrifuge Z200", brand: "Abbott", cat: "Laboratory", price: "45000000" },
    { name: "Automated Blood Analyzer", brand: "Abbott", cat: "Laboratory", price: "320000000" },
    { name: "Precision Scalpel Set", brand: "Johnson & Johnson", cat: "Surgical Instruments", price: "2500000" },
    { name: "Endoscopic Camera System", brand: "Olympus", cat: "Surgical Instruments", price: "180000000", featured: true },
    { name: "Lightweight Electric Wheelchair", brand: "Medtronic", cat: "Mobility Aids", price: "18500000" },
    { name: "Dental Chair Professional Plus", brand: "Becton Dickinson", cat: "Dental Equipment", price: "55000000" },
    { name: "Steam Autoclave 50L", brand: "Baxter", cat: "Sterilization", price: "42000000" },
  ];

  for (let i = 0; i < productsToCreate.length; i++) {
    const p = productsToCreate[i];
    const slug = generateSlug(p.name);
    
    const catId = categoryMap.get(p.cat);
    const brandId = brandMap.get(p.brand);
    
    if (!catId || !brandId) {
      console.warn(`Skipping ${p.name}, missing category or brand.`);
      continue;
    }

    let [existing] = await db.select().from(products).where(eq(products.slug, slug));
    if (!existing) {
      [existing] = await db.insert(products).values({
        name: p.name,
        slug,
        sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        categoryId: catId,
        brandId: brandId,
        publicPrice: p.price,
        shortDescription: `High quality ${p.name} for professional medical use.`,
        description: `This is a detailed description for ${p.name}. It includes all necessary features and specifications for healthcare providers.`,
        status: "PUBLISHED",
        publishedAt: new Date(),
        isFeatured: p.featured || false,
      }).returning();
      console.log(`Created product: ${p.name}`);

      // Add dummy specs
      await db.insert(productSpecifications).values([
        { productId: existing.id, key: "Warranty", value: "2 Years", sortOrder: 0, groupName: "General" },
        { productId: existing.id, key: "Power Supply", value: "220V / 50Hz", sortOrder: 1, groupName: "Electrical" },
        { productId: existing.id, key: "Certification", value: "ISO 13485, CE", sortOrder: 2, groupName: "Compliance" }
      ]);
    }
  }

  // Add more generic products to reach 50+
  const genericPrefixes = ["Advanced", "Standard", "Pro", "Elite", "Compact", "Portable", "Digital"];
  const genericBases = ["Monitor", "Pump", "Analyzer", "Sensor", "Table", "Cart", "Light", "Kit"];
  
  let genericCount = 0;
  outer: for (let cIdx = 0; cIdx < categoryData.length; cIdx++) {
    const catName = categoryData[cIdx].name;
    for (let bIdx = 0; bIdx < 5; bIdx++) {
      if (genericCount >= 35) break outer;
      const brandName = brandData[bIdx];
      
      const prefix = genericPrefixes[(cIdx + bIdx) % genericPrefixes.length];
      const base = genericBases[(cIdx * bIdx) % genericBases.length];
      // Deterministic name based on category and brand indices
      const name = `${brandName.split(' ')[0]} ${prefix} ${base} 50${cIdx}${bIdx}`;
      const slug = generateSlug(name);
      
      const [existing] = await db.select().from(products).where(eq(products.slug, slug));
      if (!existing) {
        await db.insert(products).values({
          name,
          slug,
          sku: `GEN-50${cIdx}${bIdx}`,
          categoryId: categoryMap.get(catName)!,
          brandId: brandMap.get(brandName)!,
          publicPrice: `${(bIdx + 1) * 1000000}`,
          shortDescription: `Standard ${name} for clinical applications.`,
          status: "PUBLISHED",
          publishedAt: new Date(),
        });
        genericCount++;
      }
    }
  }
  
  if (genericCount > 0) {
    console.log(`Created ${genericCount} generic products.`);
  }

  console.log("Seed completed successfully!");
}

seed().catch(console.error).finally(() => process.exit(0));
