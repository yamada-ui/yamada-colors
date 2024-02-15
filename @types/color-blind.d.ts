declare module "color-blind" {
  interface Blinder {
    protanomaly(hex: string, rgb?: false): string
    protanomaly(hex: string, rgb: true): { R: number; G: number; B: number }
    protanopia(hex: string, rgb?: false): string
    protanopia(hex: string, rgb: true): { R: number; G: number; B: number }
    deuteranomaly(hex: string, rgb?: false): string
    deuteranomaly(hex: string, rgb: true): { R: number; G: number; B: number }
    deuteranopia(hex: string, rgb?: false): string
    deuteranopia(hex: string, rgb: true): { R: number; G: number; B: number }
    tritanomaly(hex: string, rgb?: false): string
    tritanomaly(hex: string, rgb: true): { R: number; G: number; B: number }
    tritanopia(hex: string, rgb?: false): string
    tritanopia(hex: string, rgb: true): { R: number; G: number; B: number }
    achromatomaly(hex: string, rgb?: false): string
    achromatomaly(hex: string, rgb: true): { R: number; G: number; B: number }
    achromatopsia(hex: string, rgb?: false): string
    achromatopsia(hex: string, rgb: true): { R: number; G: number; B: number }
  }

  declare const blinder: Blinder
  export default blinder
}
