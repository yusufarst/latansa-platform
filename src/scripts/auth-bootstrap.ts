import * as dotenv from 'dotenv';
dotenv.config();

import { getBootstrapEnv } from "../config/env";
import { db } from "../db";
import { roles, users } from "../modules/auth/db/schema";
import { hashPassword } from "../modules/auth/password";
import { eq } from "drizzle-orm";
import { appendAuditLog } from "../modules/auth/audit";

const CANONICAL_ROLES = [
  { code: "SUPER_ADMIN", name: "Super Admin" },
  { code: "INVENTORY_ADMIN", name: "Inventory Admin" },
  { code: "PRODUCT_SALES_ADMIN", name: "Product & Sales Admin" }
];

async function runBootstrap() {
  console.log("🚀 Starting bootstrap process...");
  
  // 1. Validate bootstrap-only env
  const env = getBootstrapEnv();
  const superAdminEmail = env.SUPER_ADMIN_EMAIL.toLowerCase().trim();
  const superAdminPassword = env.SUPER_ADMIN_INITIAL_PASSWORD;
  
  // 2. Ensure the three canonical roles exist
  for (const roleDef of CANONICAL_ROLES) {
    const existingRole = await db.query.roles.findFirst({
      where: eq(roles.code, roleDef.code)
    });
    
    if (!existingRole) {
      console.log(`✅ Creating role: ${roleDef.code}`);
      await db.insert(roles).values({
        code: roleDef.code,
        name: roleDef.name
      });
    }
  }
  
  // 3. Create initial SUPER_ADMIN if it does not exist
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, superAdminEmail)
  });
  
  if (!existingUser) {
    const superAdminRole = await db.query.roles.findFirst({
      where: eq(roles.code, "SUPER_ADMIN")
    });
    
    if (!superAdminRole) {
      throw new Error("SUPER_ADMIN role not found after creation attempt");
    }
    
    console.log("✅ Creating initial SUPER_ADMIN user");
    const passwordHash = await hashPassword(superAdminPassword);
    
    const [newUser] = await db.insert(users).values({
      email: superAdminEmail,
      passwordHash,
      roleId: superAdminRole.id,
      isActive: true,
    }).returning({ id: users.id });
    
    await appendAuditLog("USER_BOOTSTRAPPED", { 
      actorUserId: newUser.id,
      metadata: { role: "SUPER_ADMIN" } 
    });
    
    console.log("✅ Bootstrap complete.");
  } else {
    console.log("ℹ️ SUPER_ADMIN user already exists. Skipping creation.");
  }
  
  process.exit(0);
}

runBootstrap().catch(() => {
  process.exit(1);
});
