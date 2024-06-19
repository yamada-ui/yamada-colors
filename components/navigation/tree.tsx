import {
  Palette,
  Compass,
  Paintbrush,
  Contrast,
  History,
} from "@yamada-ui/lucide"
import type { BoxProps, StackProps } from "@yamada-ui/react"
import {
  Box,
  HStack,
  Text,
  VStack,
  forwardRef,
  isString,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { ReactNode } from "react"
import { memo } from "react"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

export type TreeProps = BoxProps & {
  isAside?: boolean
}

export const Tree = memo(
  forwardRef<TreeProps, "nav">(({ isAside, ...rest }, ref) => {
    const { hex } = useApp()
    const { t } = useI18n()

    const hexes = {
      light: isString(hex) ? hex : hex?.[0],
      dark: isString(hex) ? hex : hex?.[1],
    }

    return (
      <Box ref={ref} as="nav" w="full" {...rest}>
        <VStack as="ul" w="full" gap="sm">
          <TreeItem
            href="/"
            icon={<Compass fontSize="1.5rem" />}
            isAside={isAside}
          >
            {t("app.title")}
          </TreeItem>
          <TreeItem
            href="/palettes"
            icon={<Palette fontSize="1.5rem" />}
            isAside={isAside}
          >
            {t("palettes.title")}
          </TreeItem>
          <TreeItem
            href={`/generators?hex=${hexes.light?.replace("#", "")}`}
            icon={<Paintbrush fontSize="1.5rem" />}
            isAside={isAside}
          >
            {t("generators.title")}
          </TreeItem>
          <TreeItem
            href={`/contrast-checker?light.fg=${hexes.light?.replace("#", "")}&dark.fg=${hexes.dark?.replace("#", "")}`}
            icon={<Contrast fontSize="1.5rem" />}
            isAside={isAside}
          >
            {t("contrast-checker.title")}
          </TreeItem>
          <TreeItem
            href="/history"
            icon={<History fontSize="1.5rem" />}
            isAside={isAside}
          >
            {t("history.title")}
          </TreeItem>
        </VStack>
      </Box>
    )
  }),
)

export type TreeItemProps = StackProps & {
  icon?: ReactNode
  href: string
  isAside?: boolean
}

export const TreeItem = memo(
  forwardRef<TreeItemProps, "a">(
    ({ isAside, icon = null, href, children, ...rest }, ref) => {
      const router = useRouter()
      const { asPath } = router
      const trulyHref = href.split("?")[0]
      const isSelected =
        trulyHref === "/" ? asPath === trulyHref : asPath.startsWith(trulyHref)

      return (
        <Box as="li" w="full">
          <HStack
            ref={ref}
            as={Link}
            href={href}
            bg={
              isSelected
                ? isAside
                  ? ["white", "black"]
                  : ["blackAlpha.200", "blackAlpha.700"]
                : undefined
            }
            color={!isSelected ? "muted" : undefined}
            rounded="md"
            w="full"
            h="12"
            px="md"
            gap="sm"
            outline="none"
            transitionProperty="common"
            transitionDuration="slower"
            _hover={{
              color: !isSelected ? ["black", "white"] : undefined,
            }}
            _focusVisible={{
              boxShadow: "outline",
            }}
            {...rest}
          >
            {icon}

            <Text as="span">{children}</Text>
          </HStack>
        </Box>
      )
    },
  ),
)
