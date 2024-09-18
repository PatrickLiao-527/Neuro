import React from 'react';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ModelSettings } from "./ModelSettings";
import { MessageSettings } from "./MessageSettings";
import { ChatInterface } from "./ChatInterface";

/**
 * Main Dashboard component that combines all other components
 */
export function Dashboard() {
  return (
    <div className="grid h-screen w-full pl-[56px]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <ModelSettings />
              <MessageSettings />
            </form>
          </div>
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
