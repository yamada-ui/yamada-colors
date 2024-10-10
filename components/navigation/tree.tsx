import type { BoxProps, StackProps } from "@yamada-ui/react"
import type { ReactNode } from "react"
import {
  Compass,
  Contrast,
  History,
  Paintbrush,
  Palette,
} from "@yamada-ui/lucide"
import {
  Box,
  forwardRef,
  HStack,
  isString,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo } from "react"

export interface TreeProps extends BoxProps {
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
        <VStack as="ul" gap="sm" w="full">
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

export interface TreeItemProps extends StackProps {
  href: string
  icon?: ReactNode
  isAside?: boolean
}

export const TreeItem = memo(
  forwardRef<TreeItemProps, "a">(
    ({ href, children, icon = null, isAside, ...rest }, ref) => {
      const router = useRouter()
      const { asPath } = router
      const trulyHref = href.split("?")[0] ?? ""
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
            gap="sm"
            h="12"
            outline="none"
            px="md"
            rounded="md"
            transitionDuration="slower"
            transitionProperty="common"
            w="full"
            _focusVisible={{
              boxShadow: "outline",
            }}
            _hover={{
              color: !isSelected ? ["black", "white"] : undefined,
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
