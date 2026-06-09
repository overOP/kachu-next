import { NextResponse } from "next/server";
import { MAX_CATALOG_BYTES } from "@/lib/uploads/config";
import { resolveCatalogMime } from "@/lib/uploads/catalog-mime";
import { readCatalogMeta, saveCatalogFile } from "@/lib/uploads/server";

function hasBearerAuth(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") && header.length > "Bearer ".length + 8;
}

export async function GET() {
  const catalog = await readCatalogMeta();
  return NextResponse.json({ message: "Catalog status", catalog });
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
    return NextResponse.json({ message: "Missing catalog file." }, { status: 400 });
  }

  const mime = resolveCatalogMime(file);
  if (!mime) {
    return NextResponse.json(
      { message: "Catalog must be a PDF or image (JPEG, PNG, WebP)." },
      { status: 400 }
    );
  }

  if (file.size > MAX_CATALOG_BYTES) {
    return NextResponse.json({ message: "Catalog must be 25 MB or smaller." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const meta = await saveCatalogFile(bytes, file.name, mime);
    return NextResponse.json({
      message: "Catalog updated",
      url: meta.url,
      fileName: meta.fileName,
      updatedAt: meta.updatedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save catalog.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
