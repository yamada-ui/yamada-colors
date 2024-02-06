import type { StackProps } from "@yamada-ui/react"
import {
  HStack,
  Ripple,
  Text,
  VStack,
  forwardRef,
  handlerAll,
  useRipple,
} from "@yamada-ui/react"
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
export type SidebarProps = StackProps

export const Sidebar = memo(
  forwardRef<SidebarProps, "aside">(({ ...rest }, ref) => {
    return (
      <VStack
        ref={ref}
        as="aside"
        bg={["blackAlpha.50", "whiteAlpha.100"]}
        rounded="xl"
        position="sticky"
        top="6rem"
        w="xs"
        minH="md"
        maxH="calc(100dvh - 8rem)"
        p="md"
        gap="sm"
        {...rest}
      >
        <Button href="/" icon={<Compass boxSize="1.2em" />}>
          Explore
        </Button>
        <Button href="/palettes" icon={<ColorPalette boxSize="1.2em" />}>
          My Paletters
        </Button>
        <Button href="/generator" icon={<Brush boxSize="1.2em" />}>
          Generators
        </Button>
        <Button href="/contrast-checker" icon={<Contrast boxSize="1.2em" />}>
          Contrast Checker
        </Button>
        <Button href="/history" icon={<History boxSize="1.2em" />}>
          History
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
      const { ripples, onPointerDown, onClear } = useRipple()
      const router = useRouter()
      const { asPath } = router
      const isSelected = asPath.startsWith(href)

      return (
        <HStack
          ref={ref}
          as={Link}
          href={href}
          bg={isSelected ? ["white", "black"] : undefined}
          color={!isSelected ? "muted" : undefined}
          rounded="md"
          w="full"
          h="10"
          px="md"
          gap="sm"
          transitionProperty="common"
          transitionDuration="slower"
          _hover={{
            color: !isSelected ? ["black", "white"] : undefined,
          }}
          {...rest}
          overflow="hidden"
          position="relative"
          onPointerDown={handlerAll(rest.onPointerDown, onPointerDown)}
        >
          {icon}

          <Text as="span">{children}</Text>

          <Ripple isDisabled={isSelected} ripples={ripples} onClear={onClear} />
        </HStack>
      )
    },
  ),
)
