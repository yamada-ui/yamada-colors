import type {
  ButtonProps,
  IconButtonProps,
  Merge,
  LinkProps as UILinkProps,
} from "@yamada-ui/react"
import type { LinkProps as OriginalNextLinkProps } from "next/link"
import type { FC, PropsWithChildren } from "react"
import { Button, IconButton, Link as UILink } from "@yamada-ui/react"
import OriginalNextLink from "next/link"

export interface NextLinkProps
  extends Omit<OriginalNextLinkProps, "as">,
    PropsWithChildren {
  href: string
}

export const NextLink: FC<NextLinkProps> = ({ prefetch = false, ...rest }) => {
  return <OriginalNextLink prefetch={prefetch} {...rest} />
}

export interface LinkProps extends Merge<NextLinkProps, UILinkProps> {}

export const Link: FC<LinkProps> = ({ ...rest }) => {
  return <UILink as={NextLink} {...rest} />
}

export interface NextLinkButtonProps extends Merge<NextLinkProps, ButtonProps> {
  isExternal?: boolean
}

export const NextLinkButton: FC<NextLinkButtonProps> = ({
  isExternal,
  ...rest
}) => {
  return (
    <Button
      as={NextLink}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener" : undefined}
      {...rest}
    />
  )
}

export interface NextLinkIconButtonProps
  extends Merge<NextLinkProps, IconButtonProps> {
  isExternal?: boolean
}

export const NextLinkIconButton: FC<NextLinkIconButtonProps> = ({
  isExternal,
  ...rest
}) => {
  return (
    <IconButton
      as={NextLink}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener" : undefined}
      {...rest}
    />
  )
}
