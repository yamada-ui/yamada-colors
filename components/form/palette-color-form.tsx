import { Pipette } from "@yamada-ui/lucide"
import {
  Box,
  ColorSelector,
  ColorSwatch,
  Input,
  useEyeDropper,
  VStack,
} from "@yamada-ui/react"
import type { InputProps, StackProps } from "@yamada-ui/react"
import { memo, useRef, useState } from "react"
import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react"
import { useApp } from "contexts/app-context"
import { f } from "utils/color"

export type PaletteColorFormProps = Omit<
  StackProps,
  "onChange" | "onSubmit"
> & {
  name: string
  onChangeName: Dispatch<SetStateAction<string>>
  color: string
  onChangeColor: Dispatch<SetStateAction<string>>
  onSubmit?: () => void
}

export const PaletteColorForm: FC<PaletteColorFormProps> = memo(
  ({ name, onChangeName, color, onChangeColor, onSubmit, ...rest }) => {
    return (
      <VStack gap="sm" {...rest}>
        <Input value={name} onChange={(ev) => onChangeName(ev.target.value)} />

        <EditColorPicker
          color={color}
          onChangeColor={onChangeColor}
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") return

            onSubmit?.()
          }}
        />
      </VStack>
    )
  },
)

PaletteColorForm.displayName = "PaletteColorForm"

type EditColorPickerProps = Pick<
  PaletteColorFormProps,
  "color" | "onChangeColor"
> &
  InputProps

const EditColorPicker: FC<EditColorPickerProps> = memo(
  ({ color, onChangeColor, ...rest }) => {
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

    return (
      <>
        <Box position="relative" w="full">
          <ColorSwatch
            color={color}
            isRounded
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            boxSize="6"
            insetStart="2"
          />

          <Input
            value={inputValue}
            onChange={onInputChange}
            onFocus={() => {
              isInputFocused.current = true
            }}
            onBlur={() => {
              isInputFocused.current = false
              const next = f(color, format)

              onChangeColor((prev) => (!next || prev === next ? prev : next))
              setInputValue(next ?? "")
            }}
            w="full"
            pl="10"
            pr="8"
            _focus={{ zIndex: "unset" }}
            placeholder={f("#ffffff", format)}
            {...rest}
          />

          {eyeDropperSupported ? (
            <Box
              as="button"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              zIndex={1}
              insetEnd="2"
              w="6"
              py="1"
              fontSize="lg"
              outline={0}
              rounded="md"
              transitionProperty="common"
              transitionDuration="normal"
              pointerEvents="auto"
              color={["blackAlpha.600", "whiteAlpha.700"]}
              _hover={{
                color: ["blackAlpha.500", "whiteAlpha.600"],
              }}
              _focusVisible={{
                boxShadow: "outline",
              }}
              onClick={onEyeDropperClick}
            >
              <Pipette fontSize="md" />
            </Box>
          ) : null}
        </Box>

        <ColorSelector
          value={f(color, format)}
          onChange={onChange}
          format={format}
          withEyeDropper={false}
          withResult={false}
        />
      </>
    )
  },
)

EditColorPicker.displayName = "EditColorPicker"
