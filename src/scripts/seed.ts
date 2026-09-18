import "dotenv/config";
import { db } from "../db";
import { categories, brands, products, productSpecifications } from "../modules/products/db/schema";
import { eq, like, or } from "drizzle-orm";
import { generateSlug } from "../modules/products/validations";

async function seed() {
  console.log("Starting seed process...");

  // Targeted cleanup of old medical demo data to prevent contamination
  console.log("Cleaning up old medical demo data...");
  await db.delete(products).where(or(
    like(products.sku, 'SKU-%'), 
    like(products.sku, 'GEN-%'),
    like(products.sku, 'DEMO-%')
  ));
  
  const medicalBrands = ["GE Healthcare", "Philips Medical", "Siemens Healthineers", "Medtronic", "Johnson & Johnson", "Stryker", "Baxter", "Abbott", "Boston Scientific", "Becton Dickinson", "Zimmer Biomet", "Olympus"];
  for (const b of medicalBrands) {
    await db.delete(brands).where(eq(brands.slug, generateSlug(b)));
  }
  
  const medicalCategories = ["Hospital Beds", "Surgical Instruments", "Patient Monitoring", "Imaging Equipment", "Laboratory", "Mobility Aids", "Dental Equipment", "Sterilization"];
  for (const c of medicalCategories) {
    await db.delete(categories).where(eq(categories.slug, generateSlug(c)));
  }

  // 1. Categories (Electronics)
  const categoryData = [
    { name: "Laptops", desc: "Professional and consumer laptops" },
    { name: "Two-Way Radios", desc: "Communication radios" },
    { name: "Inverters", desc: "Power inverters and converters" },
    { name: "Batteries", desc: "Rechargeable and specialty batteries" },
    { name: "Cables", desc: "Networking and power cables" },
    { name: "Chargers & Power Adapters", desc: "Power adapters and charging bricks" },
    { name: "Networking", desc: "Routers, switches, and modems" },
    { name: "Power & Electrical Accessories", desc: "Surge protectors, UPS" },
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

  // 2. Brands (Electronics)
  const brandData = [
    "Lenovo", "Dell", "HP", "Asus", 
    "Motorola", "Baofeng", "APC", 
    "CyberPower", "Anker", "Belkin", 
    "Ugreen", "TP-Link", "Cisco"
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
    { name: "ThinkPad T14 Gen 4", brand: "Lenovo", cat: "Laptops", price: "20000000", featured: true, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "XPS 15 Laptop", brand: "Dell", cat: "Laptops", price: "35000000", featured: true, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "ProBook 450", brand: "HP", cat: "Laptops", price: "15000000", featured: false, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "ROG Zephyrus G14", brand: "Asus", cat: "Laptops", price: "28000000", featured: false, mode: "SERIALIZED", status: "DRAFT" },
    
    { name: "DP4400e Portable Radio", brand: "Motorola", cat: "Two-Way Radios", price: "12000000", featured: true, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "UV-5R Dual Band", brand: "Baofeng", cat: "Two-Way Radios", price: "500000", featured: false, mode: "QUANTITY", status: "PUBLISHED" },
    
    { name: "Smart-UPS 1500VA", brand: "APC", cat: "Power & Electrical Accessories", price: "8000000", featured: true, mode: "QUANTITY", status: "PUBLISHED" },
    { name: "Value Pro 700VA", brand: "CyberPower", cat: "Power & Electrical Accessories", price: "1200000", featured: false, mode: "QUANTITY", status: "PUBLISHED" },
    
    { name: "PowerCore 26800", brand: "Anker", cat: "Batteries", price: "1500000", featured: false, mode: "QUANTITY", status: "PUBLISHED" },
    { name: "BoostCharge Pro", brand: "Belkin", cat: "Chargers & Power Adapters", price: "900000", featured: false, mode: "QUANTITY", status: "PUBLISHED" },
    
    { name: "Cat6 Ethernet Cable 5m", brand: "Ugreen", cat: "Cables", price: "150000", featured: false, mode: "QUANTITY", status: "PUBLISHED" },
    { name: "Archer AX73 Router", brand: "TP-Link", cat: "Networking", price: "2500000", featured: true, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "Catalyst 9200 Switch", brand: "Cisco", cat: "Networking", price: "45000000", featured: false, mode: "SERIALIZED", status: "PUBLISHED" },
    { name: "Enterprise Edge Router", brand: "Cisco", cat: "Networking", price: "85000000", featured: false, mode: "SERIALIZED", status: "DRAFT" }
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

    const sku = `DEMO-${p.cat.substring(0, 3).toUpperCase()}-${(i + 1).toString().padStart(3, '0')}`;

    let [existing] = await db.select().from(products).where(eq(products.slug, slug));
    if (!existing) {
      [existing] = await db.insert(products).values({
        name: p.name,
        slug,
        sku,
        categoryId: catId,
        brandId: brandId,
        publicPrice: p.price,
        trackingMode: p.mode as "QUANTITY" | "SERIALIZED",
        shortDescription: `High quality ${p.name} for professional use.`,
        description: `This is a detailed description for ${p.name}. It includes all necessary features and specifications for electronics professionals.`,
        status: p.status as "DRAFT" | "PUBLISHED",
        publishedAt: p.status === "PUBLISHED" ? new Date() : null,
        isFeatured: p.featured,
      }).returning();
      console.log(`Created product: ${p.name}`);

      await db.insert(productSpecifications).values([
        { productId: existing.id, key: "Warranty", value: "1 Year", sortOrder: 0, groupName: "General" },
        { productId: existing.id, key: "Condition", value: "New", sortOrder: 1, groupName: "General" }
      ]);
    }
  }

  const genericPrefixes = ["Pro", "Elite", "Advanced", "Compact", "Portable", "Digital", "Smart", "Ultra"];
  const genericBases = ["Model X", "Series 5", "Edition", "System", "Device", "Hub", "Station", "Module"];
  
  let genericCount = 0;
  outer: for (let cIdx = 0; cIdx < categoryData.length; cIdx++) {
    const catName = categoryData[cIdx].name;
    for (let bIdx = 0; bIdx < 6; bIdx++) {
      if (genericCount >= 50) break outer;
      const brandName = brandData[bIdx % brandData.length];
      
      const prefix = genericPrefixes[(cIdx + bIdx) % genericPrefixes.length];
      const base = genericBases[(cIdx * bIdx) % genericBases.length];
      const name = `${brandName.split(' ')[0]} ${prefix} ${base} ${cIdx}${bIdx}`;
      const slug = generateSlug(name);
      
      const sku = `DEMO-GEN-${cIdx}${bIdx}-${genericCount.toString().padStart(3, '0')}`;
      
      const [existing] = await db.select().from(products).where(eq(products.slug, slug));
      if (!existing) {
        await db.insert(products).values({
          name,
          slug,
          sku,
          categoryId: categoryMap.get(catName)!,
          brandId: brandMap.get(brandName)!,
          publicPrice: `${(bIdx + 1) * 500000}`,
          trackingMode: (genericCount % 3 === 0) ? "SERIALIZED" : "QUANTITY",
          shortDescription: `Standard ${name} for electronics applications.`,
          description: `Comprehensive features for the ${name}.`,
          status: (genericCount % 10 === 0) ? "DRAFT" : "PUBLISHED",
          publishedAt: (genericCount % 10 === 0) ? null : new Date(),
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

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exitCode = 1;
});
