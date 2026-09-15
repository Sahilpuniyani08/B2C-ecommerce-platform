import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// Simple env loader if not preloaded
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in environment");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL in environment");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2] || "admin@example.com";
  const password = process.argv[3] || "Admin123456!";
  const name = process.argv[4] || "Admin User";

  console.log(`Creating Admin user: ${email}...`);

  // 1. Create or get user in Supabase Auth
  let authId: string | undefined;

  const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (signUpError) {
    if (signUpError.message.includes("already registered") || signUpError.status === 422) {
      console.log("User already exists in Supabase Auth, fetching existing user...");
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const existingUser = usersData.users.find((u) => u.email === email);
      if (!existingUser) throw new Error("Could not find existing user in Supabase");
      authId = existingUser.id;

      // Update password just in case
      await supabaseAdmin.auth.admin.updateUserById(authId, { password });
    } else {
      throw signUpError;
    }
  } else {
    authId = signUpData.user.id;
  }

  console.log(`Supabase Auth ID: ${authId}`);

  // 2. Upsert in Postgres database User table
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      authId,
      name,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      authId,
      email,
      name,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin user successfully configured in Database!");
  console.log({
    id: user.id,
    authId: user.authId,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  console.log(`\nYou can now log in at /admin/login with:\nEmail: ${email}\nPassword: ${password}`);
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
