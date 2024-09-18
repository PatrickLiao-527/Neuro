import { NextResponse } from "next/server";
import { fromPath } from "pdf2pic";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  const { filePath } = await req.json();

  const options = {
    density: 300,
    saveFilename: "page",
    savePath: path.join(process.cwd(), 'public', 'converted'),
    format: "png",
    width: 2000,
    height: 2000
  };

  try {
    await fs.mkdir(options.savePath, { recursive: true });

    const convert = fromPath(filePath, options);
    const pageCount = await getPageCount(filePath);

    const imagePaths: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const result = await convert(i);
      imagePaths.push(result.path!);
    }

    return NextResponse.json({ imagePaths }, { status: 200 });
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    return NextResponse.json({ 
      error: "Conversion failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function getPageCount(pdfPath: string): Promise<number> {
  const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: path.join(process.cwd(), 'public', 'converted'),
    format: "png",
    width: 600,
    height: 600
  };
  const convert = fromPath(pdfPath, options);
  const pages = await convert.bulk(-1, { responseType: "buffer" });
  return pages.length;
}
