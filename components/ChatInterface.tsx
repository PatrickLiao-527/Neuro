"use client";

import React, { useState, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Paperclip, Mic, CornerDownLeft, X } from "lucide-react";

/**
 * Chat interface component for displaying messages and input
 */
export function ChatInterface() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [ocrOutput, setOcrOutput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload PDF
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { filePath } = await uploadResponse.json();

      // Convert PDF to images
      const convertResponse = await fetch('/api/convert-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });

      if (!convertResponse.ok) {
        throw new Error('Failed to convert PDF to images');
      }

      const { imagePaths } = await convertResponse.json();

      // Process OCR
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
    } catch (error) {
      console.error('Error processing file:', error);
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
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <div className="flex-1 whitespace-pre-wrap p-4 text-sm overflow-auto">
        {ocrOutput}
      </div>
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