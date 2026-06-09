import { NextResponse } from "next/server";
import {
  MAX_PRODUCT_IMAGE_BYTES,
  PRODUCT_IMAGE_MIME,
} from "@/lib/uploads/config";
import { saveProductImage } from "@/lib/uploads/server";

function hasBearerAuth(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") && header.length > "Bearer ".length + 8;
}

export async function POST(req: Request) {
  if (!hasBearerAuth(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Missing image file." }, { status: 400 });
  }

  if (!PRODUCT_IMAGE_MIME.has(file.type)) {
    return NextResponse.json(
      { message: "Use a JPEG, PNG, WebP, or GIF image." },
      { status: 400 }
    );
  }

  if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
    return NextResponse.json({ message: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { url } = await saveProductImage(bytes, file.type);
    return NextResponse.json({ message: "Uploaded", url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save image.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
