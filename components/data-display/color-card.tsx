import type {
  AspectRatioProps,
  BoxProps,
  GridProps,
  MotionProps,
} from "@yamada-ui/react"
import {
  AspectRatio,
  Box,
  Grid,
  Motion,
  Text,
  VStack,
  forwardRef,
} from "@yamada-ui/react"
import type { LinkProps } from "next/link"
import Link from "next/link"
import { memo } from "react"
import { useApp } from "contexts/app-context"

import { f, isLight } from "utils/color"

export type ColorCardProps = AspectRatioProps & {
  size?: "md" | "lg"
  hex: string
  name?: string
  linkProps?: Omit<BoxProps, "as"> & Omit<LinkProps, "as">
  motionProps?: MotionProps
  gridProps?: GridProps
  boxProps?: BoxProps
}

export const ColorCard = memo(
  forwardRef<ColorCardProps, "div">(
    (
      {
        size = "lg",
        hex,
        name,
        linkProps,
        motionProps,
        gridProps,
        boxProps,
        ...rest
      },
      ref,
    ) => {
      const { format } = useApp()

      if (size === "lg") {
        return (
          <AspectRatio ref={ref} {...rest}>
            <Box
              as={Link}
              href={`/colors/${hex.replace("#", "")}`}
              outline={0}
              position="relative"
              _focusVisible={{
                zIndex: 1,
                _before: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxShadow: "inline",
                  rounded: "2xl",
                },
              }}
              {...linkProps}
            >
              <Motion
                boxSize="full"
                bg={hex}
                color={isLight(hex) ? "black" : "white"}
                p={{ base: "normal", lg: "md", md: "normal", sm: "md" }}
                rounded="2xl"
                whileHover={{ scale: 0.95 }}
                {...motionProps}
              >
                <VStack
                  minW="0"
                  boxSize="full"
                  justifyContent="flex-end"
                  gap={{ base: "xs", sm: "0" }}
                >
                  {name ? (
                    <Text as="span" fontWeight="medium" lineClamp={1}>
                      {name}
                    </Text>
                  ) : null}

                  <Text
                    as="span"
                    fontSize="sm"
                    lineClamp={1}
                    textAlign={name ? "left" : "center"}
                  >
                    {f(hex, format)}
                  </Text>
                </VStack>
              </Motion>
            </Box>
          </AspectRatio>
        )
      } else {
        return (
          <Motion
            ref={ref}
            rounded="2xl"
            whileHover={{ scale: 0.95 }}
            {...motionProps}
          >
            <Grid
              as={Link}
              href={`/colors/${hex.replace("#", "")}`}
              templateColumns={{ base: "auto 1fr" }}
              gap={{ base: "md", sm: "sm" }}
              outline={0}
              _focusVisible={{ boxShadow: "outline" }}
              rounded="2xl"
              {...gridProps}
            >
              <Box
                boxSize={{ base: "12" }}
                bg={hex}
                rounded="2xl"
                {...boxProps}
              />

              <VStack
                minW="0"
                gap={{ base: "xs", sm: "0" }}
                justifyContent="center"
              >
                {name ? (
                  <Text as="span" fontWeight="medium" lineClamp={1}>
                    {name}
                  </Text>
                ) : null}

                <Text as="span" fontSize="sm" color="muted" lineClamp={1}>
                  {f(hex, format)}
                </Text>
              </VStack>
            </Grid>
          </Motion>
        )
      }
    },
  ),
)
