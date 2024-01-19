import type { CenterProps } from "@yamada-ui/react"
import {
  Center,
  forwardRef,
  mergeRefs,
  useMotionValueEvent,
  useScroll,
} from "@yamada-ui/react"
import { memo, useRef, useState } from "react"

export type HeaderProps = CenterProps & {}

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const { height = 0 } = headerRef.current?.getBoundingClientRect() ?? {}

    useMotionValueEvent(scrollY, "change", setY)

    const isScroll = y > height

    return (
      <Center
        ref={mergeRefs(ref, headerRef)}
        as="header"
        w="full"
        bg={isScroll ? ["whiteAlpha.500", "blackAlpha.200"] : undefined}
        backdropFilter="auto"
        backdropSaturate="180%"
        backdropBlur="10px"
        shadow={isScroll ? ["base", "dark-sm"] : undefined}
        transitionProperty="common"
        transitionDuration="slower"
        position="sticky"
        top="0"
        left="0"
        right="0"
        zIndex="guldo"
        {...rest}
      ></Center>
    )
  }),
)
