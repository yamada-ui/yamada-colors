import { Box } from "@yamada-ui/react"
import { memo, type FC } from "react"

export const ScrollShadow: FC = memo(() => {
  return (
    <>
      <Box
        position="absolute"
        top="0"
        left="0"
        bottom="0"
        zIndex="kurillin"
        w="4"
        h="full"
        bgGradient={[
          "linear(to-l, rgba(255, 255, 255, 0), white)",
          "linear(to-l, rgba(0, 0, 0, 0), black)",
        ]}
      />
      <Box
        position="absolute"
        top="0"
        bottom="0"
        right="0"
        zIndex="kurillin"
        w="4"
        h="full"
        bgGradient={[
          "linear(to-r, rgba(255, 255, 255, 0), white)",
          "linear(to-r, rgba(0, 0, 0, 0), black)",
        ]}
      />
    </>
  )
})

ScrollShadow.displayName = "ScrollShadow"
