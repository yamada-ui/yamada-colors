import type {
  BoxProps,
  ColorPickerProps,
  IconButtonProps,
} from "@yamada-ui/react"
import {
  Box,
  Button,
  ChevronIcon,
  ColorPicker,
  handlerAll,
  IconButton,
  useDisclosure,
} from "@yamada-ui/react"
import * as c from "color2k"
import { RemoveScroll } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { forwardRef, memo } from "react"
import { f } from "utils/color"

export interface SearchColorProps extends Omit<ColorPickerProps, "onSubmit"> {
  isRemoveScroll?: boolean
  containerProps?: BoxProps
  submitProps?: IconButtonProps
  onSubmit?: (value: string) => void
}

export const SearchColor = memo(
  forwardRef<HTMLInputElement, SearchColorProps>(
    (
      {
        isRemoveScroll,
        value,
        containerProps,
        submitProps,
        onChange,
        onSubmit: onSubmitProp,
        ...rest
      },
      ref,
    ) => {
      const { isOpen, onClose, onOpen } = useDisclosure()
      const { t } = useI18n()
      const { format } = useApp()

      const onSubmit = () => {
        try {
          value = c.toHex(value ?? "#ffffff")
        } catch {
          value = "#ffffff"

          onChange?.(value)
        }

        onClose()
        onSubmitProp?.(value)
      }

      return (
        <RemoveScroll
          allowPinchZoom={false}
          enabled={!!isRemoveScroll && isOpen}
        >
          <Box h="fit-content" position="relative" {...containerProps}>
            <ColorPicker
              ref={ref}
              format={format}
              isOpen={isOpen}
              matchWidth
              placeholder={f("#ffffff", format)}
              rounded="full"
              value={value}
              eyeDropperProps={{ fontSize: "1em", right: 9, rounded: "full" }}
              inputProps={{ pe: "4rem" }}
              onChange={onChange}
              onClose={onClose}
              onKeyDown={(ev) => {
                if (ev.key !== "Enter") return

                onSubmit()
              }}
              onOpen={onOpen}
              {...rest}
            >
              <Button
                colorScheme="neutral"
                bg={["blackAlpha.200", "whiteAlpha.100"]}
                borderColor="transparent"
                onClick={onSubmit}
              >
                {t("component.color-search.submit")}
              </Button>
            </ColorPicker>

            <IconButton
              colorScheme="neutral"
              size="sm"
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              borderColor="transparent"
              boxSize="6"
              icon={
                <ChevronIcon
                  color="muted"
                  fontSize="lg"
                  transform="rotate(-90deg)"
                />
              }
              isRounded
              minW="auto"
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              zIndex="kurillin"
              {...submitProps}
              onClick={handlerAll(submitProps?.onClick, onSubmit)}
            />
          </Box>
        </RemoveScroll>
      )
    },
  ),
)

SearchColor.displayName = "SearchColor"
