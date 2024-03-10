import type { IconProps } from "@yamada-ui/react"
import { Icon } from "@yamada-ui/react"
import { forwardRef } from "react"

export const Logo = forwardRef<SVGSVGElement, IconProps>(
  ({ boxSize = "1em", ...rest }, ref) => {
    return (
      <Icon
        ref={ref}
        boxSize={boxSize}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        stroke="none"
        fill="none"
        {...rest}
      >
        <path
          fill="#3cc360"
          d="M35.14723,35.14718a119.996,119.996,0,0,0,.15228,169.85437l84.851-84.85105Z"
        />
        <path
          fill="#ea4334"
          d="M205.00156,35.29952a119.996,119.996,0,0,0-169.85433-.15234l85.0033,85.00332Z"
        />
        <path
          fill="#4387f4"
          d="M35.29951,205.00155a119.996,119.996,0,0,0,169.55332-.14873l-84.7023-84.70232Z"
        />
      </Icon>
    )
  },
)

Logo.displayName = "Logo"
