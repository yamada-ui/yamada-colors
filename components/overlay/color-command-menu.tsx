import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "@yamada-ui/react"
import type { FC } from "react"
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  forwardRef,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  useClipboard,
  useDisclosure,
  useNotice,
} from "@yamada-ui/react"
import { CopiedColorNotice } from "components/feedback"
import { PaletteColorForm } from "components/forms"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { useHex, useHexes } from "pages/palettes/[uuid]/context"
import { memo, useMemo, useRef, useState } from "react"
import { getColorName } from "utils/color-name-list"

export interface ColorCommandMenuProps extends ContextMenuProps {
  value: string
  name?: string
  hiddenGenerators?: boolean
  uuid?: string
  triggerProps?: ContextMenuTriggerProps
}

export const ColorCommandMenu = memo(
  forwardRef<ColorCommandMenuProps, "div">(
    (
      {
        value,
        name = getColorName(value),
        children,
        hiddenGenerators,
        uuid,
        triggerProps,
        ...rest
      },
      ref,
    ) => {
      const { palettes } = useApp()

      const omittedPalettes = useMemo(
        () => palettes.filter((palette) => uuid !== palette.uuid),
        [palettes, uuid],
      )

      const hasPalettes = !!omittedPalettes.length

      return (
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
            <ColorCommandMenuMain value={value} />

            {!!uuid ? (
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

            {!!uuid ? (
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
                  palettes={omittedPalettes}
                  value={value}
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

interface ColorCommandMenuMainProps {
  value: string
}

const ColorCommandMenuMain: FC<ColorCommandMenuMainProps> = memo(
  ({ value }) => {
    const { t } = useI18n()
    const { onCopy } = useClipboard(value, 5000)
    const notice = useNotice({
      component: () => (
        <CopiedColorNotice value={value}>
          {t("component.copied-color-notice.copied")}
        </CopiedColorNotice>
      ),
      limit: 1,
      placement: "bottom",
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

interface ColorCommandMenuPaletteColorProps {}

const ColorCommandMenuPaletteColor: FC<ColorCommandMenuPaletteColorProps> =
  memo(() => {
    const { id, name: nameProp, hex } = useHex()
    const { colorMode, onDelete, onEdit } = useHexes()
    const isSubmitRef = useRef<boolean>(false)
    const { isOpen, onClose, onOpen } = useDisclosure({
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

        <Modal isOpen={isOpen} withCloseButton={false} onClose={onClose}>
          <ModalBody>
            <PaletteColorForm
              name={name}
              color={color}
              onChangeColor={setColor}
              onChangeName={setName}
              onSubmit={onSubmit}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="neutral"
              bg={["blackAlpha.200", "whiteAlpha.100"]}
              borderColor="transparent"
              isDisabled={!name.length}
              w="full"
              _hover={{ _disabled: {} }}
              onClick={onSubmit}
            >
              {t("palette.edit.submit")}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  })

ColorCommandMenuPaletteColor.displayName = "ColorCommandMenuPaletteColor"

interface ColorCommandMenuPaletteProps {}

const ColorCommandMenuPalette: FC<ColorCommandMenuPaletteProps> = memo(() => {
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

interface ColorCommandMenuGeneratorsProps {
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

interface ColorCommandMenuPalettesProps {
  name: string
  palettes: ColorPalettes
  value: string
}

const ColorCommandMenuPalettes: FC<ColorCommandMenuPalettesProps> = memo(
  ({ name: colorName, palettes, value }) => {
    const { t, tc } = useI18n()
    const { changePalette } = useApp()

    return (
      <MenuGroup label={t("component.color-command-menu.palettes.label")}>
        {palettes.map(({ name, colors, uuid, ...rest }) => (
          <MenuItem
            key={uuid}
            onClick={() =>
              changePalette({
                name,
                colors: [...colors, { name: colorName, hex: [value, value] }],
                uuid,
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
