import type { ComponentMultiStyle } from "@yamada-ui/react"
import { isAccessible, isGray } from "@yamada-ui/react"

export const SegmentedControl: ComponentMultiStyle = {
  baseStyle: {
    container: {
      p: "1",
      bg: ["blackAlpha.100", "whiteAlpha.50"],
      _readOnly: { cursor: "default" },
      _disabled: { cursor: "not-allowed" },
    },
    cursor: {
      boxShadow: ["md", "dark-md"],
    },
    button: {
      transitionProperty: "common",
      transitionDuration: "ultra-slow",
      fontWeight: "medium",
      whiteSpace: "nowrap",
      color: ["blackAlpha.800", "whiteAlpha.800"],
      _hover: {
        opacity: 0.7,
        _checked: {
          opacity: 1,
        },
      },
      _focusVisible: {
        boxShadow: "outline",
      },
      _readOnly: { cursor: "default" },
      _disabled: { opacity: 0.4, cursor: "not-allowed" },
    },
  },

  variants: {
    basic: ({ colorScheme: c = "gray" }) => ({
      container: {
        rounded: "lg",
      },
      cursor: {
        bg: isGray(c)
          ? [`whiteAlpha.800`, `${c}.700`]
          : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        color: [isGray(c) || isAccessible(c) ? `black` : `white`, `white`],
        rounded: "md",
      },
      button: {
        rounded: "md",
        _checked: {
          color: [isGray(c) || isAccessible(c) ? `black` : `white`, `white`],
        },
      },
    }),

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
