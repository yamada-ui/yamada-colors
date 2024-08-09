import type { CenterProps } from "@yamada-ui/react"
import { Center, ColorSwatch, HStack, Text } from "@yamada-ui/react"
import { memo } from "react"
import type { FC } from "react"

export type CopiedColorNoticeProps = CenterProps & {
  value: string
}

export const CopiedColorNotice: FC<CopiedColorNoticeProps> = memo(
  ({ value, children, ...rest }) => {
    return (
      <Center {...rest}>
        <HStack
          bg={["white", "black"]}
          rounded="full"
          py="sm"
          pl="sm"
          pr="normal"
          gap="sm"
          boxShadow={["md", "dark-lg"]}
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
