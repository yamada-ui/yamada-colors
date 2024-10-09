import type { FC } from "react"
import { Box, Grid, Heading, HStack, Spacer, VStack } from "@yamada-ui/react"
import { PaletteMenu } from "components/forms"
import { CopyText } from "components/other"
import { useApp } from "contexts/app-context"
import { f } from "utils/color"

export interface HeaderProps extends Color {}

export const Header: FC<HeaderProps> = ({ name, hex }) => {
  const { format } = useApp()

  return (
    <HStack as="section" alignItems="flex-start" gap="sm">
      <Grid
        alignItems="center"
        gap={{ base: "md" }}
        templateColumns={{ base: "auto 1fr" }}
      >
        <Box bg={hex} boxSize={{ base: "20", sm: "16" }} rounded="2xl" />

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }}>{name}</Heading>

          <CopyText as="h2" alignSelf="flex-start" color="muted">
            {f(hex, format)}
          </CopyText>
        </VStack>
      </Grid>

      <Spacer />

      <PaletteMenu {...{ name, hex }} />
    </HStack>
  )
}
