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
} from "@yamada-ui/react"
import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"
import { memo } from "react"
import { CopiedColorNotice } from "components/feedback"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { getColorName } from "utils/color-name-list"

export type ColorCommandMenuProps = ContextMenuProps & {
  name?: string
  value: string
  triggerProps?: ContextMenuTriggerProps
  hiddenGenerators?: boolean
}

export const ColorCommandMenu = memo(
  forwardRef<ColorCommandMenuProps, "div">(
    (
      {
        value,
        name = getColorName(value),
        children,
        hiddenGenerators,
        triggerProps,
        ...rest
      },
      ref,
    ) => {
      const { palettes } = useApp()
      const hasPalettes = !!palettes.length

      return (
        <ContextMenu {...rest}>
          <ContextMenuTrigger ref={ref} h="full" {...triggerProps}>
            {children}
          </ContextMenuTrigger>

          <MenuList maxW="sm">
            <ColorCommandMenuMain value={value} />

            {!hiddenGenerators ? (
              <>
                <MenuDivider />

                <ColorCommandMenuGenerators value={value} />
              </>
            ) : null}

            {hasPalettes ? (
              <>
                <MenuDivider />

                <ColorCommandMenuPalettes name={name} value={value} />
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
}

const ColorCommandMenuPalettes: FC<ColorCommandMenuPalettesProps> = memo(
  ({ name: colorName, value }) => {
    const { t, tc } = useI18n()
    const { palettes, changePalette } = useApp()

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
              <Text as="span" fontWeight="semibold" lineClamp={1}>
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
