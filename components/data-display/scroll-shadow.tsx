import type { FC } from "react"
import { Box } from "@yamada-ui/react"
import { memo } from "react"

export const ScrollShadow: FC = memo(() => {
  return (
    <>
      <Box
        bgGradient={[
          "linear(to-l, rgba(255, 255, 255, 0), white)",
          "linear(to-l, rgba(0, 0, 0, 0), black)",
        ]}
        bottom="0"
        h="full"
        left="0"
        position="absolute"
        top="0"
        w="4"
        zIndex="kurillin"
      />
      <Box
        bgGradient={[
          "linear(to-r, rgba(255, 255, 255, 0), white)",
          "linear(to-r, rgba(0, 0, 0, 0), black)",
        ]}
        bottom="0"
        h="full"
        position="absolute"
        right="0"
        top="0"
        w="4"
        zIndex="kurillin"
      />
    </>
  )
})

ScrollShadow.displayName = "ScrollShadow"
