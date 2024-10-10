import type { ComponentStyle } from "@yamada-ui/react"
import { getColor, isAccessible, isArray, isGray, mode } from "@yamada-ui/react"

export const Button: ComponentStyle = {
  baseStyle: {
    fontWeight: "normal",
  },

  variants: {
    solid: ({
      colorScheme: c = "gray",
      colorMode: m,
      errorBorderColor: ec = ["danger.500", "danger.400"],
      theme: t,
    }) => {
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)

      return {
        bg: isGray(c)
          ? [`${c}.50`, `${c}.700`]
          : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        borderColor: isGray(c)
          ? [`${c}.50`, `${c}.700`]
          : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        borderWidth: "1px",
        color: [isGray(c) || isAccessible(c) ? `black` : `white`, `white`],
        _focusVisible: {
          borderColor: "transparent",
          boxShadow: "outline",
        },
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
      }
    },
  },
}
