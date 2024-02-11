import { Box, Grid, HStack, Spacer, Text, VStack } from "@yamada-ui/react"
import type { FC } from "react"

export type HeaderProps = { hex: string; name: string }

export const Header: FC<HeaderProps> = ({ hex, name }) => {
  return (
    <HStack>
      <Grid templateColumns={{ base: "auto 1fr" }} gap={{ base: "md" }}>
        <Box boxSize={{ base: "20" }} bg={hex} rounded="2xl" />

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Text as="h1" fontSize="4xl" fontWeight="semibold">
            {name}
          </Text>

          <Text as="h2" color="muted">
            {hex}
          </Text>
        </VStack>
      </Grid>

      <Spacer />
    </HStack>
  )
}
