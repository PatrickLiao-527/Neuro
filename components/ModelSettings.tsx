import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/**
 * Model settings component for configuring AI model parameters
 */
export function ModelSettings() {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Settings
      </legend>
      <div className="grid gap-3">
        <Label htmlFor="model">Model</Label>
        <Select>
          <SelectTrigger
            id="model"
            className="items-start [&_[data-description]]:hidden"
          >
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {/* Model options */}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="temperature">Temperature</Label>
        <Input id="temperature" type="number" placeholder="0.4" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="top-p">Top P</Label>
          <Input id="top-p" type="number" placeholder="0.7" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="top-k">Top K</Label>
          <Input id="top-k" type="number" placeholder="0.0" />
        </div>
      </div>
    </fieldset>
  );
}