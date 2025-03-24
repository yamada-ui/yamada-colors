import type { InputProps, StackProps } from "@yamada-ui/react"
import type {
  ChangeEvent,
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
} from "react"
import { Pipette } from "@yamada-ui/lucide"
import {
  assignRef,
  Box,
  ColorSelector,
  ColorSwatch,
  forwardRef,
  Input,
  useEyeDropper,
  VStack,
} from "@yamada-ui/react"
import { useApp } from "contexts/app-context"
import { memo, useRef, useState } from "react"
import { f } from "utils/color"

export interface PaletteColorFormProps extends Omit<StackProps, "onSubmit"> {
  name: string
  color: string
  resetRef: RefObject<(value: string) => void>
  onChangeColor: Dispatch<SetStateAction<string>>
  onChangeName: Dispatch<SetStateAction<string>>
  onSubmit?: () => void
}

export const PaletteColorForm = memo(
  forwardRef<PaletteColorFormProps, "div">(
    (
      { name, color, resetRef, onChangeColor, onChangeName, onSubmit, ...rest },
      ref,
    ) => {
      return (
        <VStack ref={ref} gap="sm" {...rest}>
          <Input
            value={name}
            onChange={(ev) => onChangeName(ev.target.value)}
          />

          <EditColorPicker
            color={color}
            resetRef={resetRef}
            onChangeColor={onChangeColor}
            onKeyDown={(ev) => {
              if (ev.key !== "Enter") return

              onSubmit?.()
            }}
          />
        </VStack>
      )
    },
  ),
)

PaletteColorForm.displayName = "PaletteColorForm"

interface EditColorPickerProps
  extends Omit<InputProps, "color">,
    Pick<PaletteColorFormProps, "color" | "onChangeColor" | "resetRef"> {}

const EditColorPicker: FC<EditColorPickerProps> = memo(
  ({ color, resetRef, onChangeColor, ...rest }) => {
    const { format } = useApp()
    const [inputValue, setInputValue] = useState<string>(f(color, format))
    const { supported: eyeDropperSupported, onOpen: onEyeDropperOpen } =
      useEyeDropper()
    const isInputFocused = useRef<boolean>(false)

    const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value

      setInputValue(value)
      onChangeColor(f(value, "hex"))
    }

    const onChange = (value: string) => {
      onChangeColor(f(value, "hex"))

      setTimeout(() => {
        if (!isInputFocused.current) setInputValue(value)
      })
    }

    const onEyeDropperClick = async () => {
      try {
        const { sRGBHex } = (await onEyeDropperOpen()) ?? {}

        if (!sRGBHex) return

        onChangeColor(sRGBHex)
        setInputValue(f(sRGBHex, format))
      } catch {}
    }

    assignRef(resetRef, setInputValue)

    return (
      <>
        <Box position="relative" w="full">
          <ColorSwatch
            boxSize="6"
            color={color}
            insetStart="2"
            isRounded
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
          />

          <Input
            pl="10"
            placeholder={f("#ffffff", format)}
            pr="8"
            value={inputValue}
            w="full"
            _focus={{ zIndex: "unset" }}
            onBlur={() => {
              isInputFocused.current = false
              const next = f(color, format)

              onChangeColor((prev) => (!next || prev === next ? prev : next))
              setInputValue(next)
            }}
            onChange={onInputChange}
            onFocus={() => {
              isInputFocused.current = true
            }}
            {...rest}
          />

          {eyeDropperSupported ? (
            <Box
              as="button"
              alignItems="center"
              color={["blackAlpha.600", "whiteAlpha.700"]}
              display="inline-flex"
              fontSize="lg"
              insetEnd="2"
              justifyContent="center"
              outline={0}
              pointerEvents="auto"
              position="absolute"
              py="1"
              rounded="md"
              top="50%"
              transform="translateY(-50%)"
              transitionDuration="normal"
              transitionProperty="common"
              w="6"
              zIndex={1}
              _focusVisible={{
                boxShadow: "outline",
              }}
              _hover={{
                color: ["blackAlpha.500", "whiteAlpha.600"],
              }}
              onClick={onEyeDropperClick}
            >
              <Pipette fontSize="md" />
            </Box>
          ) : null}
        </Box>

        <ColorSelector
          format={format}
          value={f(color, format)}
          withEyeDropper={false}
          withResult={false}
          onChange={onChange}
        />
      </>
    )
  },
)

EditColorPicker.displayName = "EditColorPicker"
