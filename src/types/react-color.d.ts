declare module "react-color" {
  import * as React from "react";
  export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number; a: number };
  }
  export const TwitterPicker: React.ComponentType<any>;
}
