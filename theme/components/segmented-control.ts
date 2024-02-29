import type { ComponentMultiStyle } from "@yamada-ui/react"

export const SegmentedControl: ComponentMultiStyle = {
  variants: {
    tabs: () => ({
      container: {
        p: "0",
        bg: "inherit",
      },
      cursor: {
        boxShadow: "inherit",
        bg: ["blackAlpha.100", "whiteAlpha.100"],
        rounded: "full",
      },

      button: {
        transitionDuration: "slower",
        rounded: "full",
        color: "muted",
        outline: 0,
        _focusVisible: {
          boxShadow: "inline",
        },
        _hover: {
          opacity: 1,
          color: [`black`, `white`],
        },
        _checked: {
          color: [`black`, `white`],
        },
      },
    }),
  },

  sizes: {
    sm: {
      container: { minW: "xs" },
      button: { py: "0", px: "4", h: "8", fontSize: "sm" },
    },
    md: {
      container: { minW: "sm" },
      button: { py: "2", px: "4", fontSize: "md" },
    },
  },
}
