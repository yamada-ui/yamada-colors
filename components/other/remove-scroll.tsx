import type { FC, ReactElement } from "react"
import { useEffect, useState } from "react"
import { RemoveScroll as ReactRemoveScroll } from "react-remove-scroll"
import type { IRemoveScrollProps } from "react-remove-scroll/dist/es5/types"

export type RemoveScrollProps = Omit<IRemoveScrollProps, "children"> & {
  children: ReactElement
}

export const RemoveScroll: FC<RemoveScrollProps> = ({ children, ...rest }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return children

  return (
    <ReactRemoveScroll forwardProps {...rest}>
      {children}
    </ReactRemoveScroll>
  )
}
