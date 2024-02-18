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
        bg: ["blackAlpha.50", "whiteAlpha.100"],
        rounded: "full",
      },

      button: {
        py: { base: "3", sm: "2" },
        px: "4",
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
}
