import { ChevronIcon, HStack, Spacer } from "@yamada-ui/react"
import { useRouter } from "next/router"
import { useState, type FC } from "react"
import { SearchColor } from "components/form"
import { NextLinkIconButton } from "components/navigation"
import { useApp } from "contexts/app-context"
import { f } from "utils/color"

export type HeaderProps = { hex: string; tab: string }

export const Header: FC<HeaderProps> = ({ hex, tab }) => {
  const { format } = useApp()
  const router = useRouter()
  const [value, setValue] = useState<string>(f(hex, format))

  return (
    <HStack as="section" gap="sm">
      <NextLinkIconButton
        href={`/colors/${hex.replace("#", "")}`}
        bg={["blackAlpha.100", "whiteAlpha.100"]}
        colorScheme="neutral"
        icon={
          <ChevronIcon
            color="muted"
            fontSize="1.5em"
            transform="rotate(90deg)"
          />
        }
        borderColor="transparent"
        isRounded
      />

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
