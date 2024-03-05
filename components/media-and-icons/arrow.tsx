import type { IconProps } from "@yamada-ui/react"
import { Icon } from "@yamada-ui/react"
import { forwardRef } from "react"

export const Arrow = forwardRef<SVGSVGElement, IconProps>(
  ({ boxSize = "1.2em", ...rest }, ref) => {
    return (
      <Icon
        ref={ref}
        boxSize={boxSize}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...rest}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5l0 14" />
        <path d="M16 9l-4 -4" />
        <path d="M8 9l4 -4" />
      </Icon>
    )
  },
)

Arrow.displayName = "Arrow"
