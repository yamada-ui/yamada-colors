import { Box } from "@yamada-ui/react"
import type { BoxProps } from "@yamada-ui/react"
import { memo } from "react"
import type { FC } from "react"

export type HexDataProps = BoxProps & Color & {}

export const HexData: FC<HexDataProps> = memo(({ ...rest }) => {
  return <Box {...rest}></Box>
})

HexData.displayName = "HexData"
