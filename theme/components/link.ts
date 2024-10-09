import type { ComponentStyle } from "@yamada-ui/react"

export const Link: ComponentStyle = {
  variants: {
    muted: {
      color: "muted",
      transitionDuration: "slower",
      transitionProperty: "common",
      _hover: {
        color: ["black", "white"],
        textDecoration: "inherit",
      },
    },
  },
}
