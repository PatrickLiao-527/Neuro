import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Not a PDF file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const filePath = path.join(process.cwd(), "public/assets", filename);

  try {
    await writeFile(filePath, buffer);
    return NextResponse.json({ filePath }, { status: 201 });
  } catch (error) {
    console.error("Error occurred", error);
    return NextResponse.json({ 
      message: "Failed to upload file", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
