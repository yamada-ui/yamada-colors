import type { StackProps } from "@yamada-ui/react"
import {
  Center,
  Divider,
  HStack,
  ScrollArea,
  Text,
  VStack,
  isString,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { ColorData } from "./index.page"
import { isLight } from "utils/color"

export type DataProps = ColorData & {}

export const Data: FC<DataProps> = ({
  name,
  hex,
  rgb,
  hsl,
  hsv,
  cmyk,
  cielab,
  cielch,
}) => {
  return (
    <>
      <ScrollArea type="never">
        <HStack divider={<Divider />} h="46px">
          <StackItem label="name" value={name} />
          <StackItem label="hex" value={hex} />
          <StackItem label="rgb" value={rgb} />
          <StackItem label="hsl" value={hsl} />
          <StackItem label="hsv" value={hsv} />
          <StackItem label="cmyk" value={cmyk} />
          <StackItem label="cielab" value={cielab} />
          <StackItem label="cielch" value={cielch} />
        </HStack>
      </ScrollArea>

      <Center
        w="full"
        h="xs"
        rounded="xl"
        flexDirection="column"
        gap="xs"
        bg={hex}
      >
        <Text
          fontSize="2xl"
          fontWeight="semibold"
          color={isLight(hex) ? "black" : "white"}
        >
          {name}
        </Text>

        <Text
          fontSize="lg"
          color={isLight(hex) ? "blackAlpha.700" : "whiteAlpha.700"}
        >
          {hex}
        </Text>
      </Center>
    </>
  )
}

type StackItemProps = StackProps & {
  label: string
  value: string | [number, number, number] | [number, number, number, number]
}

const StackItem: FC<StackItemProps> = ({ label, value }) => {
  return (
    <VStack w="auto" alignItems="center" px="md" gap="xs">
      <Text fontSize="xs" color="muted" textTransform="uppercase">
        {label}
      </Text>

      <Text whiteSpace="nowrap" color={["blackAlpha.800", "whiteAlpha.800"]}>
        {isString(value) ? value : value.join(", ")}
      </Text>
    </VStack>
  )
}
