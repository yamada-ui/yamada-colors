import { Check, Clipboard } from "@yamada-ui/lucide"
import {
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
import { CopiedColorNotice } from "components/feedback"
import { useI18n } from "contexts/i18n-context"

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
      const { t } = useI18n()
      const notice = useNotice({
        limit: 1,
        placement: "bottom",
        component: () => (
          <CopiedColorNotice value={value}>
            {t("component.copied-color-notice.copied")}
          </CopiedColorNotice>
        ),
      })
      const { onCopy, value, hasCopied } = useClipboard(
        valueProp ?? (isString(children) ? children : ""),
        5000,
      )

      return (
        <Text
          ref={ref}
          {...rest}
          display="inline-flex"
          alignItems="center"
          gap="1"
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

              notice()
            },
          )}
        >
          {children}

          {!hiddenIcon ? (
            hasCopied ? (
              <Check
                fontSize="1em"
                color="success"
                {...iconProps}
                {...checkIconProps}
              />
            ) : (
              <Clipboard
                fontSize="1em"
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
