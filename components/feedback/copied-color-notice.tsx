import type { CenterProps } from "@yamada-ui/react"
import type { FC } from "react"
import { Center, ColorSwatch, HStack, Text } from "@yamada-ui/react"
import { memo } from "react"

export interface CopiedColorNoticeProps extends CenterProps {
  value: string
}

export const CopiedColorNotice: FC<CopiedColorNoticeProps> = memo(
  ({ children, value, ...rest }) => {
    return (
      <Center {...rest}>
        <HStack
          bg={["white", "black"]}
          boxShadow={["md", "dark-lg"]}
          gap="sm"
          pl="sm"
          pr="normal"
          py="sm"
          rounded="full"
        >
          <ColorSwatch color={value} isRounded />

          <Text as="span">{value}</Text>

          <Text as="span" color="muted" fontSize="sm">
            {children}
          </Text>
        </HStack>
      </Center>
    )
  },
)

CopiedColorNotice.displayName = "CopiedColorNotice"
