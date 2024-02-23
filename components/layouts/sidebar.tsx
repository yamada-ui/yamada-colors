import type { StackProps } from "@yamada-ui/react"
import { VStack, forwardRef } from "@yamada-ui/react"
import { memo } from "react"
import { Tree } from "components/navigation"

export type SidebarProps = StackProps

export const Sidebar = memo(
  forwardRef<SidebarProps, "aside">(({ ...rest }, ref) => {
    return (
      <VStack
        ref={ref}
        as="aside"
        bg={["blackAlpha.50", "whiteAlpha.100"]}
        rounded="2xl"
        position="sticky"
        top="6rem"
        w="17rem"
        maxH="calc(100dvh - 8rem)"
        p="md"
        {...rest}
      >
        <Tree isAside />
      </VStack>
    )
  }),
)
