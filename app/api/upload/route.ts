import { NextResponse } from "next/server";
import path from "path";
import { writeFile, readdir, stat } from "fs/promises";

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

export async function GET() {
  const assetsDir = path.join(process.cwd(), "public/assets");
  const convertedDir = path.join(process.cwd(), "public/converted");

  try {
    const assetFiles = await readFiles(assetsDir, '/assets/');
    const convertedFiles = await readFiles(convertedDir, '/converted/');

    const allFiles = [...assetFiles, ...convertedFiles];

    return NextResponse.json({ files: allFiles }, { status: 200 });
  } catch (error) {
    console.error("Error reading directories:", error);
    return NextResponse.json({ 
      message: "Failed to read files", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

async function readFiles(dir: string, pathPrefix: string) {
  const files = await readdir(dir);
  return Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    return {
      name: file,
      type: pathPrefix === '/assets/' ? 'pdf' : 'image',
      uploadDate: stats.mtime.toISOString(),
      path: `${pathPrefix}${file}`
    };
  }));
}
