import type { FC } from "react"
import { Box, ChevronIcon, HStack, Spacer, Tooltip } from "@yamada-ui/react"
import { SearchColor } from "components/forms"
import { NextLinkIconButton } from "components/navigation"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { useRouter } from "next/router"
import { useState } from "react"
import { f } from "utils/color"

export interface HeaderProps {
  hex: string
  tab: string
}

export const Header: FC<HeaderProps> = ({ hex, tab }) => {
  const { t } = useI18n()
  const { format } = useApp()
  const router = useRouter()
  const [value, setValue] = useState<string>(f(hex, format))

  return (
    <HStack as="section" gap="sm">
      <Tooltip label={t("generators.back")} placement="top">
        <Box>
          <NextLinkIconButton
            href={`/colors/${hex.replace("#", "")}`}
            colorScheme="neutral"
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            icon={
              <ChevronIcon
                color="muted"
                fontSize="1.5em"
                transform="rotate(90deg)"
              />
            }
            isRounded
            prefetch
          />
        </Box>
      </Tooltip>

      <SearchColor
        value={value}
        onChange={setValue}
        onSubmit={(value) => {
          if (hex === value) return

          router.push(`/generators?hex=${value.replace("#", "")}&tab=${tab}`)
        }}
      />

      <Spacer />
    </HStack>
  )
}
