import { DualSlider } from "./dual-slider";
import { ComponentType } from "react";

// Define a type for the registry
type ComponentRegistry = {
  [key: string]: ComponentType<any>;
};

// This is a placeholder for future expansion
// Add more components as you develop them
export const componentRegistry: ComponentRegistry = {
  'default': DualSlider,
  // Add more components here as you create them
};

export function getComponentByType(type: string): ComponentType<any> {
  return componentRegistry[type] || componentRegistry['default'];
} 