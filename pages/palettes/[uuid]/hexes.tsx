import type { ColorMode, MotionProps, MotionVariants } from "@yamada-ui/react"
import type { FC } from "react"
import { GripVertical, Moon, Plus, RefreshCcw, Sun } from "@yamada-ui/lucide"
import {
  Box,
  Button,
  Center,
  ChevronIcon,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Motion,
  Reorder,
  ReorderItem,
  ReorderTrigger,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useUpdateEffect,
  VStack,
} from "@yamada-ui/react"
import { ColorCommandMenu } from "components/overlay"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import Link from "next/link"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { blindness, darken, f, isLight, lighten, tone } from "utils/color"
import { generateUUID, setCookie } from "utils/storage"
import { HexesProvider, HexProvider, useHexes, usePalette } from "./context"
import { HexControlButtons } from "./hex-control-buttons"

const DEFAULT_COLOR: PaletteColor = {
  name: "White",
  hex: ["#ffffff", "#ffffff"],
}

export interface HexesProps {}

export const Hexes: FC<HexesProps> = memo(() => {
  const {
    name,
    changeColors,
    colorMode: colorModeProp,
    colors,
    timestamp,
    uuid,
  } = usePalette()
  const { t } = useI18n()
  const { changePalette } = useApp()
  const [colorMode, setColorMode] = useState<ColorMode>(colorModeProp)
  const isLight = colorMode === "light"

  const toggleColorMode = useCallback(() => {
    const resolvedColorMode: ColorMode = isLight ? "dark" : "light"

    setCookie(CONSTANT.STORAGE.PALETTE_COLOR_MODE, resolvedColorMode)
    setColorMode(resolvedColorMode)
  }, [isLight])

  const onCreate = () => {
    const computedColors = colors.map(({ name, hex }) => ({ name, hex }))

    changeColors((prev) => [...prev, { id: generateUUID(), ...DEFAULT_COLOR }])

    changePalette({
      name,
      colors: [...computedColors, { ...DEFAULT_COLOR }],
      timestamp,
      uuid,
    })
  }

  const onEdit = useCallback(
    ({ id, ...rest }: ReorderColor) => {
      const computedColors = colors.map(({ id: targetId, name, hex }) =>
        targetId === id ? rest : { name, hex },
      )

      changeColors((prev) =>
        prev.map((color) => (color.id === id ? { id, ...rest } : color)),
      )

      changePalette({ name, colors: computedColors, timestamp, uuid })
    },
    [changePalette, colors, name, changeColors, uuid, timestamp],
  )

  const onClone = useCallback(
    ({ id, ...rest }: ReorderColor) => {
      const index = colors.findIndex((color) => color.id === id)

      const computedColors = colors.map(({ name, hex }) => ({ name, hex }))

      changeColors((prev) => [
        ...prev.slice(0, index),
        { id: generateUUID(), ...rest },
        ...prev.slice(index),
      ])

      const resolvedColors = [
        ...computedColors.slice(0, index),
        { ...rest },
        ...computedColors.slice(index),
      ]

      changePalette({ name, colors: resolvedColors, timestamp, uuid })
    },
    [changePalette, colors, name, changeColors, uuid, timestamp],
  )

  const onDelete = useCallback(
    (targetId: string) => {
      const resolvedColors = colors
        .map(({ id, name, hex }) =>
          targetId !== id ? { name, hex } : undefined,
        )
        .filter(Boolean) as PaletteColors

      changeColors((prev) => prev.filter(({ id }) => id !== targetId))

      changePalette({ name, colors: resolvedColors, timestamp, uuid })
    },
    [changePalette, colors, name, changeColors, uuid, timestamp],
  )

  const value = useMemo(
    () => ({ colorMode, toggleColorMode, onClone, onDelete, onEdit }),
    [colorMode, onClone, onEdit, onDelete, toggleColorMode],
  )

  return (
    <HexesProvider value={value}>
      <VStack as="section">
        <HexHeader />

        <HexReorder />
      </VStack>

      <Center as="section" w="full">
        <Button
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          leftIcon={<Plus fontSize="1.125rem" />}
          onClick={onCreate}
        >
          {t("palette.create")}
        </Button>
      </Center>
    </HexesProvider>
  )
})

Hexes.displayName = "Hexes"

interface HexHeaderProps {}

const HexHeader: FC<HexHeaderProps> = memo(() => {
  const { t } = useI18n()
  const { colorMode, toggleColorMode } = useHexes()

  return (
    <>
      <Grid
        display={{
          base: "grid",
          md: "none",
          lg: "grid",
          xl: "none",
        }}
        gap="lg"
        gridTemplateColumns="1fr 1fr"
      >
        <GridItem as={HStack} gap="sm" justifyContent="center">
          <Box color="muted" display="inline-flex">
            <Sun fontSize="1.5rem" />
          </Box>

          <Text fontSize="2xl" fontWeight="medium" textAlign="center">
            {t("palette.light")}
          </Text>
        </GridItem>

        <GridItem as={HStack} gap="sm" justifyContent="center">
          <Box color="muted" display="inline-flex">
            <Moon fontSize="1.5rem" />
          </Box>

          <Text fontSize="2xl" fontWeight="medium" textAlign="center">
            {t("palette.dark")}
          </Text>
        </GridItem>
      </Grid>

      <Center
        display={{
          base: "none",
          md: "flex",
          lg: "none",
          xl: "flex",
        }}
        position="relative"
      >
        <HStack gap="sm" justifyContent="center">
          <Box color="muted" display="inline-flex">
            {colorMode === "light" ? (
              <Sun fontSize="1.5rem" />
            ) : (
              <Moon fontSize="1.5rem" />
            )}
          </Box>

          <Text fontSize="2xl" fontWeight="medium" textAlign="center">
            {colorMode === "light" ? "Light" : "Dark"}
          </Text>
        </HStack>

        <IconButton
          colorScheme="neutral"
          variant="ghost"
          aria-label="Switching color mode"
          color="muted"
          icon={<RefreshCcw size="1.125rem" />}
          isRounded
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          _hover={{
            bg: ["blackAlpha.100", "whiteAlpha.100"],
          }}
          onClick={toggleColorMode}
        />
      </Center>
    </>
  )
})

HexHeader.displayName = "HexHeader"

interface HexReorderProps {}

const HexReorder: FC<HexReorderProps> = memo(() => {
  const { name, changeColors, colors, timestamp, uuid } = usePalette()
  const { t } = useI18n()
  const { colorMode, onEdit } = useHexes()
  const { changePalette } = useApp()
  const [internalColors, setInternalColors] = useState<ReorderColors>(colors)
  const internalColorIdsRef = useRef<string[]>(colors.map(({ id }) => id))

  const onChange = (ids: string[]) => {
    setInternalColors((prev) =>
      ids.map((id) => prev.find((item) => item.id === id)!),
    )

    internalColorIdsRef.current = ids
  }

  const onCompleteChange = () => {
    const resolvedColors = internalColorIdsRef.current.map((id) => {
      const { name, hex } = colors.find((item) => item.id === id)!

      return { name, hex }
    })

    changeColors(internalColors)
    changePalette({ name, colors: resolvedColors, timestamp, uuid })
  }

  useUpdateEffect(() => {
    setInternalColors(colors)
  }, [colors])

  return (
    <Reorder
      variant="unstyled"
      gap="0"
      onChange={onChange}
      onMouseUp={onCompleteChange}
      onTouchEnd={onCompleteChange}
    >
      {internalColors.map((value, index) => {
        const { id, name, hex } = value
        const isFirst = !index
        const isLast = index + 1 === colors.length
        const [lightHex, darkHex] = hex

        return (
          <ReorderItem
            key={id}
            display="grid"
            gap="sm"
            gridTemplateColumns={{
              base: "1fr auto 1fr",
              md: "1fr",
              lg: "1fr auto 1fr",
              xl: "1fr",
            }}
            value={id}
          >
            <HexProvider value={value}>
              <HexToggleItem
                display={{
                  base: "block",
                  md: colorMode !== "light" ? "none" : "block",
                  lg: "block",
                  xl: colorMode !== "light" ? "none" : "block",
                }}
                {...{ id, name, colorMode: "light", hex, isFirst, isLast }}
              />

              <VStack
                display={{ base: "flex", md: "none", lg: "flex", xl: "none" }}
                gap="0"
              >
                <Tooltip label={t("palette.apply.dark")} placement="top">
                  <IconButton
                    colorScheme="neutral"
                    variant="ghost"
                    aria-label="Sync with dark"
                    color={["blackAlpha.500", "whiteAlpha.500"]}
                    icon={
                      <ChevronIcon
                        fontSize="1.5rem"
                        transform="rotate(-90deg)"
                      />
                    }
                    isRounded
                    right="0"
                    _hover={{
                      bg: ["blackAlpha.100", "whiteAlpha.100"],
                    }}
                    onClick={() =>
                      onEdit({ id, name, hex: [lightHex, lightHex] })
                    }
                  />
                </Tooltip>

                <Tooltip label={t("palette.apply.light")} placement="top">
                  <IconButton
                    colorScheme="neutral"
                    variant="ghost"
                    aria-label="Sync with light"
                    color={["blackAlpha.500", "whiteAlpha.500"]}
                    icon={
                      <ChevronIcon
                        fontSize="1.5rem"
                        transform="rotate(90deg)"
                      />
                    }
                    isRounded
                    right="0"
                    _hover={{
                      bg: ["blackAlpha.100", "whiteAlpha.100"],
                    }}
                    onClick={() =>
                      onEdit({ id, name, hex: [darkHex, darkHex] })
                    }
                  />
                </Tooltip>
              </VStack>

              <HexToggleItem
                display={{
                  base: "block",
                  md: colorMode === "light" ? "none" : "block",
                  lg: "block",
                  xl: colorMode === "light" ? "none" : "block",
                }}
                {...{ id, name, colorMode: "dark", hex, isFirst, isLast }}
              />
            </HexProvider>
          </ReorderItem>
        )
      })}
    </Reorder>
  )
})

HexReorder.displayName = "HexReorder"

interface HexToggleItemProps
  extends Omit<HexContainerProps, "id">,
    ReorderColor {
  colorMode: ColorMode
}

const HexToggleItem: FC<HexToggleItemProps> = memo(
  ({ id, name, colorMode, display, hex, ...rest }) => {
    const { tab } = usePalette()
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]
    const isPalettes = tab === "palettes"

    return (
      <Box display={display}>
        {isPalettes ? (
          <HexControl
            id={id}
            name={name}
            colorMode={colorMode}
            hex={hex}
            {...rest}
          />
        ) : (
          <HexData hex={resolvedHex} {...rest} />
        )}
      </Box>
    )
  },
)

HexToggleItem.displayName = "HexToggleItem"

interface HexControlProps extends Omit<HexContainerProps, "id">, ReorderColor {
  colorMode: ColorMode
}

const HexControl: FC<HexControlProps> = memo(
  ({ id, name, colorMode, hex, ...rest }) => {
    const { format } = useApp()
    const { uuid } = usePalette()
    const isEditRef = useRef<boolean>(false)
    const { isOpen, onClose, onOpen } = useDisclosure()
    const isMobile = useBreakpointValue({ base: false, sm: true })
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]

    return (
      <ColorCommandMenu name={name} uuid={uuid} value={resolvedHex}>
        <HexContainer
          alignItems="center"
          bg={resolvedHex}
          display="flex"
          gap="md"
          pe="md"
          ps={{ base: "md", sm: "normal" }}
          onBlur={() => {
            if (isMobile) return

            onClose()
          }}
          onFocus={!isMobile ? onOpen : undefined}
          onHoverEnd={() => {
            if (isMobile || isEditRef.current) return

            onClose()

            isEditRef.current = false
          }}
          onHoverStart={!isMobile ? onOpen : undefined}
          {...rest}
        >
          <ReorderTrigger
            color={isLight(resolvedHex) ? "blackAlpha.500" : "whiteAlpha.500"}
            display={{ base: "block", sm: "none" }}
            opacity={{ base: isOpen ? 1 : 0 }}
            pointerEvents={{ base: "auto", sm: "none" }}
            transitionDuration="slower"
            transitionProperty="common"
          >
            <GripVertical fontSize="1.5rem" />
          </ReorderTrigger>

          <VStack
            as={Link}
            href={`/colors/${resolvedHex.replace("#", "")}`}
            color={isLight(resolvedHex) ? "blackAlpha.500" : "whiteAlpha.500"}
            gap="0"
            minW="0"
            outline={0}
            rounded="md"
            transitionDuration="slower"
            transitionProperty="common"
            _focusVisible={{ boxShadow: "outline" }}
            _hover={{ color: isLight(resolvedHex) ? "black" : "white" }}
          >
            <Text as="span" lineClamp={1}>
              {name}
            </Text>

            <Text as="span" fontSize="sm" lineClamp={1}>
              {f(resolvedHex, format)}
            </Text>
          </VStack>

          <Box
            opacity={{ base: isOpen ? 1 : 0, sm: 1 }}
            transitionDuration="slower"
            transitionProperty="common"
          >
            <HexControlButtons
              colorMode={colorMode}
              isEditRef={isEditRef}
              onClose={onClose}
              {...{ id, name, hex }}
            />
          </Box>
        </HexContainer>
      </ColorCommandMenu>
    )
  },
)

HexControl.displayName = "HexControl"

const getHexes = (hex: string, tab: string) => {
  try {
    switch (tab) {
      case "shades":
        return darken(hex)

      case "tints":
        return lighten(hex)

      case "tones":
        return tone(hex)

      case "blindness":
        return Object.values(blindness(hex))

      default:
        return [hex]
    }
  } catch {
    return []
  }
}

interface HexDataProps extends HexContainerProps, Pick<Color, "hex"> {}

const HexData: FC<HexDataProps> = memo(({ hex, ...rest }) => {
  const { tab, uuid } = usePalette()
  const [hexes, setHexes] = useState<string[]>(getHexes(hex, tab))
  const count = hexes.length

  useUpdateEffect(() => {
    if (tab) setHexes(getHexes(hex, tab))
  }, [hex, tab])

  return (
    <HexContainer as="nav" overflow="hidden" {...rest}>
      <Grid as="ul" h="full" templateColumns={`repeat(${count}, 1fr)`}>
        {hexes.map((hex, index) => (
          <GridItem key={`${hex}-${index}`} as="li" boxSize="full">
            <ColorCommandMenu uuid={uuid} value={hex}>
              <Center
                as={Link}
                href={`/colors/${hex.replace("#", "")}`}
                bg={hex}
                boxSize="full"
                color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
                tabIndex={-1}
              />
            </ColorCommandMenu>
          </GridItem>
        ))}
      </Grid>
    </HexContainer>
  )
})

HexData.displayName = "HexData"

const variants: MotionVariants = {
  animate: ({ isFirst, isLast }) => {
    if (!isFirst && !isLast)
      return {
        borderEndEndRadius: "0px",
        borderEndStartRadius: "0px",
        borderStartEndRadius: "0px",
        borderStartStartRadius: "0px",
      }

    let styles: MotionVariants[number] = {}

    if (isFirst) {
      styles = {
        ...styles,
        borderStartEndRadius: "16px",
        borderStartStartRadius: "16px",
      }
    } else {
      styles = {
        ...styles,
        borderStartEndRadius: "0px",
        borderStartStartRadius: "0px",
      }
    }

    if (isLast) {
      styles = {
        ...styles,
        borderEndEndRadius: "16px",
        borderEndStartRadius: "16px",
      }
    } else {
      styles = {
        ...styles,
        borderEndEndRadius: "0px",
        borderEndStartRadius: "0px",
      }
    }

    return styles
  },
  initial: ({ isFirst, isLast }) => {
    if (!isFirst && !isLast)
      return {
        borderEndEndRadius: "0px",
        borderEndStartRadius: "0px",
        borderStartEndRadius: "0px",
        borderStartStartRadius: "0px",
      }

    let styles: MotionVariants[number] = {}

    if (isFirst) {
      styles = {
        ...styles,
        borderStartEndRadius: "16px",
        borderStartStartRadius: "16px",
      }
    }

    if (isLast) {
      styles = {
        ...styles,
        borderEndEndRadius: "16px",
        borderEndStartRadius: "16px",
      }
    }

    return styles
  },
}

interface HexContainerProps extends MotionProps {
  isFirst: boolean
  isLast: boolean
}

const HexContainer: FC<HexContainerProps> = memo(
  ({ isFirst, isLast, ...rest }) => {
    return (
      <Motion
        animate="animate"
        custom={{ isFirst, isLast }}
        h="20"
        initial="initial"
        variants={variants}
        {...rest}
      />
    )
  },
)

HexContainer.displayName = "HexContainer"
