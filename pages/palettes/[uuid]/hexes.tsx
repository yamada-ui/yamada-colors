import { Box } from "@yamada-ui/react"
import type { BoxProps } from "@yamada-ui/react"
import { Fragment, memo } from "react"
import type { FC } from "react"

export type HexesProps = BoxProps & ColorPalette & {}

export const Hexes: FC<HexesProps> = memo(({ uuid, name, colors, ...rest }) => {
  return (
    <Box {...rest}>
      {colors.map(({ name, hex }, index) => (
        <Fragment key={`${hex}-${index}`}>{name}</Fragment>
      ))}
    </Box>
  )
})

Hexes.displayName = "Hexes"
