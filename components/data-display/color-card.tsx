import type {
  AspectRatioProps,
  BoxProps,
  GridProps,
  Merge,
  MotionProps,
} from "@yamada-ui/react"
import type { NextLinkProps } from "components/navigation"
import type { ColorCommandMenuProps } from "components/overlay"
import {
  AspectRatio,
  Box,
  forwardRef,
  Grid,
  Motion,
  Text,
  VStack,
} from "@yamada-ui/react"
import { NextLink } from "components/navigation"
import { ColorCommandMenu } from "components/overlay"
import { useApp } from "contexts/app-context"
import { memo } from "react"
import { f, isLight } from "utils/color"

export interface ColorCardProps extends AspectRatioProps {
  hex: string
  name?: string
  size?: "lg" | "md"
  boxProps?: BoxProps
  gridProps?: GridProps
  linkProps?: Merge<NextLinkProps, BoxProps>
  menuProps?: Omit<ColorCommandMenuProps, "value">
  motionProps?: MotionProps
}

export const ColorCard = memo(
  forwardRef<ColorCardProps, "div">(
    (
      {
        name,
        size = "lg",
        hex,
        boxProps,
        gridProps,
        linkProps,
        menuProps,
        motionProps,
        ...rest
      },
      ref,
    ) => {
      const { format } = useApp()

      if (size === "lg") {
        return (
          <ColorCommandMenu name={name} value={hex} {...menuProps}>
            <AspectRatio ref={ref} {...rest}>
              <Box
                as={NextLink}
                href={`/colors/${hex.replace("#", "")}`}
                outline={0}
                position="relative"
                _focusVisible={{
                  zIndex: 1,
                  _before: {
                    bottom: 0,
                    boxShadow: "inline",
                    content: '""',
                    left: 0,
                    position: "absolute",
                    right: 0,
                    rounded: "2xl",
                    top: 0,
                  },
                }}
                {...linkProps}
              >
                <Motion
                  bg={hex}
                  boxSize="full"
                  color={isLight(hex) ? "black" : "white"}
                  p={{ base: "normal", sm: "md", md: "normal", lg: "md" }}
                  rounded="2xl"
                  whileHover={{ scale: 0.95 }}
                  {...motionProps}
                >
                  <VStack
                    boxSize="full"
                    gap={{ base: "xs", sm: "0" }}
                    justifyContent="flex-end"
                    minW="0"
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
          </ColorCommandMenu>
        )
      } else {
        return (
          <ColorCommandMenu name={name} value={hex} {...menuProps}>
            <Motion
              ref={ref}
              rounded="2xl"
              whileHover={{ scale: 0.95 }}
              {...motionProps}
            >
              <Grid
                as={NextLink}
                href={`/colors/${hex.replace("#", "")}`}
                gap={{ base: "md", sm: "sm" }}
                outline={0}
                rounded="2xl"
                templateColumns={{ base: "auto 1fr" }}
                _focusVisible={{ boxShadow: "outline" }}
                {...gridProps}
              >
                <Box
                  bg={hex}
                  boxSize={{ base: "12" }}
                  rounded="2xl"
                  {...boxProps}
                />

                <VStack
                  gap={{ base: "xs", sm: "0" }}
                  justifyContent="center"
                  minW="0"
                >
                  {name ? (
                    <Text as="span" fontWeight="medium" lineClamp={1}>
                      {name}
                    </Text>
                  ) : null}

                  <Text as="span" color="muted" fontSize="sm" lineClamp={1}>
                    {f(hex, format)}
                  </Text>
                </VStack>
              </Grid>
            </Motion>
          </ColorCommandMenu>
        )
      }
    },
  ),
)
