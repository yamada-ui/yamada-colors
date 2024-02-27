import type { IconButtonProps, PopoverProps } from "@yamada-ui/react"
import {
  Popover,
  forwardRef,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  IconButton,
  PopoverCloseButton,
  Button,
} from "@yamada-ui/react"
import { memo } from "react"
import { ColorPalette, Plus } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

export type PaletteMenuProps = PopoverProps & {
  buttonProps?: IconButtonProps
}

export const PaletteMenu = memo(
  forwardRef<PaletteMenuProps, "button">(({ buttonProps, ...rest }, ref) => {
    const {} = useApp()
    const { t } = useI18n()

    const onCreate = () => {}

    return (
      <Popover placement="bottom-end" {...rest}>
        <PopoverTrigger>
          <IconButton
            ref={ref}
            icon={<ColorPalette color="muted" />}
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            colorScheme="neutral"
            isRounded
            {...buttonProps}
          />
        </PopoverTrigger>

        <PopoverContent w="sm">
          <PopoverCloseButton rounded="full" />

          <PopoverHeader>{t("component.palette-menu.title")}</PopoverHeader>

          <PopoverBody>
            <Button
              w="full"
              colorScheme="neutral"
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              borderColor="transparent"
              leftIcon={<Plus />}
              onClick={onCreate}
            >
              {t("component.palette-menu.create")}
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }),
)

PaletteMenu.displayName = "PaletteMenu"
