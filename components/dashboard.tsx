"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from "./Sidebar";
import { FileInventory } from "./FileInventory";
import { ChatInterface } from "./ChatInterface";
import { FileType } from './FileInventory'; // Adjust the path as needed

/**
 * Main Dashboard component that combines all other components
 */
export function Dashboard() {
  const chatInterfaceRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<FileType | null>(null);

  useEffect(() => {
    // Function to scroll to the bottom
    const scrollToBottom = () => {
      if (chatInterfaceRef.current) {
        window.scrollTo({
          top: chatInterfaceRef.current.offsetTop + chatInterfaceRef.current.offsetHeight,
          behavior: 'smooth'
        });
      }
    };

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(scrollToBottom);

    // Start observing the entire document for changes in the subtree
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  const handleImageSelect = (file: FileType) => {
    setSelectedImage(file);
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <Sidebar />
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <FileInventory onImageSelect={handleImageSelect} />
            </form>
          </div>
          <div ref={chatInterfaceRef}>
            <ChatInterface selectedImage={selectedImage} />
          </div>
        </main>
      </div>
    </div>
  );
}
