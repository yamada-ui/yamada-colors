import type { MotionVariants } from "@yamada-ui/react"
import {
  Box,
  Button,
  Center,
  Motion,
  Reorder,
  ReorderItem,
  ReorderTrigger,
  Spacer,
  Text,
  VStack,
  noop,
  useBreakpointValue,
  useDisclosure,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo, useCallback, useMemo, useRef } from "react"
import type { FC } from "react"
import { HexesProvider, usePalette } from "./context"
import { HexControlButtons } from "./hex-control-buttons"
import { HexData } from "./hex-data"
import { type OrderColor } from "./index.page"
import { Dots, Plus } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f, isLight } from "utils/color"
import { generateUUID } from "utils/storage"

const DEFAULT_COLOR: Color = { name: "White", hex: "#ffffff" }

export type HexesProps = {}

export const Hexes: FC<HexesProps> = memo(({}) => {
  const { uuid, name, colors, timestamp, setColors } = usePalette()
  const { t } = useI18n()
  const { changePalette } = useApp()

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
    ({ id, ...rest }: OrderColor) => {
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
    ({ id, ...rest }: OrderColor) => {
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
              <ReorderItem key={id} label={id} display="flex" gap="md">
                <Hex {...{ id, name, hex, isFirst, isLast }} />

                <HexData {...{ name, hex }} />
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

type HexProps = OrderColor & { isFirst: boolean; isLast: boolean }

const Hex: FC<HexProps> = memo(({ id, name, hex, isFirst, isLast }) => {
  const { format } = useApp()
  const isEditRef = useRef<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      isEditRef.current = false
    },
  })
  const isMobile = useBreakpointValue({ base: false, sm: true })

  return (
    <Motion
      display="flex"
      gap="md"
      bg={hex}
      w={{ base: "md", sm: "full" }}
      py="lg"
      px="md"
      initial="initial"
      animate="animate"
      variants={variants}
      custom={{ isFirst, isLast }}
      onHoverStart={!isMobile ? onOpen : noop}
      onHoverEnd={
        !isMobile
          ? () => {
              if (isEditRef.current) return

              onClose()
            }
          : noop
      }
      onFocus={!isMobile ? onOpen : noop}
      onBlur={!isMobile ? onClose : noop}
    >
      <ReorderTrigger
        color={isLight(hex) ? "blackAlpha.500" : "whiteAlpha.500"}
        opacity={{ base: isOpen ? 1 : 0, sm: 0 }}
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

      <Spacer />

      <HexControlButtons
        opacity={{ base: isOpen ? 1 : 0, sm: 1 }}
        isEditRef={isEditRef}
        onClose={onClose}
        {...{ id, name, hex }}
      />
    </Motion>
  )
})

Hex.displayName = "Hex"
