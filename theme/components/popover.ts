import type { ComponentMultiStyle } from "@yamada-ui/react"

export const Popover: ComponentMultiStyle = {
  baseStyle: {
    container: {
      rounded: "md",
      bg: ["white", "black"],
      border: "1px solid",
      borderColor: ["blackAlpha.200", "whiteAlpha.100"],
      color: "inherit",
      boxShadow: ["lg", "dark-lg"],
      zIndex: "guldo",
      _focusVisible: {
        outline: 0,
        boxShadow: "outline",
      },
    },
    closeButton: {
      boxSize: "6",
      top: "4",
      right: "4",
    },
    header: {
      p: "md",
      gap: "md",
      fontWeight: "semibold",
      borderBottom: "1px solid",
      borderColor: "inherit",
    },
    body: {
      my: "md",
      px: "md",
      gap: "md",
    },
    footer: {
      p: "md",
      gap: "md",
      borderTop: "1px solid",
      borderColor: "inherit",
    },
  },
}
