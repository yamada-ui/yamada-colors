import type { ComponentStyle } from "@yamada-ui/react"
import { getColor, isAccessible, isArray, isGray, mode } from "@yamada-ui/react"

export const Button: ComponentStyle = {
  baseStyle: {
    fontWeight: "normal",
  },

  variants: {
    solid: ({
      theme: t,
      colorMode: m,
      colorScheme: c = "gray",
      errorBorderColor: ec = ["danger.500", "danger.400"],
    }) => {
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)

      return {
        borderWidth: "1px",
        bg: isGray(c)
          ? [`${c}.50`, `${c}.700`]
          : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        color: [isGray(c) || isAccessible(c) ? `black` : `white`, `white`],
        borderColor: isGray(c)
          ? [`${c}.50`, `${c}.700`]
          : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        _hover: {
          bg: isGray(c)
            ? [`${c}.100`, `${c}.800`]
            : [isAccessible(c) ? `${c}.500` : `${c}.600`, `${c}.700`],
          borderColor: isGray(c)
            ? [`${c}.100`, `${c}.800`]
            : [isAccessible(c) ? `${c}.500` : `${c}.600`, `${c}.700`],
          _disabled: {
            bg: isGray(c)
              ? [`${c}.50`, `${c}.700`]
              : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
            borderColor: isGray(c)
              ? [`${c}.50`, `${c}.700`]
              : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
          },
        },
        _invalid: {
          border: "1px solid",
          borderColor: errorBorderColor,
          boxShadow: `0 0 0 1px ${errorBorderColor}`,
        },
        _focusVisible: {
          borderColor: "transparent",
          boxShadow: "outline",
        },
      }
    },
  },
}
