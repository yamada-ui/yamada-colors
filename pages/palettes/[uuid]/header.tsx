import {
  Box,
  Grid,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  useBreakpointValue,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  useDisclosure,
  Text,
  VStack,
  GridItem,
} from "@yamada-ui/react"
import type { IconButtonProps, MenuProps, StackProps } from "@yamada-ui/react"
import { useRouter } from "next/router"
import { memo, useCallback, useRef, useState } from "react"
import type { FC } from "react"
import { usePalette } from "./context"
import { Download, Pen, Trash } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

export type HeaderProps = StackProps & {}

export const Header: FC<HeaderProps> = memo(({ ...rest }) => {
  const { uuid, name, colors, timestamp, setName } = usePalette()
  const { changePalette, deletePalette } = useApp()
  const router = useRouter()

  const onEdit = useCallback(
    (name: string) => {
      setName(name)

      changePalette({ uuid, name, colors, timestamp })
    },
    [setName, changePalette, uuid, colors, timestamp],
  )

  const onDelete = useCallback(() => {
    deletePalette(uuid)

    router.push("/palettes")
  }, [deletePalette, uuid, router])

  return (
    <HStack alignItems="flex-start" gap="sm" {...rest}>
      <Grid
        templateColumns={{ base: "auto 1fr" }}
        alignItems="center"
        gap={{ base: "md" }}
      >
        {colors.length ? (
          <Grid
            boxSize={{ base: "20", sm: "16" }}
            rounded="2xl"
            overflow="hidden"
            templateColumns={`repeat(${colors.length < 3 ? 1 : 2}, 1fr)`}
          >
            {colors.map(({ hex }, index) => (
              <GridItem
                key={index}
                bg={hex}
                colSpan={colors.length === 3 ? (!index ? 2 : 1) : 1}
                display={index < 4 ? "block" : "none"}
              />
            ))}
          </Grid>
        ) : (
          <Box
            boxSize={{ base: "20", sm: "16" }}
            rounded="2xl"
            bg={["blackAlpha.50", "whiteAlpha.100"]}
          />
        )}

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }}>{name}</Heading>

          <Text as="span" color="muted" alignSelf="flex-start">
            {colors.length} colors
          </Text>
        </VStack>
      </Grid>

      <Spacer />

      <DownloadButton />

      <EditButton name={name} onEdit={onEdit} />

      <DeleteButton name={name} onDelete={onDelete} />
    </HStack>
  )
})

Header.displayName = "Header"

type DownloadButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const DownloadButton: FC<DownloadButtonProps> = memo(
  ({ menuProps, ...rest }) => {
    const padding = useBreakpointValue({ base: 32, md: 16 })

    return (
      <>
        <Menu
          placement="bottom"
          modifiers={[
            {
              name: "preventOverflow",
              options: {
                padding: {
                  top: padding,
                  bottom: padding,
                  left: padding,
                  right: padding,
                },
              },
            },
          ]}
          restoreFocus={false}
          {...menuProps}
        >
          <MenuButton
            as={IconButton}
            aria-label="Open color download menu"
            isRounded
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            colorScheme="neutral"
            icon={<Download color="muted" />}
            {...rest}
          />

          <MenuList>
            <MenuItem>
              JSON
              <Tag size="sm" colorScheme="neutral">
                Tones
              </Tag>
            </MenuItem>
            <MenuItem>JSON</MenuItem>
            <MenuItem>
              CSS
              <Tag size="sm" colorScheme="neutral">
                Tones
              </Tag>
            </MenuItem>
            <MenuItem>CSS</MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  },
)

DownloadButton.displayName = "DownloadButton"

type EditButtonProps = {
  name: string
  onEdit: (name: string) => void
}

const EditButton: FC<EditButtonProps> = memo(({ name, onEdit }) => {
  const { t } = useI18n()
  const [value, setValue] = useState<string>(name)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setValue((prev) => (!prev.length ? name : prev))
    },
  })
  const isComposition = useRef<boolean>(false)

  return (
    <>
      <IconButton
        bg={["blackAlpha.100", "whiteAlpha.100"]}
        colorScheme="neutral"
        icon={<Pen color="muted" />}
        borderColor="transparent"
        isRounded
        onClick={onOpen}
      />

      <Dialog isOpen={isOpen} onClose={onClose} withCloseButton={false}>
        <DialogHeader>{t("palettes.rename.title")}</DialogHeader>

        <DialogBody>
          <Input
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            placeholder={t("palettes.rename.placeholder")}
            onCompositionStart={() => {
              isComposition.current = true
            }}
            onCompositionEnd={() => {
              isComposition.current = false
            }}
            onKeyDown={(ev) => {
              if (ev.key !== "Enter") return
              if (isComposition.current) return
              if (!value.length) return

              onClose()
              onEdit(value)
            }}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" colorScheme="neutral" onClick={onClose}>
            {t("palettes.rename.cancel")}
          </Button>

          <Button
            isDisabled={!value.length}
            colorScheme="primary"
            onClick={() => {
              onClose()
              onEdit(value)
            }}
          >
            {t("palettes.rename.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
})

EditButton.displayName = "EditButton"

type DeleteButtonProps = {
  name: string
  onDelete: () => void
}

const DeleteButton: FC<DeleteButtonProps> = memo(({ name, onDelete }) => {
  const { t } = useI18n()
  const { isOpen, onOpen, onClose } = useDisclosure({})

  return (
    <>
      <IconButton
        bg={["blackAlpha.100", "whiteAlpha.100"]}
        colorScheme="neutral"
        icon={<Trash color="danger" />}
        borderColor="transparent"
        isRounded
        onClick={onOpen}
      />

      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        header={<Text lineClamp={1}>{name}</Text>}
        cancel={{
          colorScheme: "neutral",
          children: t("palettes.delete.cancel"),
        }}
        onCancel={onClose}
        success={{
          colorScheme: "danger",
          children: t("palettes.delete.submit"),
        }}
        onSuccess={onDelete}
        withCloseButton={false}
      >
        {t("palettes.delete.description")}
      </Dialog>
    </>
  )
})

DeleteButton.displayName = "DeleteButton"
