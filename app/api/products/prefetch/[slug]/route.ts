import { NextResponse } from "next/server";
import { getProductBySlug } from "@/actions/products";

export async function GET(
  _req: Request,
  context: any
) {
  try {
    const { slug } = context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // Warm the server cache. We don't need to send the payload to the client here.
    await getProductBySlug(slug);

    // Optionally, you could also warm similar products here if desired.
    // await getSimilarProducts(productId)

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    // Do not leak details; prefetch is best-effort.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
