import type { CenterProps } from "@yamada-ui/react"
import { Center, forwardRef } from "@yamada-ui/react"
import { memo } from "react"

export type FooterProps = CenterProps & {}

export const Footer = memo(
  forwardRef<FooterProps, "div">(({ ...rest }, ref) => {
    return (
      <Center
        ref={ref}
        as="footer"
        position="sticky"
        top="100vh"
        w="full"
        {...rest}
      ></Center>
    )
  }),
)
