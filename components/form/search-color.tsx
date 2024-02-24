import {
  Box,
  Button,
  ChevronIcon,
  ColorPicker,
  IconButton,
  handlerAll,
  useDisclosure,
} from "@yamada-ui/react"
import type {
  BoxProps,
  ColorPickerProps,
  IconButtonProps,
} from "@yamada-ui/react"
import * as c from "color2k"
import { forwardRef, memo } from "react"
import { RemoveScroll } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f } from "utils/color"

export type SearchColorProps = Omit<
  ColorPickerProps,
  "value" | "onChange" | "onSubmit"
> &
  Required<Pick<ColorPickerProps, "value" | "onChange">> & {
    isRemoveScroll?: boolean
    onSubmit?: (value: string) => void
    containerProps?: BoxProps
    submitProps?: IconButtonProps
  }

export const SearchColor = memo(
  forwardRef<HTMLInputElement, SearchColorProps>(
    (
      {
        value,
        onChange,
        onSubmit: onSubmitProp,
        containerProps,
        submitProps,
        isRemoveScroll,
        ...rest
      },
      ref,
    ) => {
      const { isOpen, onOpen, onClose } = useDisclosure()
      const { t } = useI18n()
      const { format } = useApp()

      const onSubmit = () => {
        try {
          value = c.toHex(value)
        } catch {
          value = "#ffffff"

          onChange(value)
        }

        onClose()
        onSubmitProp(value)
      }

      return (
        <RemoveScroll
          allowPinchZoom={false}
          enabled={!!isRemoveScroll && isOpen}
        >
          <Box position="relative" h="fit-content" {...containerProps}>
            <ColorPicker
              ref={ref}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              value={value}
              onChange={onChange}
              placeholder={f("#ffffff", format)}
              matchWidth
              format={format}
              rounded="full"
              eyeDropperProps={{ right: 9, fontSize: "1em", rounded: "full" }}
              inputProps={{ pe: "4rem" }}
              onKeyDown={(ev) => {
                if (ev.key !== "Enter") return

                onSubmit()
              }}
              {...rest}
            >
              <Button
                colorScheme="neutral"
                borderColor="transparent"
                bg={["blackAlpha.200", "whiteAlpha.100"]}
                onClick={onSubmit}
              >
                {t("component.color-search.submit")}
              </Button>
            </ColorPicker>

            <IconButton
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              borderColor="transparent"
              icon={
                <ChevronIcon
                  fontSize="1.3em"
                  color="muted"
                  transform="rotate(-90deg)"
                />
              }
              colorScheme="neutral"
              position="absolute"
              zIndex="kurillin"
              top="50%"
              right="2"
              transform="translateY(-50%)"
              boxSize="6"
              minW="auto"
              size="sm"
              isRounded
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
