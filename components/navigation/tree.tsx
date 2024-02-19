import type { BoxProps, StackProps } from "@yamada-ui/react"
import { Box, HStack, Text, VStack, forwardRef } from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { ReactNode } from "react"
import { memo } from "react"
import {
  ColorPalette,
  Compass,
  Brush,
  Contrast,
  History,
} from "components/media-and-icons"
import { useI18n } from "contexts/i18n-context"

export type TreeProps = BoxProps & { hex?: string; isAside?: boolean }

export const Tree = memo(
  forwardRef<TreeProps, "nav">(({ hex, isAside, ...rest }, ref) => {
    const { t } = useI18n()
    hex ??= `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`

    return (
      <Box ref={ref} as="nav" w="full" {...rest}>
        <VStack as="ul" w="full" gap="sm">
          <TreeItem
            href="/"
            icon={<Compass boxSize="1.2em" />}
            isAside={isAside}
          >
            {t("app.title")}
          </TreeItem>
          <TreeItem
            href="/palettes"
            icon={<ColorPalette boxSize="1.2em" />}
            isAside={isAside}
          >
            {t("palettes.title")}
          </TreeItem>
          <TreeItem
            href={`/generators?hex=${hex?.replace("#", "")}`}
            icon={<Brush boxSize="1.2em" />}
            isAside={isAside}
          >
            {t("generators.title")}
          </TreeItem>
          <TreeItem
            href={`/contrast-checker?hex=${hex?.replace("#", "")}`}
            icon={<Contrast boxSize="1.2em" />}
            isAside={isAside}
          >
            {t("contrast-checker.title")}
          </TreeItem>
          <TreeItem
            href="/history"
            icon={<History boxSize="1.2em" />}
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
      const isSelected =
        href === "/" ? asPath === href : asPath.startsWith(href)

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
