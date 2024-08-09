import {
  ContextMenu,
  ContextMenuTrigger,
  forwardRef,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useClipboard,
  useNotice,
  Text,
  useDisclosure,
  Modal,
  ModalBody,
  Button,
  ModalFooter,
} from "@yamada-ui/react"
import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"
import { memo, useMemo, useRef, useState } from "react"
import { CopiedColorNotice } from "components/feedback"
import { PaletteColorForm } from "components/form"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { useHexes, usePalette, useHex } from "pages/palettes/[uuid]/context"
import { getColorName } from "utils/color-name-list"

export type ColorCommandMenuProps = ContextMenuProps & {
  name?: string
  value: string
  triggerProps?: ContextMenuTriggerProps
  hiddenGenerators?: boolean
  enabledEditPaletteColor?: boolean
}

export const ColorCommandMenu = memo(
  forwardRef<ColorCommandMenuProps, "div">(
    (
      {
        value,
        name = getColorName(value),
        children,
        hiddenGenerators,
        enabledEditPaletteColor,
        triggerProps,
        ...rest
      },
      ref,
    ) => {
      const { palettes } = useApp()
      const palette = usePalette()

      const omittedPalettes = useMemo(
        () => palettes.filter(({ uuid }) => uuid !== palette?.uuid),
        [palette, palettes],
      )

      const hasPalettes = !!omittedPalettes.length

      return (
        <ContextMenu
          modifiers={[
            {
              name: "preventOverflow",
              options: {
                padding: {
                  top: 16,
                  bottom: 16,
                  left: 16,
                  right: 16,
                },
              },
            },
            {
              name: "scroll",
              fn: (state) => {
                console.log(state)
              },
            },
          ]}
          {...rest}
        >
          <ContextMenuTrigger ref={ref} h="full" {...triggerProps}>
            {children}
          </ContextMenuTrigger>

          <MenuList maxW="sm">
            <ColorCommandMenuMain value={value} />

            {enabledEditPaletteColor ? (
              <>
                <MenuDivider />

                <ColorCommandMenuPaletteColor />
              </>
            ) : null}

            {!hiddenGenerators ? (
              <>
                <MenuDivider />

                <ColorCommandMenuGenerators value={value} />
              </>
            ) : null}

            {palette ? (
              <>
                <MenuDivider />

                <ColorCommandMenuPalette />
              </>
            ) : null}

            {hasPalettes ? (
              <>
                <MenuDivider />

                <ColorCommandMenuPalettes
                  name={name}
                  value={value}
                  palettes={omittedPalettes}
                />
              </>
            ) : null}
          </MenuList>
        </ContextMenu>
      )
    },
  ),
)

ColorCommandMenu.displayName = "ColorCommandMenu"

type ColorCommandMenuMainProps = {
  value: string
}

const ColorCommandMenuMain: FC<ColorCommandMenuMainProps> = memo(
  ({ value }) => {
    const { t } = useI18n()
    const { onCopy } = useClipboard(value, 5000)
    const notice = useNotice({
      limit: 1,
      placement: "bottom",
      component: () => (
        <CopiedColorNotice value={value}>
          {t("component.copied-color-notice.copied")}
        </CopiedColorNotice>
      ),
    })

    return (
      <>
        <MenuItem as={Link} href={`/colors/${value.replace("#", "")}`}>
          {t("component.color-command-menu.see")}
        </MenuItem>

        <MenuItem
          as={Link}
          href={`/contrast-checker?light.fg=${value.replace("#", "")}&dark.fg=${value.replace("#", "")}`}
        >
          {t("component.color-command-menu.check")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onCopy()
            notice()
          }}
        >
          {t("component.color-command-menu.copy")}
        </MenuItem>
      </>
    )
  },
)

ColorCommandMenuMain.displayName = "ColorCommandMenuMain"

type ColorCommandMenuPaletteColorProps = {}

const ColorCommandMenuPaletteColor: FC<ColorCommandMenuPaletteColorProps> =
  memo(() => {
    const { id, name: nameProp, hex } = useHex()
    const { onEdit, onDelete, colorMode } = useHexes()
    const isSubmitRef = useRef<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure({
      onClose: () => {
        if (!isSubmitRef.current) {
          setName(nameProp)
          setColor(resolvedHex)
        }

        isSubmitRef.current = false
      },
    })
    const { t } = useI18n()
    const [lightHex, darkHex] = hex
    const resolvedHex = colorMode === "light" ? lightHex : darkHex
    const [name, setName] = useState<string>(nameProp)
    const [color, setColor] = useState<string>(resolvedHex)

    const onSubmit = () => {
      isSubmitRef.current = true

      const hex: [string, string] =
        colorMode === "light" ? [color, darkHex] : [lightHex, color]

      onEdit({ id, name, hex })

      onClose()
    }

    return (
      <>
        <MenuGroup
          label={t("component.color-command-menu.palette-color.label")}
        >
          <MenuItem closeOnSelect={false} onClick={onOpen}>
            {t(`component.color-command-menu.palette-color.edit`)}
          </MenuItem>

          <MenuItem onClick={() => onDelete(id)}>
            {t(`component.color-command-menu.palette-color.delete`)}
          </MenuItem>
        </MenuGroup>

        <Modal isOpen={isOpen} onClose={onClose} withCloseButton={false}>
          <ModalBody>
            <PaletteColorForm
              name={name}
              onChangeName={setName}
              color={color}
              onChangeColor={setColor}
              onSubmit={onSubmit}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!name.length}
              w="full"
              colorScheme="neutral"
              borderColor="transparent"
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              onClick={onSubmit}
              _hover={{ _disabled: {} }}
            >
              {t("palette.edit.submit")}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  })

ColorCommandMenuPaletteColor.displayName = "ColorCommandMenuPaletteColor"

type ColorCommandMenuPaletteProps = {}

const ColorCommandMenuPalette: FC<ColorCommandMenuPaletteProps> = memo(({}) => {
  const { t } = useI18n()
  const { onClone } = useHexes()
  const paletteColor = useHex()

  return (
    <MenuGroup label={t("component.color-command-menu.palette.label")}>
      <MenuItem onClick={() => onClone(paletteColor)}>
        {t(`component.color-command-menu.palette.add`)}
      </MenuItem>
    </MenuGroup>
  )
})

ColorCommandMenuPalette.displayName = "ColorCommandMenuPalette"

type ColorCommandMenuGeneratorsProps = {
  value: string
}

const ColorCommandMenuGenerators: FC<ColorCommandMenuGeneratorsProps> = memo(
  ({ value }) => {
    const { t } = useI18n()

    return (
      <MenuGroup label={t("component.color-command-menu.generators.label")}>
        {CONSTANT.ENUM.GENERATORS.map((tab) => (
          <MenuItem
            key={tab}
            as={Link}
            href={`/generators?hex=${value.replace("#", "")}&tab=${tab}`}
          >
            {t(`component.color-command-menu.generators.${tab}`)}
          </MenuItem>
        ))}
      </MenuGroup>
    )
  },
)

ColorCommandMenuGenerators.displayName = "ColorCommandMenuGenerators"

type ColorCommandMenuPalettesProps = {
  name: string
  value: string
  palettes: ColorPalettes
}

const ColorCommandMenuPalettes: FC<ColorCommandMenuPalettesProps> = memo(
  ({ name: colorName, palettes, value }) => {
    const { t, tc } = useI18n()
    const { changePalette } = useApp()

    return (
      <MenuGroup label={t("component.color-command-menu.palettes.label")}>
        {palettes.map(({ uuid, name, colors, ...rest }) => (
          <MenuItem
            key={uuid}
            onClick={() =>
              changePalette({
                uuid,
                name,
                colors: [...colors, { hex: [value, value], name: colorName }],
                ...rest,
              })
            }
          >
            {tc(`component.color-command-menu.palettes.button`, (str) => (
              <Text as="span" lineClamp={1}>
                {str === "color" ? value : name}
              </Text>
            ))}
          </MenuItem>
        ))}
      </MenuGroup>
    )
  },
)

ColorCommandMenuPalettes.displayName = "ColorCommandMenuPalettes"
