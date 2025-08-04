"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UIComponentsSection } from "./ui-components-section";
import { LayoutComponentsSection } from "./layout-components-section";
import { FormComponentsSection } from "./form-components-section";
import { DataDisplaySection } from "./data-display-section";

export function ComponentsShowcase() {
  const [activeTab, setActiveTab] = useState("ui");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ui">UI Components</TabsTrigger>
          <TabsTrigger value="form">Form Components</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="layout">Layout Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ui" className="mt-6 space-y-8">
          <UIComponentsSection />
        </TabsContent>
        
        <TabsContent value="form" className="mt-6 space-y-8">
          <FormComponentsSection />
        </TabsContent>
        
        <TabsContent value="data" className="mt-6 space-y-8">
          <DataDisplaySection />
        </TabsContent>
        
        <TabsContent value="layout" className="mt-6 space-y-8">
          <LayoutComponentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}