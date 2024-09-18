import React from 'react';
import Image from 'next/image';

interface ImageFile {
  name: string;
  path: string;
}

interface ImageViewerProps {
  selectedImage: ImageFile | null;
}

export function ImageViewer({ selectedImage }: ImageViewerProps) {
  if (!selectedImage) {
    return null;
  }

  return (
    <div className="relative w-full h-[calc(100vh-300px)] overflow-auto bg-muted rounded-md">
      <div className="relative w-full h-full">
        <Image
          src={selectedImage.path}
          alt={selectedImage.name}
          layout="fill"
          objectFit="contain"
          className="rounded-md"
        />
      </div>
    </div>
  );
}
