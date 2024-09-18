"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageViewer } from "./ImageViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface FileType {
  name: string;
  type: 'pdf' | 'image';
  uploadDate: string;
  path: string;
}

export function FileInventory({ onImageSelect }: { onImageSelect: (file: FileType) => void }) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedImage, setSelectedImage] = useState<FileType | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch('/api/upload');
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }

    fetchFiles();
  }, []);

  const pdfFiles = files.filter(file => file.type === 'pdf');
  const imageFiles = files.filter(file => file.type === 'image');

  const handleImageSelect = (file: FileType) => {
    setSelectedImage(file);
    onImageSelect(file);
  };

  return (
    <div className="rounded-lg border p-4 space-y-6">
      <h2 className="text-lg font-semibold mb-4">File Inventory</h2>
      <Tabs defaultValue="pdfs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        <TabsContent value="pdfs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfFiles.map((file) => (
                <TableRow key={file.name}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{new Date(file.uploadDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="images">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imageFiles.map((file: FileType) => (
                <TableRow 
                  key={file.name} 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleImageSelect(file)}
                >
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{new Date(file.uploadDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Image Viewer</h3>
            <ImageViewer selectedImage={selectedImage} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}