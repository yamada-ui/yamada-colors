import type {
  BoxProps,
  CenterProps,
  ColorPickerProps,
  DrawerProps,
  IconButtonProps,
  MenuProps,
  UseDisclosureReturn,
} from "@yamada-ui/react"
import {
  Box,
  Center,
  CloseButton,
  ColorPicker,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuOptionItem,
  Ripple,
  Spacer,
  Text,
  VStack,
  forwardRef,
  mergeRefs,
  noop,
  useBreakpoint,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useMotionValueEvent,
  useRipple,
  useScroll,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { FC } from "react"
import { memo, useEffect, useRef, useState } from "react"
import {
  Discord,
  Github,
  Hamburger,
  MagnifyingGlass,
  Moon,
  Sun,
  Translate,
} from "components/media-and-icons"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"

export type HeaderProps = CenterProps & {}

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { height = 0 } = headerRef.current?.getBoundingClientRect() ?? {}

    useMotionValueEvent(scrollY, "change", setY)

    const isScroll = y > height

    return (
      <>
        <Center
          ref={mergeRefs(ref, headerRef)}
          as="header"
          w="full"
          position="sticky"
          top="0"
          left="0"
          right="0"
          zIndex="guldo"
          {...rest}
        >
          <Center w="full" maxW="9xl" px={{ base: "lg", lg: "0" }}>
            <HStack
              w="full"
              py="3"
              px={{ base: "lg", lg: "md" }}
              gap={{ base: "md", sm: "sm" }}
              bg={["blackAlpha.50", "whiteAlpha.100"]}
              backdropFilter="auto"
              backdropSaturate="180%"
              backdropBlur="10px"
              transitionProperty="common"
              transitionDuration="slower"
              roundedBottom="xl"
              shadow={isScroll ? ["base", "dark-sm"] : undefined}
            >
              <Box
                as={Link}
                href="/"
                aria-label="Yamada UI"
                _hover={{ opacity: 0.7 }}
                transitionProperty="opacity"
                transitionDuration="slower"
                _focus={{ outline: "none" }}
                _focusVisible={{ boxShadow: "outline" }}
                rounded="md"
              >
                <Text as="span" fontSize="xl" fontWeight="semibold">
                  Yamada Colors
                </Text>
              </Box>

              <Spacer />

              <Search isScroll={isScroll} />

              <ButtonGroup {...{ isOpen, onOpen }} />
            </HStack>
          </Center>
        </Center>

        <MobileMenu isOpen={isOpen} onClose={onClose} />
      </>
    )
  }),
)

type SearchProps = ColorPickerProps & { isScroll: boolean }

const Search: FC<SearchProps> = memo(({ isScroll, ...rest }) => {
  return (
    <>
      <ColorPicker
        maxW={{ base: "sm", md: "xs" }}
        matchWidth
        colorSelectorSize="md"
        display={{ base: "block", sm: "none" }}
        // TODO: Remove once updated
        swatchProps={{ zIndex: 2 }}
        borderColor="transparent"
        _hover={{}}
        bg={
          isScroll
            ? ["whiteAlpha.600", "blackAlpha.500"]
            : ["whiteAlpha.900", "blackAlpha.700"]
        }
        rounded="full"
        backdropFilter="auto"
        backdropSaturate="180%"
        backdropBlur="10px"
        transitionProperty="common"
        transitionDuration="slower"
        eyeDropperProps={{ rounded: "full" }}
        {...rest}
      />

      <IconButton
        variant="ghost"
        isRounded
        aria-label="Open navigation menu"
        display={{ base: "none", sm: "inline-flex" }}
        color="muted"
        onClick={noop}
        icon={<MagnifyingGlass />}
      />
    </>
  )
})

Search.displayName = "Search"

type ButtonGroupProps = Partial<UseDisclosureReturn> & { isMobile?: boolean }

const ButtonGroup: FC<ButtonGroupProps> = memo(
  ({ isMobile, isOpen, onOpen, onClose }) => {
    return (
      <HStack gap="sm">
        <NextLinkIconButton
          href={CONSTANT.SNS.DISCORD}
          isExternal
          isRounded
          aria-label="GitHub repository"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Discord />}
        />

        <NextLinkIconButton
          href={CONSTANT.SNS.GITHUB.YAMADA_COLORS}
          isExternal
          isRounded
          aria-label="Discord server"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Github />}
        />

        {CONSTANT.I18N.LOCALES.length > 1 ? (
          <I18nButton
            display={{
              base: "inline-flex",
              md: !isMobile ? "none" : undefined,
            }}
          />
        ) : null}

        <ColorModeButton
          display={{ base: "inline-flex", sm: !isMobile ? "none" : undefined }}
        />

        {!isOpen ? (
          <IconButton
            variant="ghost"
            isRounded
            aria-label="Open navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onOpen}
            icon={<Hamburger />}
          />
        ) : (
          <CloseButton
            size="lg"
            // TODO: Remove once updated
            rounded="full"
            aria-label="Close navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onClose}
          />
        )}
      </HStack>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"

type I18nButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const I18nButton: FC<I18nButtonProps> = memo(({ menuProps, ...rest }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const { locale, changeLocale } = useI18n()

  return (
    <Menu
      placement="bottom"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
          },
        },
      ]}
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        aria-label="Open language switching menu"
        isRounded
        variant="ghost"
        color="muted"
        icon={<Translate />}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<string>
          value={locale}
          onChange={changeLocale}
          type="radio"
        >
          {CONSTANT.I18N.LOCALES.map(({ label, value }) => (
            <MenuOptionItem key={value} value={value} closeOnSelect>
              {label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

I18nButton.displayName = "I18nButton"

type ColorModeButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const ColorModeButton: FC<ColorModeButtonProps> = memo(
  ({ menuProps, ...rest }) => {
    const padding = useBreakpointValue({ base: 32, md: 16 })
    const { colorMode, internalColorMode, changeColorMode } = useColorMode()

    return (
      <Menu
        placement="bottom"
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              padding: {
                top: padding,
                bottom: padding,
                left: padding,
                right: padding,
              },
            },
          },
        ]}
        restoreFocus={false}
        {...menuProps}
      >
        <MenuButton
          as={IconButton}
          aria-label="Open color mode switching menu"
          isRounded
          variant="ghost"
          color="muted"
          icon={colorMode === "dark" ? <Sun /> : <Moon />}
          {...rest}
        />

        <MenuList>
          <MenuOptionGroup<string>
            value={internalColorMode}
            onChange={changeColorMode}
            type="radio"
          >
            <MenuOptionItem value="light" closeOnSelect>
              Light
            </MenuOptionItem>
            <MenuOptionItem value="dark" closeOnSelect>
              Dark
            </MenuOptionItem>
            <MenuOptionItem value="system" closeOnSelect>
              System
            </MenuOptionItem>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  },
)

ColorModeButton.displayName = "ColorModeButton"

type ColorButtonProps = BoxProps & {
  colorScheme: string
}

const ColorButton: FC<ColorButtonProps> = memo(({ colorScheme, ...rest }) => {
  const { onPointerDown, ...rippleProps } = useRipple({})

  return (
    <Box
      as="button"
      type="button"
      position="relative"
      overflow="hidden"
      bg={`${colorScheme}.500`}
      minW={{ base: "12", md: "10" }}
      minH={{ base: "12", md: "10" }}
      rounded="md"
      boxShadow="inner"
      outline="0"
      _hover={{ bg: `${colorScheme}.600` }}
      _active={{ bg: `${colorScheme}.700` }}
      _focusVisible={{ shadow: "outline" }}
      transitionProperty="common"
      transitionDuration="slower"
      {...rest}
      onPointerDown={onPointerDown}
    >
      <Ripple {...rippleProps} />
    </Box>
  )
})

ColorButton.displayName = "ColorButton"

type MobileMenuProps = DrawerProps

const MobileMenu: FC<MobileMenuProps> = memo(({ isOpen, onClose }) => {
  const { events } = useRouter()
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (!["lg", "md", "sm"].includes(breakpoint)) onClose()
  }, [breakpoint, onClose])

  useEffect(() => {
    events.on("routeChangeComplete", onClose)

    return () => {
      events.off("routeChangeComplete", onClose)
    }
  }, [events, onClose])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      withCloseButton={false}
      isFullHeight
      roundedLeft="xl"
    >
      <DrawerHeader
        justifyContent="flex-end"
        pt="sm"
        fontSize="md"
        fontWeight="normal"
      >
        <ButtonGroup isMobile {...{ isOpen, onClose }} />
      </DrawerHeader>

      <DrawerBody position="relative" my="sm">
        <VStack
          as="nav"
          overflowY="scroll"
          overscrollBehavior="contain"
        ></VStack>

        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="kurillin"
          w="full"
          h="3"
          bgGradient={[
            "linear(to-t, rgba(255, 255, 255, 0), white)",
            "linear(to-t, rgba(0, 0, 0, 0), black)",
          ]}
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          zIndex="kurillin"
          w="full"
          h="3"
          bgGradient={[
            "linear(to-b, rgba(255, 255, 255, 0), white)",
            "linear(to-b, rgba(0, 0, 0, 0), black)",
          ]}
        />
      </DrawerBody>
    </Drawer>
  )
})

MobileMenu.displayName = "MobileMenu"
