import {
  ContextMenu,
  ContextMenuTrigger,
  Dialog,
  forwardRef,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  noop,
  Text,
  useDisclosure,
} from "@yamada-ui/react"
import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "@yamada-ui/react"
import { useRouter } from "next/router"
import { memo, useRef } from "react"
import { PaletteRenameModal } from "./palette-rename-modal"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { setCookie } from "utils/storage"

export type PaletteCommandMenuProps = ContextMenuProps & {
  palette: ColorPalette
  triggerProps?: ContextMenuTriggerProps
}

export const PaletteCommandMenu = memo(
  forwardRef<PaletteCommandMenuProps, "div">(
    ({ palette, children, triggerProps, ...rest }, ref) => {
      const { uuid, name } = palette
      const { changePalette, deletePalette } = useApp()
      const { t } = useI18n()
      const router = useRouter()
      const onOpenRef = useRef<() => void>(noop)
      const { isOpen, onOpen, onClose } = useDisclosure()

      return (
        <>
          <ContextMenu {...rest}>
            <ContextMenuTrigger ref={ref} h="full" {...triggerProps}>
              {children}
            </ContextMenuTrigger>

            <MenuList maxW="sm">
              <MenuItem
                onClick={() => {
                  setCookie(CONSTANT.STORAGE.PALETTE_TAB, "palettes")

                  router.push(`/palettes/${uuid}`)
                }}
              >
                {t("component.palette-command-menu.see")}
              </MenuItem>
              <MenuItem onClick={() => onOpenRef.current()}>
                {t("component.palette-command-menu.rename")}
              </MenuItem>
              <MenuItem onClick={onOpen}>
                {t("component.palette-command-menu.delete")}
              </MenuItem>

              <MenuDivider />

              <MenuGroup label={t("component.palette-command-menu.menu.label")}>
                {CONSTANT.ENUM.PALETTE.map((tab) =>
                  tab == "palettes" ? null : (
                    <MenuItem
                      key={tab}
                      onClick={() => {
                        setCookie(CONSTANT.STORAGE.PALETTE_TAB, tab)

                        router.push(`/palettes/${uuid}`)
                      }}
                    >
                      {t(`component.palette-command-menu.menu.${tab}`)}
                    </MenuItem>
                  ),
                )}
              </MenuGroup>
            </MenuList>
          </ContextMenu>

          <PaletteRenameModal
            value={name}
            onSubmit={(name) => changePalette({ ...palette, name })}
            onOpenRef={onOpenRef}
          />

          <Dialog
            isOpen={isOpen}
            onClose={onClose}
            header={<Text lineClamp={1}>{name}</Text>}
            cancel={{
              colorScheme: "neutral",
              children: t("palettes.delete.cancel"),
            }}
            onCancel={onClose}
            success={{
              colorScheme: "danger",
              children: t("palettes.delete.submit"),
            }}
            onSuccess={() => deletePalette(uuid)}
            withCloseButton={false}
          >
            {t("palettes.delete.description")}
          </Dialog>
        </>
      )
    },
  ),
)

PaletteCommandMenu.displayName = "PaletteCommandMenu"
