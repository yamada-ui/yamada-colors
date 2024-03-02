import type { MotionProps, MotionVariants } from "@yamada-ui/react"
import {
  Box,
  Button,
  Center,
  GridItem,
  Motion,
  Reorder,
  ReorderItem,
  ReorderTrigger,
  Text,
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
import { Dots, Plus, Refresh } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { blindness, darken, f, isLight, lighten, tone } from "utils/color"
import { generateUUID } from "utils/storage"

const DEFAULT_COLOR: Color = { name: "White", hex: "#ffffff" }

export type HexesProps = {}

export const Hexes: FC<HexesProps> = memo(({}) => {
  const { tab, uuid, name, colors, timestamp, setColors } = usePalette()
  const { t } = useI18n()
  const { changePalette } = useApp()
  const isHidden = tab === "hidden"

  const onCreate = () => {
    const computedColors = colors.map(({ name, hex }) => ({ name, hex }))

    setColors((prev) => [...prev, { id: generateUUID(), ...DEFAULT_COLOR }])

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

      setColors((prev) =>
        prev.map((color) => (color.id === id ? { id, ...rest } : color)),
      )

      changePalette({ uuid, name, colors: computedColors, timestamp })
    },
    [changePalette, colors, name, setColors, uuid, timestamp],
  )

  const onChange = (ids: (string | number)[]) => {
    setColors((prev) => ids.map((id) => prev.find((item) => item.id === id)))
  }

  const onCompleteChange = (ids: (string | number)[]) => {
    const resolvedColors = ids.map((id) => {
      const { name, hex } = colors.find((item) => item.id === id)

      return { name, hex }
    })

    changePalette({ uuid, name, colors: resolvedColors, timestamp })
  }

  const onClone = useCallback(
    ({ id, ...rest }: ReorderColor) => {
      const index = colors.findIndex((color) => color.id === id)

      const computedColors = colors.map(({ name, hex }) => ({ name, hex }))

      setColors((prev) => [
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
    [changePalette, colors, name, setColors, uuid, timestamp],
  )

  const onDelete = useCallback(
    (targetId: string) => {
      const resolvedColors = colors
        .map(({ id, name, hex }) =>
          targetId !== id ? { name, hex } : undefined,
        )
        .filter(Boolean)

      setColors((prev) => prev.filter(({ id }) => id !== targetId))

      changePalette({ uuid, name, colors: resolvedColors, timestamp })
    },
    [changePalette, colors, name, setColors, uuid, timestamp],
  )

  const value = useMemo(
    () => ({ onClone, onEdit, onDelete }),
    [onClone, onEdit, onDelete],
  )

  return (
    <HexesProvider value={value}>
      <Box as="section">
        <Reorder
          gap="0"
          variant="unstyled"
          onChange={onChange}
          onCompleteChange={onCompleteChange}
        >
          {colors.map(({ id, name, hex }, index) => {
            const isFirst = !index
            const isLast = index + 1 === colors.length

            return (
              <ReorderItem
                key={id}
                label={id}
                display="grid"
                gridTemplateColumns={{
                  base: isHidden ? "1fr" : "auto 1fr",
                  xl: "1fr",
                }}
                gap="lg"
              >
                <HexControl
                  {...{ id, name, hex, isFirst, isLast }}
                  w={
                    isHidden ? "full" : { base: "md", "2xl": "sm", xl: "full" }
                  }
                />

                {!isHidden ? (
                  <HexData {...{ id, name, hex, isFirst, isLast }} />
                ) : null}
              </ReorderItem>
            )
          })}
        </Reorder>
      </Box>

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

type HexControlProps = ReorderColor & HexContainerProps

const HexControl: FC<HexControlProps> = memo(({ id, name, hex, ...rest }) => {
  const { format } = useApp()
  const isEditRef = useRef<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: false, sm: true })

  return (
    <HexContainer
      display="flex"
      gap="md"
      bg={hex}
      h="20"
      alignItems="center"
      px="md"
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
        color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
        opacity={{ base: isOpen ? 1 : 0, sm: 0 }}
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
        href={`/colors/${hex.replace("#", "")}`}
        rounded="md"
        outline={0}
        color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
        _hover={{ color: isLight(hex) ? "black" : "white" }}
        _focusVisible={{ boxShadow: "outline" }}
        transitionProperty="common"
        transitionDuration="slower"
      >
        <Text as="span" lineClamp={1}>
          {name}
        </Text>

        <Text as="span" fontSize="sm" lineClamp={1}>
          {f(hex, format)}
        </Text>
      </VStack>

      <HexControlButtons
        opacity={{ base: isOpen ? 1 : 0, sm: 1 }}
        isEditRef={isEditRef}
        onClose={onClose}
        {...{ id, name, hex }}
      />
    </HexContainer>
  )
})

HexControl.displayName = "HexControl"

const getHexes = (hex: string, tab: string) => {
  try {
    switch (tab) {
      case "shades":
        return darken(hex).slice(1)

      case "tints":
        return lighten(hex).slice(1)

      case "tones":
        return tone(hex)

      case "blindness":
        return Object.values(blindness(hex)).slice(1)

      default:
        return []
    }
  } catch {
    return []
  }
}

type HexDataProps = Color & HexContainerProps

const HexData: FC<HexDataProps> = memo(({ id, name, hex, ...rest }) => {
  const { tab } = usePalette()
  const [hexes, setHexes] = useState<string[]>(getHexes(hex, tab))
  const { onEdit } = useHexes()
  const count = hexes.length

  useUpdateEffect(() => {
    setHexes(getHexes(hex, tab))
  }, [hex, tab])

  return (
    <HexContainer
      display={{ base: "grid", xl: "none" }}
      gridTemplateColumns={{ base: `repeat(${count}, 1fr)`, md: "1fr" }}
      boxSize="full"
      overflow="hidden"
      {...rest}
    >
      {hexes.map((hex, index) => (
        <GridItem key={`${hex}-${index}`}>
          <Center
            as="button"
            tabIndex={-1}
            boxSize="full"
            bg={hex}
            _hover={{
              "& > *": {
                opacity: 1,
              },
            }}
            onClick={() => onEdit({ id, name, hex })}
          >
            <Refresh
              opacity={0}
              transitionProperty="common"
              transitionDuration="slower"
              color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
            />
          </Center>
        </GridItem>
      ))}
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

type HexContainerProps = MotionProps & {
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
        {...rest}
      />
    )
  },
)

HexContainer.displayName = "HexContainer"
