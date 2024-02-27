import {
  Center,
  ColorSwatch,
  HStack,
  Text,
  forwardRef,
  handlerAll,
  isString,
  useClipboard,
  useNotice,
} from "@yamada-ui/react"
import type { IconProps, TextProps } from "@yamada-ui/react"
import type { MouseEvent } from "react"
import { memo } from "react"
import { Check, Clipboard } from "components/media-and-icons"

export type CopyTextProps = TextProps & {
  value?: string
  iconProps?: IconProps
  checkIconProps?: IconProps
  copyIconProps?: IconProps
  hiddenIcon?: boolean
}

export const CopyText = memo(
  forwardRef<CopyTextProps, "p">(
    (
      {
        children,
        value: valueProp,
        iconProps,
        checkIconProps,
        copyIconProps,
        hiddenIcon,
        ...rest
      },
      ref,
    ) => {
      const notice = useNotice({ limit: 1, placement: "bottom" })
      const { onCopy, value, hasCopied } = useClipboard(
        valueProp ?? (isString(children) ? children : ""),
        5000,
      )

      return (
        <Text
          ref={ref}
          {...rest}
          cursor="copy"
          transitionProperty="common"
          transitionDuration="slower"
          _hover={{ opacity: hasCopied ? 1 : 0.7 }}
          onClick={handlerAll(
            rest.onClick,
            onCopy,
            (ev: MouseEvent<HTMLParagraphElement>) => {
              ev.preventDefault()
              ev.stopPropagation()

              notice({
                component: () => {
                  return (
                    <Center>
                      <HStack
                        bg={["white", "black"]}
                        rounded="full"
                        py="sm"
                        pl="sm"
                        pr="normal"
                        gap="sm"
                        boxShadow={["md", "dark-lg"]}
                      >
                        <ColorSwatch color={value} isRounded />

                        <Text as="span">{value}</Text>

                        <Text as="span" color="muted" fontSize="sm">
                          Copied
                        </Text>
                      </HStack>
                    </Center>
                  )
                },
              })
            },
          )}
        >
          {children}

          {!hiddenIcon ? (
            hasCopied ? (
              <Check
                ms="1"
                mb="0.5"
                fontSize="0.75em"
                color="success"
                {...iconProps}
                {...checkIconProps}
              />
            ) : (
              <Clipboard
                fontSize="0.875em"
                mb="0.5"
                ms="1"
                color="muted"
                {...iconProps}
                {...copyIconProps}
              />
            )
          ) : null}
        </Text>
      )
    },
  ),
)

CopyText.displayName = "CopyText"
