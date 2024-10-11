import type {
  CenterProps,
  ColorMode,
  DrawerProps,
  IconButtonProps,
  MenuProps,
  UseDisclosureReturn,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { Locale } from "utils/i18n"
import {
  Box as BoxIcon,
  Languages,
  Menu as MenuIcon,
  Moon,
  Search as SearchIcon,
  Sun,
} from "@yamada-ui/lucide"
import {
  Box,
  Center,
  CloseButton,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerHeader,
  forwardRef,
  HStack,
  IconButton,
  Image,
  isString,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuOptionItem,
  mergeRefs,
  Spacer,
  useBreakpoint,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useMotionValueEvent,
  useScroll,
  useUpdateEffect,
  VStack,
} from "@yamada-ui/react"
import { SearchColor } from "components/forms"
import { Discord, Github } from "components/media-and-icons"
import { NextLinkIconButton, Tree } from "components/navigation"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useEffect, useRef, useState } from "react"
import { f } from "utils/color"

export interface HeaderProps extends CenterProps {}

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const menuControls = useDisclosure()
    const searchControls = useDisclosure()
    const { height = 0 } = headerRef.current?.getBoundingClientRect() ?? {}

    useMotionValueEvent(scrollY, "change", setY)

    const isScroll = y > height

    return (
      <>
        <Center
          ref={mergeRefs(ref, headerRef)}
          as="header"
          left="0"
          position="sticky"
          right="0"
          top="0"
          w="full"
          zIndex="jeice"
          {...rest}
        >
          <Center maxW="9xl" px={{ base: "lg", lg: "0" }} w="full">
            <VStack
              backdropBlur="10px"
              backdropFilter="auto"
              backdropSaturate="180%"
              bg={["blackAlpha.50", "whiteAlpha.100"]}
              gap="0"
              px={{ base: "lg", lg: "md" }}
              py="3"
              roundedBottom="2xl"
              shadow={isScroll ? ["base", "dark-sm"] : undefined}
              transitionDuration="slower"
              transitionProperty="common"
              w="full"
            >
              <HStack gap={{ base: "md", sm: "sm" }}>
                <Center
                  as={Link}
                  href="/"
                  aria-label="Yamada UI"
                  rounded="md"
                  transitionDuration="slower"
                  transitionProperty="opacity"
                  _focus={{ outline: "none" }}
                  _focusVisible={{ boxShadow: "outline" }}
                  _hover={{ opacity: 0.7 }}
                >
                  <Image
                    src="/logo-black.png"
                    alt="Yamada Colors"
                    h={{ base: "8", sm: "7" }}
                    w="auto"
                    _dark={{ display: "none" }}
                  />
                  <Image
                    src="/logo-white.png"
                    alt="Yamada Colors"
                    h={{ base: "8", sm: "7" }}
                    w="auto"
                    _light={{ display: "none" }}
                  />
                </Center>

                <Spacer />

                <>
                  <Search isScroll={isScroll} />

                  <IconButton
                    variant="ghost"
                    aria-label="Open navigation menu"
                    color="muted"
                    display={{ base: "none", sm: "inline-flex" }}
                    icon={<SearchIcon fontSize="1.5rem" />}
                    isRounded
                    onClick={searchControls.onToggle}
                  />
                </>

                <ButtonGroup {...menuControls} />
              </HStack>

              <Collapse isOpen={searchControls.isOpen}>
                <Box p="1">
                  <Search isMobile isScroll={isScroll} />
                </Box>
              </Collapse>
            </VStack>
          </Center>
        </Center>

        <MobileMenu {...menuControls} />
      </>
    )
  }),
)

const disableDefaultValue = (path: string) =>
  path === "/" || /^\/(history|categories|palettes)/.test(path)

interface SearchProps {
  isScroll: boolean
  isMobile?: boolean
}

const Search: FC<SearchProps> = memo(({ isMobile, isScroll }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const router = useRouter()
  const { format, hex } = useApp()
  const [value, setValue] = useState<string | undefined>(() => {
    if (disableDefaultValue(router.asPath)) {
      return undefined
    } else {
      return f(isString(hex) ? hex : hex?.[0], format)
    }
  })

  useUpdateEffect(() => {
    if (disableDefaultValue(router.asPath)) return

    setValue(f(isString(hex) ? hex : hex?.[0], format))
  }, [hex])

  return (
    <SearchColor
      isRemoveScroll={isMobile}
      matchWidth
      maxW={!isMobile ? { base: "sm", md: "xs" } : "full"}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              bottom: padding,
              left: padding,
              right: padding,
              top: padding,
            },
          },
        },
      ]}
      strategy={isMobile ? "fixed" : "absolute"}
      transitionDuration="slower"
      transitionProperty="common"
      value={value}
      _hover={{}}
      containerProps={{
        display: !isMobile
          ? { base: "block", sm: "none" }
          : { base: "none", sm: "block" },
        mt: isMobile ? "3" : "0",
      }}
      fieldProps={{
        backdropBlur: "10px",
        backdropFilter: "auto",
        backdropSaturate: "180%",
        bg: isScroll
          ? ["whiteAlpha.600", "blackAlpha.500"]
          : ["whiteAlpha.900", "blackAlpha.600"],
        borderColor: "transparent",
      }}
      onChange={setValue}
      onSubmit={(value) => {
        router.push(`/colors/${value.replace("#", "")}`)
      }}
    />
  )
})

Search.displayName = "Search"

interface ButtonGroupProps extends Partial<UseDisclosureReturn> {
  isMobile?: boolean
}

const ButtonGroup: FC<ButtonGroupProps> = memo(
  ({ isMobile, isOpen, onClose, onOpen }) => {
    return (
      <HStack gap="sm">
        <NextLinkIconButton
          href={CONSTANT.SNS.DISCORD}
          variant="ghost"
          aria-label="GitHub repository"
          color="muted"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          icon={<Discord />}
          isExternal
          isRounded
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
        />

        <NextLinkIconButton
          href={CONSTANT.SNS.GITHUB.YAMADA_COLORS}
          variant="ghost"
          aria-label="Discord server"
          color="muted"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          icon={<Github />}
          isExternal
          isRounded
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
        />

        <FormatButton />

        <I18nButton
          display={{
            base: "inline-flex",
            md: !isMobile ? "none" : undefined,
          }}
        />

        <ColorModeButton
          display={{ base: "inline-flex", sm: !isMobile ? "none" : undefined }}
        />

        {!isOpen ? (
          <IconButton
            variant="ghost"
            aria-label="Open navigation menu"
            color="muted"
            display={{ base: "none", lg: "inline-flex" }}
            icon={<MenuIcon fontSize="1.5rem" />}
            isRounded
            _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
            onClick={onOpen}
          />
        ) : (
          <CloseButton
            size="lg"
            aria-label="Close navigation menu"
            color="muted"
            display={{ base: "none", lg: "inline-flex" }}
            isRounded
            _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
            onClick={onClose}
          />
        )}
      </HStack>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"

interface I18nButtonProps extends IconButtonProps {
  menuProps?: MenuProps
}

const I18nButton: FC<I18nButtonProps> = memo(({ menuProps, ...rest }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const { changeLocale, locale } = useI18n()

  return (
    <Menu
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              bottom: padding,
              left: padding,
              right: padding,
              top: padding,
            },
          },
        },
      ]}
      placement="bottom"
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        variant="ghost"
        aria-label="Open language switching menu"
        color="muted"
        icon={<Languages fontSize="1.5rem" />}
        isRounded
        _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<Locale>
          type="radio"
          value={locale}
          onChange={changeLocale}
        >
          {CONSTANT.I18N.LOCALES.map(({ label, value }) => (
            <MenuOptionItem key={value} closeOnSelect value={value}>
              {label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

I18nButton.displayName = "I18nButton"

interface ColorModeButtonProps extends IconButtonProps {
  menuProps?: MenuProps
}

const ColorModeButton: FC<ColorModeButtonProps> = memo(
  ({ menuProps, ...rest }) => {
    const padding = useBreakpointValue({ base: 32, md: 16 })
    const { changeColorMode, colorMode, internalColorMode } = useColorMode()

    return (
      <Menu
        modifiers={[
          {
            name: "preventOverflow",
            options: {
              padding: {
                bottom: padding,
                left: padding,
                right: padding,
                top: padding,
              },
            },
          },
        ]}
        placement="bottom"
        restoreFocus={false}
        {...menuProps}
      >
        <MenuButton
          as={IconButton}
          variant="ghost"
          aria-label="Open color mode switching menu"
          color="muted"
          icon={
            colorMode === "dark" ? (
              <Sun fontSize="1.5rem" />
            ) : (
              <Moon fontSize="1.5rem" />
            )
          }
          isRounded
          _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
          {...rest}
        />

        <MenuList>
          <MenuOptionGroup<"system" | ColorMode>
            type="radio"
            value={internalColorMode}
            onChange={changeColorMode}
          >
            <MenuOptionItem closeOnSelect value="light">
              Light
            </MenuOptionItem>
            <MenuOptionItem closeOnSelect value="dark">
              Dark
            </MenuOptionItem>
            <MenuOptionItem closeOnSelect value="system">
              System
            </MenuOptionItem>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  },
)

ColorModeButton.displayName = "ColorModeButton"

interface FormatButtonProps extends IconButtonProps {
  menuProps?: MenuProps
}

const FormatButton: FC<FormatButtonProps> = memo(({ menuProps, ...rest }) => {
  const { changeFormat, format } = useApp()
  const padding = useBreakpointValue({ base: 32, md: 16 })

  return (
    <Menu
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              bottom: padding,
              left: padding,
              right: padding,
              top: padding,
            },
          },
        },
      ]}
      placement="bottom"
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        variant="ghost"
        aria-label="Open color mode switching menu"
        color="muted"
        icon={<BoxIcon fontSize="1.5rem" />}
        isRounded
        _hover={{ bg: [`blackAlpha.100`, `whiteAlpha.50`] }}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<ColorFormat>
          type="radio"
          value={format}
          onChange={changeFormat}
        >
          <MenuOptionItem closeOnSelect value="hex">
            HEX
          </MenuOptionItem>
          <MenuOptionItem closeOnSelect value="rgb">
            RGB
          </MenuOptionItem>
          <MenuOptionItem closeOnSelect value="hsl">
            HSL
          </MenuOptionItem>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

FormatButton.displayName = "FormatButton"

interface MobileMenuProps extends DrawerProps {}

const MobileMenu: FC<MobileMenuProps> = memo(({ isOpen, onClose }) => {
  const { format, hex } = useApp()
  const { events } = useRouter()
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (!["lg", "md", "sm"].includes(breakpoint)) onClose?.()
  }, [breakpoint, onClose])

  useEffect(() => {
    events.on("routeChangeComplete", () => onClose?.())

    return () => {
      events.off("routeChangeComplete", () => onClose?.())
    }
  }, [events, onClose])

  return (
    <Drawer
      isFullHeight
      isOpen={isOpen}
      roundedLeft="xl"
      w="auto"
      withCloseButton={false}
      onClose={onClose}
    >
      <DrawerHeader
        fontSize="md"
        fontWeight="normal"
        justifyContent="flex-end"
        pt="sm"
      >
        <ButtonGroup isMobile {...{ format, isOpen, onClose }} />
      </DrawerHeader>

      <DrawerBody my="md">
        <Tree hex={hex} />
      </DrawerBody>
    </Drawer>
  )
})

MobileMenu.displayName = "MobileMenu"
