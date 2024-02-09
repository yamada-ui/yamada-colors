import type { ComponentStyle } from "@yamada-ui/react"

export const Link: ComponentStyle = {
  variants: {
    muted: {
      rounded: "md",
      color: "muted",
      transitionProperty: "common",
      transitionDuration: "slower",
      _hover: {
        textDecoration: "inherit",
        color: ["black", "white"],
      },
    },
  },
}
