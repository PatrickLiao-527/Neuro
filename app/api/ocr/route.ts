import { NextResponse } from "next/server";
import type { Client as GradioClient } from '@gradio/client';

let Client: typeof GradioClient;

if (typeof window === 'undefined') {
  import('@gradio/client').then((module) => {
    Client = module.Client;
  });
}

export async function POST(req: Request) {
  const { imagePaths } = await req.json();

  try {
    const client = await Client.connect("Tonic/GOT-OCR");
    const results: string[] = [];

    for (const imagePath of imagePaths) {
      const result = await client.predict("/ocr_demo", {
        image: await fetch(imagePath).then(res => res.blob()),
        task: "Plain Text OCR",
        ocr_type: "ocr",
        ocr_box: "",
        ocr_color: "red",
      }) as { data: unknown[] };

      if (Array.isArray(result.data) && typeof result.data[0] === 'string') {
        results.push(result.data[0]);
      }
    }

    return NextResponse.json({ ocrResults: results }, { status: 200 });
  } catch (error) {
    console.error("Error processing OCR:", error);
    return NextResponse.json({ 
      message: "Failed to process OCR", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
