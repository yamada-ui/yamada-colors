import type { IconProps } from "@yamada-ui/react"
import { Icon } from "@yamada-ui/react"
import { forwardRef } from "react"

export const Contrast = forwardRef<SVGSVGElement, IconProps>(
  ({ boxSize = "1.2em", ...rest }, ref) => {
    return (
      <Icon
        ref={ref}
        boxSize={boxSize}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 18a6 6 0 0 0 0-12v12z" />
      </Icon>
    )
  },
)

Contrast.displayName = "Contrast"
