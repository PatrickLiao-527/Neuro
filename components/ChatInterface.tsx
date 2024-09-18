"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Paperclip, Mic, CornerDownLeft, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileType } from './FileInventory';

export function ChatInterface({ selectedImage }: { selectedImage: FileType | null }) {
  const [file, setFile] = useState<FileType | null>(null);
  const [message, setMessage] = useState('');
  const [ocrOutput, setOcrOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'info' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedImage) {
      setFile(selectedImage);
    }
  }, [selectedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] as unknown as FileType);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setAlertMessage(null);

    try {
      setCurrentProcess("Processing File");
      let imagePaths: string[];

      if (file.type === 'pdf') {
        // Convert PDF to images
        const response = await fetch('/api/convert-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: file.path }),
        });
        if (!response.ok) throw new Error('Failed to convert PDF');
        const data = await response.json();
        imagePaths = data.imagePaths.map((path: string) => `public${path}`);
      } else if (file.type === 'image') {
        imagePaths = [`public${file.path}`];
      } else {
        throw new Error('Unsupported file type');
      }

      // Process OCR
      setCurrentProcess("Processing OCR");
      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePaths }),
      });

      if (!ocrResponse.ok) {
        throw new Error('Failed to process OCR');
      }

      const { ocrResults } = await ocrResponse.json();
      setOcrOutput(ocrResults.join('\n\n'));
      setFile(null);
      setAlertMessage({ type: 'info', message: 'File processed successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      setAlertMessage({ type: 'error', message: 'Error processing file' });
    } finally {
      setIsLoading(false);
      setCurrentProcess(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async () => {
    if (file) {
      await handleUpload();
    }
    if (message) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
      <div className="flex-1 whitespace-pre-wrap p-4 text-sm overflow-auto">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </>
        ) : (
          ocrOutput
        )}
      </div>
      {alertMessage && (
        <Alert variant={alertMessage.type === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{alertMessage.type === 'error' ? 'Error' : 'Info'}</AlertTitle>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}
      {currentProcess && (
        <Alert>
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>{currentProcess}</AlertDescription>
        </Alert>
      )}
      <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" onSubmit={(e) => e.preventDefault()}>
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex items-center p-3 pt-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={triggerFileInput}>
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{file.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="size-4" />
              </Button>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
          <Button type="button" size="sm" className="ml-auto gap-1.5" onClick={handleSendMessage}>
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}