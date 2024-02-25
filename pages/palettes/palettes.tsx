import {
  Button,
  Center,
  Grid,
  GridItem,
  Motion,
  Text,
  VStack,
  assignRef,
  useUpdateEffect,
} from "@yamada-ui/react"
import type { GridProps } from "@yamada-ui/react"
import { matchSorter } from "match-sorter"
import Link from "next/link"
import { memo, useRef, useState } from "react"
import type { FC, MutableRefObject } from "react"
import { Plus } from "components/media-and-icons"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { setCookie } from "utils/storage"

export type PalettesProps = GridProps & {
  onCreate: () => void
  onSearchRef: MutableRefObject<(query: string) => void>
  query: string
}

export const Palettes: FC<PalettesProps> = memo(
  ({ onCreate, onSearchRef, query, ...rest }) => {
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
      <Grid
        as="ul"
        templateColumns={{
          base: "repeat(4, 1fr)",
          xl: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap="md"
        {...rest}
      >
        {palettes.map(({ uuid, name, colors }) => {
          return (
            <GridItem key={uuid} as="li">
              <Motion whileHover={{ scale: 0.95 }}>
                <VStack
                  as={Link}
                  href={`/palettes/${uuid}`}
                  gap="0"
                  rounded="2xl"
                  overflow="hidden"
                  boxShadow={[
                    "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px 1px rgba(0, 0, 0, 0.06)",
                    "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px -5px 10px rgba(0, 0, 0, 0.2)",
                  ]}
                  onClick={() => {
                    setCookie(CONSTANT.STORAGE.PALETTE_QUERY, queryRef.current)
                  }}
                >
                  <Grid
                    templateColumns={`repeat(${colors.length > 4 ? 4 : colors.length}, 1fr)`}
                    h={{ base: "4xs", sm: "5xs" }}
                  >
                    {colors.length ? (
                      colors.map(({ hex }, index) => (
                        <GridItem key={`${hex}-${index}`}></GridItem>
                      ))
                    ) : (
                      <>
                        <GridItem bg={["blackAlpha.50", "whiteAlpha.100"]} />
                      </>
                    )}
                  </Grid>

                  <Center
                    flexDirection="column"
                    alignItems="flex-start"
                    px={{ base: "normal", sm: "md" }}
                    gap={{ base: "xs", sm: "0" }}
                    h={{ base: "4xs", sm: "5xs" }}
                  >
                    <Text fontWeight="medium" lineClamp={1}>
                      {name}
                    </Text>

                    <Text as="span" fontSize="sm" color="muted">
                      {colors.length} colors
                    </Text>
                  </Center>
                </VStack>
              </Motion>
            </GridItem>
          )
        })}
      </Grid>
    ) : (
      <Center
        py="3xl"
        flexDirection="column"
        gap={{ base: "lg", sm: "normal" }}
      >
        <Text color="muted">{t("palettes.not-found.label")}</Text>

        <Button
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          colorScheme="neutral"
          leftIcon={<Plus />}
          rounded="full"
          onClick={onCreate}
        >
          {t("palettes.not-found.create")}
        </Button>
      </Center>
    )
  },
)

Palettes.displayName = "palettes"