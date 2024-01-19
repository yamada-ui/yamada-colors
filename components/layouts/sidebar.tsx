import type { StackProps } from "@yamada-ui/react"
import { VStack, forwardRef } from "@yamada-ui/react"
import { memo } from "react"

export type SidebarProps = StackProps

export const Sidebar = memo(
  forwardRef<SidebarProps, "aside">(({ ...rest }, ref) => {
    return <VStack ref={ref} as="aside" {...rest}></VStack>
  }),
)
