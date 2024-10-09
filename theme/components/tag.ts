import type { ComponentMultiStyle } from "@yamada-ui/react"

export const Tag: ComponentMultiStyle = {
  variants: {
    muted: {
      container: {
        boxShadow: `inset 0 0 0px 1px $muted`,
        color: "muted",
        vars: [{ name: "muted", token: "colors", value: "muted" }],
      },
    },
  },
}
