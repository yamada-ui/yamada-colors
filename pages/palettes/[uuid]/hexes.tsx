import type { ColorMode, MotionProps, MotionVariants } from "@yamada-ui/react"
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
  VStack,
  useBreakpointValue,
  useDisclosure,
  useUpdateEffect,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import type { FC } from "react"
import { HexesProvider, useHexes, usePalette } from "./context"
import { HexControlButtons } from "./hex-control-buttons"
import {
  Dots,
  Moon,
  Plus,
  Refresh,
  Share,
  Sun,
} from "components/media-and-icons"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { blindness, darken, f, isLight, lighten, tone } from "utils/color"
import { generateUUID, setCookie } from "utils/storage"

const DEFAULT_COLOR: PaletteColor = {
  name: "White",
  hex: ["#ffffff", "#ffffff"],
}

export type HexesProps = {}

export const Hexes: FC<HexesProps> = memo(({}) => {
  const {
    colorMode: colorModeProp,
    uuid,
    name,
    colors,
    timestamp,
    changeColors,
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
      uuid,
      name,
      colors: [...computedColors, { ...DEFAULT_COLOR }],
      timestamp,
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

      changePalette({ uuid, name, colors: computedColors, timestamp })
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

      changePalette({ uuid, name, colors: resolvedColors, timestamp })
    },
    [changePalette, colors, name, changeColors, uuid, timestamp],
  )

  const onDelete = useCallback(
    (targetId: string) => {
      const resolvedColors = colors
        .map(({ id, name, hex }) =>
          targetId !== id ? { name, hex } : undefined,
        )
        .filter(Boolean)

      changeColors((prev) => prev.filter(({ id }) => id !== targetId))

      changePalette({ uuid, name, colors: resolvedColors, timestamp })
    },
    [changePalette, colors, name, changeColors, uuid, timestamp],
  )

  const value = useMemo(
    () => ({ colorMode, onClone, onEdit, onDelete, toggleColorMode }),
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
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          colorScheme="neutral"
          leftIcon={<Plus />}
          onClick={onCreate}
        >
          {t("palette.create")}
        </Button>
      </Center>
    </HexesProvider>
  )
})

Hexes.displayName = "Hexes"

type HexHeaderProps = {}

const HexHeader: FC<HexHeaderProps> = memo(() => {
  const { t } = useI18n()
  const { colorMode, toggleColorMode } = useHexes()

  return (
    <>
      <Grid
        display={{
          base: "grid",
          xl: "none",
          lg: "grid",
          md: "none",
        }}
        gridTemplateColumns="1fr 1fr"
        gap="lg"
      >
        <GridItem as={HStack} justifyContent="center" gap="sm">
          <Sun color="muted" />

          <Text textAlign="center" fontSize="2xl" fontWeight="medium">
            {t("palette.light")}
          </Text>
        </GridItem>

        <GridItem as={HStack} justifyContent="center" gap="sm">
          <Moon color="muted" />

          <Text textAlign="center" fontSize="2xl" fontWeight="medium">
            {t("palette.dark")}
          </Text>
        </GridItem>
      </Grid>

      <Center
        position="relative"
        display={{
          base: "none",
          xl: "flex",
          lg: "none",
          md: "flex",
        }}
      >
        <HStack justifyContent="center" gap="sm">
          {colorMode === "light" ? (
            <Sun color="muted" />
          ) : (
            <Moon color="muted" />
          )}

          <Text textAlign="center" fontSize="2xl" fontWeight="medium">
            {colorMode === "light" ? "Light" : "Dark"}
          </Text>
        </HStack>

        <IconButton
          position="absolute"
          top="50%"
          right="0"
          transform="translateY(-50%)"
          aria-label="Switching color mode"
          isRounded
          variant="ghost"
          _hover={{
            bg: ["blackAlpha.100", "whiteAlpha.100"],
          }}
          colorScheme="neutral"
          icon={<Refresh color="muted" />}
          onClick={toggleColorMode}
        />
      </Center>
    </>
  )
})

HexHeader.displayName = "HexHeader"

type HexReorderProps = {}

const HexReorder: FC<HexReorderProps> = memo(() => {
  const { uuid, name, colors, timestamp, changeColors } = usePalette()
  const { t } = useI18n()
  const { onEdit } = useHexes()
  const { changePalette } = useApp()
  const [internalColors, setInternalColors] = useState<ReorderColors>(colors)

  const onChange = (ids: (string | number)[]) => {
    setInternalColors((prev) =>
      ids.map((id) => prev.find((item) => item.id === id)),
    )
  }

  const onCompleteChange = (ids: (string | number)[]) => {
    const resolvedColors = ids.map((id) => {
      const { name, hex } = colors.find((item) => item.id === id)

      return { name, hex }
    })

    changeColors(internalColors)
    changePalette({ uuid, name, colors: resolvedColors, timestamp })
  }

  useUpdateEffect(() => {
    setInternalColors(colors)
  }, [colors])

  return (
    <Reorder
      gap="0"
      variant="unstyled"
      onChange={onChange}
      onCompleteChange={onCompleteChange}
    >
      {internalColors.map(({ id, name, hex }, index) => {
        const isFirst = !index
        const isLast = index + 1 === colors.length
        const [lightHex, darkHex] = hex

        return (
          <ReorderItem
            key={id}
            label={id}
            display="grid"
            gridTemplateColumns={{
              base: "1fr auto 1fr",
              xl: "1fr",
              lg: "1fr auto 1fr",
              md: "1fr",
            }}
            gap="sm"
          >
            <HexToggleItem
              display={{
                base: "block",
                xl: !isLight ? "none" : "block",
                lg: "block",
                md: !isLight ? "none" : "block",
              }}
              {...{ id, name, hex, isFirst, isLast, colorMode: "light" }}
            />

            <VStack
              display={{ base: "flex", xl: "none", lg: "flex", md: "none" }}
              gap="0"
            >
              <Tooltip label={t("palette.apply.dark")} placement="top">
                <IconButton
                  right="0"
                  aria-label="Sync with dark"
                  isRounded
                  variant="ghost"
                  _hover={{
                    bg: ["blackAlpha.100", "whiteAlpha.100"],
                  }}
                  colorScheme="neutral"
                  icon={
                    <ChevronIcon
                      fontSize="1.5em"
                      color="muted"
                      transform="rotate(-90deg)"
                    />
                  }
                  onClick={() =>
                    onEdit({ id, name, hex: [lightHex, lightHex] })
                  }
                />
              </Tooltip>

              <Tooltip label={t("palette.apply.light")} placement="top">
                <IconButton
                  right="0"
                  aria-label="Sync with light"
                  isRounded
                  variant="ghost"
                  _hover={{
                    bg: ["blackAlpha.100", "whiteAlpha.100"],
                  }}
                  colorScheme="neutral"
                  icon={
                    <ChevronIcon
                      fontSize="1.5em"
                      color="muted"
                      transform="rotate(90deg)"
                    />
                  }
                  onClick={() => onEdit({ id, name, hex: [darkHex, darkHex] })}
                />
              </Tooltip>
            </VStack>

            <HexToggleItem
              display={{
                base: "block",
                xl: isLight ? "none" : "block",
                lg: "block",
                md: isLight ? "none" : "block",
              }}
              {...{ id, name, hex, isFirst, isLast, colorMode: "dark" }}
            />
          </ReorderItem>
        )
      })}
    </Reorder>
  )
})

HexReorder.displayName = "HexReorder"

type HexToggleItemProps = ReorderColor &
  HexContainerProps & { colorMode: ColorMode }

const HexToggleItem: FC<HexToggleItemProps> = memo(
  ({ id, name, hex, colorMode, display, ...rest }) => {
    const { tab } = usePalette()
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]
    const isPalettes = tab === "palettes"

    return (
      <Box display={display}>
        <HexControl
          display={{ base: isPalettes ? "flex" : "none", sm: "flex" }}
          id={id}
          hex={hex}
          name={name}
          colorMode={colorMode}
          {...rest}
        />

        <HexData
          display={{ base: isPalettes ? "none" : "grid", sm: "none" }}
          hex={resolvedHex}
          {...rest}
        />
      </Box>
    )
  },
)

HexToggleItem.displayName = "HexToggleItem"

type HexControlProps = ReorderColor &
  HexContainerProps & { colorMode: ColorMode }

const HexControl: FC<HexControlProps> = memo(
  ({ id, name, hex, colorMode, ...rest }) => {
    const { format } = useApp()
    const isEditRef = useRef<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isMobile = useBreakpointValue({ base: false, sm: true })
    const resolvedHex = hex[colorMode === "light" ? 0 : 1]

    return (
      <HexContainer
        display="flex"
        gap="md"
        bg={resolvedHex}
        alignItems="center"
        ps={{ base: "md", sm: "normal" }}
        pe="md"
        onHoverStart={!isMobile ? onOpen : undefined}
        onHoverEnd={() => {
          if (isMobile || isEditRef.current) return

          onClose()

          isEditRef.current = false
        }}
        onFocus={!isMobile ? onOpen : undefined}
        onBlur={() => {
          if (isMobile) return

          onClose()
        }}
        {...rest}
      >
        <ReorderTrigger
          color={isLight(resolvedHex) ? "blackAlpha.500" : "whiteAlpha.500"}
          display={{ base: "block", sm: "none" }}
          opacity={{ base: isOpen ? 1 : 0 }}
          pointerEvents={{ base: "auto", sm: "none" }}
          transitionProperty="common"
          transitionDuration="slower"
        >
          <Dots />
        </ReorderTrigger>

        <VStack
          minW="0"
          as={Link}
          gap="0"
          href={`/colors/${resolvedHex.replace("#", "")}`}
          rounded="md"
          outline={0}
          color={isLight(resolvedHex) ? "blackAlpha.500" : "whiteAlpha.500"}
          _hover={{ color: isLight(resolvedHex) ? "black" : "white" }}
          _focusVisible={{ boxShadow: "outline" }}
          transitionProperty="common"
          transitionDuration="slower"
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
          transitionProperty="common"
          transitionDuration="slower"
        >
          <HexControlButtons
            colorMode={colorMode}
            isEditRef={isEditRef}
            onClose={onClose}
            {...{ id, name, hex }}
          />
        </Box>
      </HexContainer>
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

type HexDataProps = Pick<Color, "hex"> & HexContainerProps

const HexData: FC<HexDataProps> = memo(({ hex, ...rest }) => {
  const { tab } = usePalette()
  const [hexes, setHexes] = useState<string[]>(getHexes(hex, tab))
  const count = hexes.length

  useUpdateEffect(() => {
    setHexes(getHexes(hex, tab))
  }, [hex, tab])

  return (
    <HexContainer as="nav" overflow="hidden" {...rest}>
      <Grid as="ul" templateColumns={`repeat(${count}, 1fr)`}>
        {hexes.map((hex, index) => (
          <GridItem key={`${hex}-${index}`} as="li" boxSize="full">
            <Center
              as={Link}
              href={`/colors/${hex.replace("#", "")}`}
              tabIndex={-1}
              boxSize="full"
              bg={hex}
              _hover={{
                "& > *": {
                  opacity: "1",
                },
              }}
            >
              <Share
                color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
                opacity="0"
                transitionProperty="common"
                transitionDuration="slower"
              />
            </Center>
          </GridItem>
        ))}
      </Grid>
    </HexContainer>
  )
})

HexData.displayName = "HexData"

const variants: MotionVariants = {
  initial: ({ isFirst, isLast }) => {
    if (!isFirst && !isLast)
      return {
        borderStartStartRadius: "0px",
        borderStartEndRadius: "0px",
        borderEndStartRadius: "0px",
        borderEndEndRadius: "0px",
      }

    let styles: MotionVariants[number] = {}

    if (isFirst) {
      styles = {
        ...styles,
        borderStartStartRadius: "16px",
        borderStartEndRadius: "16px",
      }
    }

    if (isLast) {
      styles = {
        ...styles,
        borderEndStartRadius: "16px",
        borderEndEndRadius: "16px",
      }
    }

    return styles
  },
  animate: ({ isFirst, isLast }) => {
    if (!isFirst && !isLast)
      return {
        borderStartStartRadius: "0px",
        borderStartEndRadius: "0px",
        borderEndStartRadius: "0px",
        borderEndEndRadius: "0px",
      }

    let styles: MotionVariants[number] = {}

    if (isFirst) {
      styles = {
        ...styles,
        borderStartStartRadius: "16px",
        borderStartEndRadius: "16px",
      }
    } else {
      styles = {
        ...styles,
        borderStartStartRadius: "0px",
        borderStartEndRadius: "0px",
      }
    }

    if (isLast) {
      styles = {
        ...styles,
        borderEndStartRadius: "16px",
        borderEndEndRadius: "16px",
      }
    } else {
      styles = {
        ...styles,
        borderEndStartRadius: "0px",
        borderEndEndRadius: "0px",
      }
    }

    return styles
  },
}

type HexContainerProps = Omit<MotionProps, "colorMode"> & {
  isFirst: boolean
  isLast: boolean
}

const HexContainer: FC<HexContainerProps> = memo(
  ({ isFirst, isLast, ...rest }) => {
    return (
      <Motion
        initial="initial"
        animate="animate"
        variants={variants}
        custom={{ isFirst, isLast }}
        h="20"
        {...rest}
      />
    )
  },
)

HexContainer.displayName = "HexContainer"
