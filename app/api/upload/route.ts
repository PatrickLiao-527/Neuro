import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");

  try {
    await writeFile(
      path.join(process.cwd(), "public/assets", filename),
      buffer
    );
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error("Error occurred", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
