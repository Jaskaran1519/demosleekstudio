"use server";

import { createDemoProducts } from "./generate-demo-products";

export async function runDemoProductsScript() {
  try {
    const result = await createDemoProducts();
    return result;
  } catch (error) {
    console.error("Error running demo products script:", error);
    throw new Error("Failed to run demo products script");
  }
}

// Self-executing function to run the script
(async () => {
  console.log("Starting demo products generation...");
  try {
    const result = await runDemoProductsScript();
    console.log("Demo products generation completed:", result);
  } catch (error) {
    console.error("Failed to generate demo products:", error);
  }
})();
