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
  SegmentedControl,
  SegmentedControlButton,
  ChevronIcon,
  Tooltip,
  funcAll,
} from "@yamada-ui/react"
import type { IconButtonProps, MenuProps, StackProps } from "@yamada-ui/react"
import { useRouter } from "next/router"
import { memo, useCallback, useRef, useState } from "react"
import type { FC } from "react"
import { usePalette } from "./context"
import { Export, Pen, Trash } from "components/media-and-icons"
import { ExportModal } from "components/overlay"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { setCookie } from "utils/storage"

const TABS = ["palettes", "blindness", "shades", "tints", "tones"]

export type HeaderProps = StackProps & {}

export const Header: FC<HeaderProps> = memo(({ ...rest }) => {
  const { tab, uuid, name, colors, timestamp, setTab, setName } = usePalette()
  const { changePalette, deletePalette } = useApp()
  const router = useRouter()
  const { t } = useI18n()

  const onChange = (tab: string) => {
    setCookie(CONSTANT.STORAGE.PALETTE_TAB, tab)
    setTab(tab)
  }

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
    <HStack as="section" alignItems="flex-start" gap="sm" {...rest}>
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
            bg={["blackAlpha.100", "whiteAlpha.100"]}
          />
        )}

        <VStack minW="0" gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }} lineClamp={1}>
            {name}
          </Heading>

          <Text as="span" color="muted" alignSelf="flex-start" lineClamp={1}>
            {colors.length} colors
          </Text>
        </VStack>
      </Grid>

      <Spacer />

      <VStack
        w="auto"
        gap="sm"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <HStack gap="sm">
          <RollbackButtons />

          <DownloadButton />

          <EditButton name={name} onEdit={onEdit} />

          <DeleteButton name={name} onDelete={onDelete} />
        </HStack>

        <SegmentedControl
          variant="tabs"
          value={tab}
          display={{ base: "inline-flex", sm: "none" }}
          size="sm"
          onChange={onChange}
        >
          {TABS.map((tab) => {
            return (
              <SegmentedControlButton key={tab} value={tab}>
                {t(`palette.tab.${tab}`)}
              </SegmentedControlButton>
            )
          })}
        </SegmentedControl>
      </VStack>
    </HStack>
  )
})

Header.displayName = "Header"

type RollbackButtonsProps = {}

const RollbackButtons: FC<RollbackButtonsProps> = memo(() => {
  const { uuid, name, timestamp, indexRef, colorsMapRef, changeColors } =
    usePalette()
  const { t } = useI18n()
  const { changePalette } = useApp()
  const index = indexRef.current
  const colors = colorsMapRef.current

  const rollbackColors = (index: number) => {
    indexRef.current = index

    const colors = [...colorsMapRef.current[index]]

    changeColors(colors, true)

    const resolvedColors = colors.map(({ name, hex }) => ({ name, hex }))

    changePalette({ uuid, name, colors: resolvedColors, timestamp })
  }

  return (
    <>
      <Tooltip label={t("palette.redo")} placement="top">
        <IconButton
          display={{ base: "inline-flex", sm: "none" }}
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          colorScheme="neutral"
          icon={
            <ChevronIcon
              fontSize="1.75em"
              color="muted"
              transform="rotate(90deg)"
            />
          }
          borderColor="transparent"
          isRounded
          disabled={!index}
          onClick={() => rollbackColors(index - 1)}
          _hover={{ bg: ["blackAlpha.100", "whiteAlpha.100"], _disabled: {} }}
        />
      </Tooltip>

      <Tooltip label={t("palette.undo")} placement="top">
        <IconButton
          display={{ base: "inline-flex", sm: "none" }}
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          colorScheme="neutral"
          icon={
            <ChevronIcon
              fontSize="1.75em"
              color="muted"
              transform="rotate(-90deg)"
            />
          }
          borderColor="transparent"
          isRounded
          disabled={index === colors.length - 1}
          onClick={() => rollbackColors(index + 1)}
          _hover={{ bg: ["blackAlpha.100", "whiteAlpha.100"], _disabled: {} }}
        />
      </Tooltip>
    </>
  )
})

RollbackButtons.displayName = "RollbackButtons"

type DownloadButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const DownloadButton: FC<DownloadButtonProps> = memo(
  ({ menuProps, ...rest }) => {
    const { colors } = usePalette()
    const { t } = useI18n()
    const typeRef = useRef<ColorExport>("json.token")
    const tooltipControl = useDisclosure()
    const menuControl = useDisclosure()
    const modalControl = useDisclosure()
    const padding = useBreakpointValue({ base: 32, md: 16 })

    const onSelect = (type: ColorExport) => {
      typeRef.current = type
      modalControl.onOpen()
    }

    return (
      <>
        <Tooltip
          {...tooltipControl}
          isDisabled={menuControl.isOpen}
          label={t("palette.export")}
          placement="top"
        >
          <Box>
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
              {...menuControl}
              {...menuProps}
              onOpen={funcAll(
                menuProps?.onOpen,
                menuControl.onOpen,
                tooltipControl.onClose,
              )}
            >
              <MenuButton as="div">
                <IconButton
                  aria-label="Open color download menu"
                  isRounded
                  bg={["blackAlpha.100", "whiteAlpha.100"]}
                  borderColor="transparent"
                  colorScheme="neutral"
                  icon={<Export color="muted" />}
                  {...rest}
                />
              </MenuButton>

              <MenuList>
                <MenuItem onClick={() => onSelect("json.token")}>
                  JSON
                  <Tag size="sm" variant="muted">
                    Tones
                  </Tag>
                </MenuItem>
                <MenuItem onClick={() => onSelect("json")}>JSON</MenuItem>
                <MenuItem onClick={() => onSelect("css.token")}>
                  CSS
                  <Tag size="sm" variant="muted">
                    Tones
                  </Tag>
                </MenuItem>
                <MenuItem onClick={() => onSelect("css")}>CSS</MenuItem>
              </MenuList>
            </Menu>{" "}
          </Box>
        </Tooltip>

        <ExportModal
          type={typeRef.current}
          colors={colors}
          isOpen={modalControl.isOpen}
          onClose={modalControl.onClose}
        />
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
      <Tooltip label={t("palette.rename")} placement="top">
        <IconButton
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          colorScheme="neutral"
          icon={<Pen color="muted" />}
          borderColor="transparent"
          isRounded
          onClick={onOpen}
        />
      </Tooltip>

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
      <Tooltip label={t("palette.delete")} placement="top">
        <IconButton
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          colorScheme="neutral"
          icon={<Trash color="danger" />}
          borderColor="transparent"
          isRounded
          onClick={onOpen}
        />
      </Tooltip>

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
