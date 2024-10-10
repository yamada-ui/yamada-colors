import type { IconProps, TextProps } from "@yamada-ui/react"
import type { MouseEvent } from "react"
import { Check, Clipboard } from "@yamada-ui/lucide"
import {
  forwardRef,
  handlerAll,
  isString,
  Text,
  useClipboard,
  useNotice,
} from "@yamada-ui/react"
import { CopiedColorNotice } from "components/feedback"
import { useI18n } from "contexts/i18n-context"
import { memo } from "react"

export interface CopyTextProps extends TextProps {
  hiddenIcon?: boolean
  value?: string
  checkIconProps?: IconProps
  copyIconProps?: IconProps
  iconProps?: IconProps
}

export const CopyText = memo(
  forwardRef<CopyTextProps, "p">(
    (
      {
        children,
        hiddenIcon,
        value: valueProp,
        checkIconProps,
        copyIconProps,
        iconProps,
        ...rest
      },
      ref,
    ) => {
      const { t } = useI18n()
      const notice = useNotice({
        component: () => (
          <CopiedColorNotice value={value}>
            {t("component.copied-color-notice.copied")}
          </CopiedColorNotice>
        ),
        limit: 1,
        placement: "bottom",
      })
      const { hasCopied, value, onCopy } = useClipboard(
        valueProp ?? (isString(children) ? children : ""),
        5000,
      )

      return (
        <Text
          ref={ref}
          alignItems="center"
          cursor="copy"
          display="inline-flex"
          gap="1"
          transitionDuration="slower"
          transitionProperty="common"
          _hover={{ opacity: hasCopied ? 1 : 0.7 }}
          {...rest}
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
                color="success"
                fontSize="1em"
                {...iconProps}
                {...checkIconProps}
              />
            ) : (
              <Clipboard
                color="muted"
                fontSize="1em"
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
