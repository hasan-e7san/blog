import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { uploadBufferToStorage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "uploads";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file is not allowed" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const url = await uploadBufferToStorage({
    buffer,
    contentType: file.type,
    folder,
    fileName: file.name,
  });

  return NextResponse.json({ url });
}
