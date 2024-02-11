import type { StackProps } from "@yamada-ui/react"
import { HStack, Text, VStack, forwardRef } from "@yamada-ui/react"
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
export type SidebarProps = StackProps

export const Sidebar = memo(
  forwardRef<SidebarProps, "aside">(({ ...rest }, ref) => {
    const { t } = useI18n()

    return (
      <VStack
        ref={ref}
        as="aside"
        bg={["blackAlpha.50", "whiteAlpha.100"]}
        rounded="2xl"
        position="sticky"
        top="6rem"
        w="17rem"
        maxH="calc(100dvh - 8rem)"
        p="md"
        gap="sm"
        {...rest}
      >
        <Button href="/" icon={<Compass boxSize="1.2em" />}>
          {t("app.title")}
        </Button>
        <Button href="/palettes" icon={<ColorPalette boxSize="1.2em" />}>
          {t("palettes.title")}
        </Button>
        <Button href="/generators" icon={<Brush boxSize="1.2em" />}>
          {t("generators.title")}
        </Button>
        <Button href="/contrast-checker" icon={<Contrast boxSize="1.2em" />}>
          {t("contrast-checker.title")}
        </Button>
        <Button href="/history" icon={<History boxSize="1.2em" />}>
          {t("history.title")}
        </Button>
      </VStack>
    )
  }),
)

export type ButtonProps = StackProps & {
  icon?: ReactNode
  href: string
}

export const Button = memo(
  forwardRef<ButtonProps, "aside">(
    ({ icon = null, href, children, ...rest }, ref) => {
      const router = useRouter()
      const { asPath } = router
      const isSelected =
        href === "/" ? asPath === href : asPath.startsWith(href)

      return (
        <HStack
          ref={ref}
          as={Link}
          href={href}
          bg={isSelected ? ["white", "black"] : undefined}
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
      )
    },
  ),
)
