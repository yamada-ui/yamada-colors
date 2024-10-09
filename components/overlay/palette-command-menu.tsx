import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "@yamada-ui/react"
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
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { useRouter } from "next/router"
import { memo, useRef } from "react"
import { setCookie } from "utils/storage"
import { PaletteRenameModal } from "./palette-rename-modal"

export interface PaletteCommandMenuProps extends ContextMenuProps {
  palette: ColorPalette
  triggerProps?: ContextMenuTriggerProps
}

export const PaletteCommandMenu = memo(
  forwardRef<PaletteCommandMenuProps, "div">(
    ({ children, palette, triggerProps, ...rest }, ref) => {
      const { name, uuid } = palette
      const { changePalette, deletePalette } = useApp()
      const { t } = useI18n()
      const router = useRouter()
      const onOpenRef = useRef<() => void>(noop)
      const { isOpen, onClose, onOpen } = useDisclosure()

      return (
        <>
          <ContextMenu
            modifiers={[
              {
                name: "preventOverflow",
                options: {
                  padding: {
                    bottom: 16,
                    left: 16,
                    right: 16,
                    top: 16,
                  },
                },
              },
            ]}
            {...rest}
          >
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
            onOpenRef={onOpenRef}
            onSubmit={(name) => changePalette({ ...palette, name })}
          />

          <Dialog
            cancel={{
              colorScheme: "neutral",
              children: t("palettes.delete.cancel"),
            }}
            header={<Text lineClamp={1}>{name}</Text>}
            isOpen={isOpen}
            success={{
              colorScheme: "danger",
              children: t("palettes.delete.submit"),
            }}
            withCloseButton={false}
            onCancel={onClose}
            onClose={onClose}
            onSuccess={() => deletePalette(uuid)}
          >
            {t("palettes.delete.description")}
          </Dialog>
        </>
      )
    },
  ),
)

PaletteCommandMenu.displayName = "PaletteCommandMenu"
