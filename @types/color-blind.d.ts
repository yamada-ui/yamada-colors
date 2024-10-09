declare module "color-blind" {
  interface Blinder {
    achromatomaly(hex: string, rgb: true): { B: number; G: number; R: number }
    achromatomaly(hex: string, rgb?: false): string
    achromatopsia(hex: string, rgb: true): { B: number; G: number; R: number }
    achromatopsia(hex: string, rgb?: false): string
    deuteranomaly(hex: string, rgb: true): { B: number; G: number; R: number }
    deuteranomaly(hex: string, rgb?: false): string
    deuteranopia(hex: string, rgb: true): { B: number; G: number; R: number }
    deuteranopia(hex: string, rgb?: false): string
    protanomaly(hex: string, rgb: true): { B: number; G: number; R: number }
    protanomaly(hex: string, rgb?: false): string
    protanopia(hex: string, rgb: true): { B: number; G: number; R: number }
    protanopia(hex: string, rgb?: false): string
    tritanomaly(hex: string, rgb: true): { B: number; G: number; R: number }
    tritanomaly(hex: string, rgb?: false): string
    tritanopia(hex: string, rgb: true): { B: number; G: number; R: number }
    tritanopia(hex: string, rgb?: false): string
  }

  declare const blinder: Blinder
  export default blinder
}
