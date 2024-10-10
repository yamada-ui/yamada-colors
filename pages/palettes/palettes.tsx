import type { GridItemProps, GridProps } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import { Plus } from "@yamada-ui/lucide"
import {
  assignRef,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Motion,
  Text,
  useUpdateEffect,
  VStack,
} from "@yamada-ui/react"
import { PaletteCommandMenu } from "components/overlay"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { matchSorter } from "match-sorter"
import Link from "next/link"
import { memo, useRef, useState } from "react"
import { setCookie } from "utils/storage"

export interface PalettesProps extends GridProps {
  query: string
  onCreate: () => void
  onSearchRef: MutableRefObject<(query: string) => void>
}

export const Palettes: FC<PalettesProps> = memo(
  ({ query, onCreate, onSearchRef, ...rest }) => {
    const { t } = useI18n()
    const { palettes: palettesProp } = useApp()
    const [palettes, setPalettes] = useState<ColorPalettes>(() => {
      if (query.length) {
        return matchSorter(palettesProp, query, {
          keys: ["name"],
        })
      } else {
        return palettesProp
      }
    })
    const queryRef = useRef<string>(query)

    const onSearch = (query: string) => {
      queryRef.current = query

      if (query.length) {
        setPalettes(
          matchSorter(palettes, query, {
            keys: ["name"],
          }),
        )
      } else {
        setPalettes(palettesProp)
      }
    }

    useUpdateEffect(() => {
      setPalettes(palettesProp)
    }, [palettesProp])

    assignRef(onSearchRef, onSearch)

    return palettes.length ? (
      <Box as="nav">
        <Grid
          as="ul"
          gap="md"
          templateColumns={{
            base: "repeat(4, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(2, 1fr)",
          }}
          {...rest}
        >
          {palettes.map((palette) => (
            <Palette key={palette.uuid} palette={palette} queryRef={queryRef} />
          ))}
        </Grid>
      </Box>
    ) : (
      <Center
        as="section"
        flexDirection="column"
        gap={{ base: "lg", sm: "normal" }}
        py="3xl"
      >
        <Text color="muted">{t("palettes.not-found.label")}</Text>

        <Button
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          isRounded
          leftIcon={<Plus fontSize="1.5rem" />}
          onClick={onCreate}
        >
          {t("palettes.not-found.create")}
        </Button>
      </Center>
    )
  },
)

Palettes.displayName = "palettes"

interface PaletteProps extends GridItemProps {
  palette: ColorPalette
  queryRef: MutableRefObject<string>
}

const Palette: FC<PaletteProps> = memo(({ palette, queryRef, ...rest }) => {
  const { name, colors, uuid } = palette

  return (
    <GridItem as="li" minW="0" {...rest}>
      <PaletteCommandMenu palette={palette}>
        <Motion whileHover={{ scale: 0.95 }}>
          <VStack
            as={Link}
            href={`/palettes/${uuid}`}
            boxShadow={[
              "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px 1px rgba(0, 0, 0, 0.06)",
              "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.2), 0px -3px 6px rgba(0, 0, 0, 0.2)",
            ]}
            gap="0"
            outline={0}
            overflow="hidden"
            rounded="2xl"
            _focusVisible={{ boxShadow: ["outline", "outline"] }}
            onClick={() => {
              setCookie(CONSTANT.STORAGE.PALETTE_QUERY, queryRef.current)
            }}
          >
            <Grid
              h={{ base: "4xs", sm: "5xs" }}
              templateColumns={`repeat(${colors.length > 4 ? 4 : colors.length}, 1fr)`}
            >
              {colors.length ? (
                colors.map(({ hex }, index) => (
                  <GridItem
                    key={`${hex}-${index}`}
                    bg={hex}
                    display={index < 4 ? "block" : "none"}
                  />
                ))
              ) : (
                <GridItem bg={["blackAlpha.100", "whiteAlpha.100"]} />
              )}
            </Grid>

            <Grid
              alignItems="center"
              gap={{ base: "xs", sm: "0" }}
              h={{ base: "4xs", sm: "5xs" }}
              justifyContent="flex-start"
              px={{ base: "normal", sm: "md" }}
            >
              <Text alignSelf="flex-end" fontWeight="medium" lineClamp={1}>
                {name}
              </Text>

              <Text
                as="span"
                alignSelf="flex-start"
                color="muted"
                fontSize="sm"
              >
                {colors.length} colors
              </Text>
            </Grid>
          </VStack>
        </Motion>
      </PaletteCommandMenu>
    </GridItem>
  )
})

Palette.displayName = "palette"
