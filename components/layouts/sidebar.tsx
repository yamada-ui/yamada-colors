import type { StackProps } from "@yamada-ui/react"
import { forwardRef, VStack } from "@yamada-ui/react"
import { Tree } from "components/navigation"
import { memo } from "react"

export interface SidebarProps extends StackProps {}

export const Sidebar = memo(
  forwardRef<SidebarProps, "aside">(({ ...rest }, ref) => {
    return (
      <VStack
        ref={ref}
        as="aside"
        bg={["blackAlpha.50", "whiteAlpha.100"]}
        maxH="calc(100dvh - 8rem)"
        p="md"
        position="sticky"
        rounded="2xl"
        top="6rem"
        w="17rem"
        {...rest}
      >
        <Tree isAside />
      </VStack>
    )
  }),
)
