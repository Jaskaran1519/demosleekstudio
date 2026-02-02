import { db } from "@/lib/db";

const TARGET_EMAIL = "MODIFY_THIS_EMAIL@example.com"; // <--- CHANGE THIS

async function main() {
  if (TARGET_EMAIL === "MODIFY_THIS_EMAIL@example.com") {
    console.error("❌ Please edit 'scripts/set-manager.ts' and set TARGET_EMAIL to the user's email.");
    process.exit(1);
  }

  console.log(`Finding user with email: ${TARGET_EMAIL}...`);
  const user = await db.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`);
    process.exit(1);
  }

  console.log(`Updating role for user: ${user.name || user.email}`);
  const updatedUser = await db.user.update({
    where: { email: TARGET_EMAIL },
    data: { role: "MANAGER" },
  });

  console.log(`✅ Successfully updated role to MANAGER for: ${updatedUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
