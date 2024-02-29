import { Box, Grid, HStack, Heading, Spacer, VStack } from "@yamada-ui/react"
import type { FC } from "react"
import { PaletteMenu } from "components/form"
import { CopyText } from "components/other"
import { useApp } from "contexts/app-context"
import { f } from "utils/color"

export type HeaderProps = Color

export const Header: FC<HeaderProps> = ({ hex, name }) => {
  const { format } = useApp()

  return (
    <HStack as="section" alignItems="flex-start" gap="sm">
      <Grid
        templateColumns={{ base: "auto 1fr" }}
        alignItems="center"
        gap={{ base: "md" }}
      >
        <Box boxSize={{ base: "20", sm: "16" }} bg={hex} rounded="2xl" />

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }}>{name}</Heading>

          <CopyText as="h2" color="muted" alignSelf="flex-start">
            {f(hex, format)}
          </CopyText>
        </VStack>
      </Grid>

      <Spacer />

      <PaletteMenu {...{ hex, name }} />
    </HStack>
  )
}
