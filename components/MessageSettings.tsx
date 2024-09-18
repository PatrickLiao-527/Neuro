import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Message settings component for configuring message roles and content
 */
export function MessageSettings() {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Messages
      </legend>
      <div className="grid gap-3">
        <Label htmlFor="role">Role</Label>
        <Select defaultValue="system">
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="You are a..."
          className="min-h-[9.5rem]"
        />
      </div>
    </fieldset>
  );
}