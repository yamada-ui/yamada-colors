import type { ComponentMultiStyle } from "@yamada-ui/react"

export const ColorSelector: ComponentMultiStyle = {
  sizes: {
    md: {
      container: { w: "full", gap: "sm" },
      body: { gap: "sm" },
      sliders: { gap: "sm" },
      channels: { gap: "sm" },
      eyeDropper: { boxSize: "10" },
      result: { boxSize: "10" },
      channelLabel: { fontSize: "sm", mb: "xs" },
      swatchesLabel: { fontSize: "sm", mb: "xs" },
      swatches: { gap: "sm" },
    },
  },
}
