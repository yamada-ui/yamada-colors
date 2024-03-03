import type { ComponentMultiStyle } from "@yamada-ui/react"

export const Tag: ComponentMultiStyle = {
  variants: {
    muted: {
      container: {
        color: "muted",
        var: [{ name: "muted", token: "colors", value: "muted" }],
        boxShadow: `inset 0 0 0px 1px var(--ui-muted)`,
      },
    },
  },
}
