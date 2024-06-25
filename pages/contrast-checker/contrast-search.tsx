import type { FlexProps } from "@yamada-ui/react"
import { VStack, Wrap, useUpdateEffect } from "@yamada-ui/react"
import { memo, useState, type FC } from "react"
import type { Contrast, ContrastGround } from "./index.page"
import { SearchColor } from "components/form"
import { CopyText } from "components/other"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { f } from "utils/color"

export type ContrastSearchProps = Omit<FlexProps, "onChange"> &
  Pick<Contrast, "fg" | "bg"> & {
    onChange: (ground: ContrastGround, value: string) => void
  }

export const ContrastSearch: FC<ContrastSearchProps> = memo(
  ({ fg, bg, onChange, ...rest }) => {
    const { t } = useI18n()

    return (
      <Wrap gap="md" {...rest}>
        <ColorInput
          label={t("contrast-checker.foreground")}
          ground="fg"
          value={fg}
          onChange={onChange}
        />
        <ColorInput
          label={t("contrast-checker.background")}
          ground="bg"
          value={bg}
          onChange={onChange}
        />
      </Wrap>
    )
  },
)

ContrastSearch.displayName = "ContrastSearch"

type ColorInputProps = {
  label: string
  ground: ContrastGround
  value: string
  onChange: (ground: ContrastGround, value: string) => void
}

const ColorInput: FC<ColorInputProps> = ({
  label,
  ground,
  value: valueProp,
  onChange,
}) => {
  const { format } = useApp()
  const [value, setValue] = useState<string>(f(valueProp, format))

  useUpdateEffect(() => {
    setValue(f(valueProp, format))
  }, [valueProp])

  return (
    <VStack minW="xs" w="auto" flex="1" gap="xs">
      <CopyText
        as="span"
        color="muted"
        fontSize="sm"
        value={value}
        alignSelf="flex-start"
      >
        {label}
      </CopyText>

      <SearchColor
        value={value}
        onChange={setValue}
        onSubmit={(value) => onChange(ground, value)}
      />
    </VStack>
  )
}
