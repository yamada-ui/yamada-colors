import type { ComponentMultiStyle } from "@yamada-ui/react"

export const SegmentedControl: ComponentMultiStyle = {
  variants: {
    tabs: () => ({
      container: {
        bg: "inherit",
        p: "0",
      },
      cursor: {
        bg: ["blackAlpha.100", "whiteAlpha.100"],
        boxShadow: "inherit",
        rounded: "full",
      },

      button: {
        color: "muted",
        outline: 0,
        rounded: "full",
        transitionDuration: "slower",
        _checked: {
          color: [`black`, `white`],
        },
        _focusVisible: {
          boxShadow: "inline",
        },
        _hover: {
          color: [`black`, `white`],
          opacity: 1,
        },
      },
    }),
  },

  sizes: {
    sm: {
      button: { fontSize: "sm", h: "8", px: "4", py: "0" },
      container: { minW: "xs" },
    },
    md: {
      button: { fontSize: "md", px: "4", py: "2" },
      container: { minW: "sm" },
    },
  },
}
