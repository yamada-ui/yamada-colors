import type { IconButtonProps, MenuProps, StackProps } from "@yamada-ui/react"
import type { FC } from "react"
import { Pencil, Trash2, Upload } from "@yamada-ui/lucide"
import {
  Box,
  ChevronIcon,
  Dialog,
  funcAll,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  noop,
  SegmentedControl,
  SegmentedControlButton,
  Spacer,
  Tag,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@yamada-ui/react"
import { ExportModal, PaletteRenameModal } from "components/overlay"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { useRouter } from "next/router"
import { memo, useCallback, useRef } from "react"
import { setCookie } from "utils/storage"
import { usePalette } from "./context"

export interface HeaderProps extends StackProps {}

export const Header: FC<HeaderProps> = memo(({ ...rest }) => {
  const { name, colors, setName, setTab, tab, timestamp, uuid } = usePalette()
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

      changePalette({ name, colors, timestamp, uuid })
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
        alignItems="center"
        gap={{ base: "md" }}
        templateColumns={{ base: "auto 1fr" }}
      >
        {colors.length ? (
          <Grid
            boxSize={{ base: "20", sm: "16" }}
            overflow="hidden"
            rounded="2xl"
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
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            boxSize={{ base: "20", sm: "16" }}
            rounded="2xl"
          />
        )}

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center" minW="0">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }} lineClamp={1}>
            {name}
          </Heading>

          <Text as="span" alignSelf="flex-start" color="muted" lineClamp={1}>
            {colors.length} colors
          </Text>
        </VStack>
      </Grid>

      <Spacer />

      <VStack
        alignItems="flex-end"
        gap="sm"
        justifyContent="space-between"
        w="auto"
      >
        <HStack gap="sm">
          <RollbackButtons />

          <DownloadButton />

          <EditButton name={name} onEdit={onEdit} />

          <DeleteButton name={name} onDelete={onDelete} />
        </HStack>

        <SegmentedControl
          size="sm"
          variant="tabs"
          display={{ base: "inline-flex", sm: "none" }}
          value={tab}
          onChange={onChange}
        >
          {CONSTANT.ENUM.PALETTE.map((tab) => {
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

interface RollbackButtonsProps {}

const RollbackButtons: FC<RollbackButtonsProps> = memo(() => {
  const { name, changeColors, colorsMapRef, indexRef, timestamp, uuid } =
    usePalette()
  const { t } = useI18n()
  const { changePalette } = useApp()
  const index = indexRef.current
  const colors = colorsMapRef.current

  const rollbackColors = (index: number) => {
    indexRef.current = index

    const colors = [...colorsMapRef.current[index]!]

    changeColors(colors, true)

    const resolvedColors = colors.map(({ name, hex }) => ({ name, hex }))

    changePalette({ name, colors: resolvedColors, timestamp, uuid })
  }

  return (
    <>
      <Tooltip label={t("palette.redo")} placement="top">
        <IconButton
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          color="muted"
          disabled={!index}
          display={{ base: "inline-flex", sm: "none" }}
          icon={<ChevronIcon fontSize="2xl" transform="rotate(90deg)" />}
          isRounded
          _hover={{ bg: ["blackAlpha.100", "whiteAlpha.100"], _disabled: {} }}
          onClick={() => rollbackColors(index - 1)}
        />
      </Tooltip>

      <Tooltip label={t("palette.undo")} placement="top">
        <IconButton
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          color="muted"
          disabled={index === colors.length - 1}
          display={{ base: "inline-flex", sm: "none" }}
          icon={<ChevronIcon fontSize="2xl" transform="rotate(-90deg)" />}
          isRounded
          _hover={{ bg: ["blackAlpha.100", "whiteAlpha.100"], _disabled: {} }}
          onClick={() => rollbackColors(index + 1)}
        />
      </Tooltip>
    </>
  )
})

RollbackButtons.displayName = "RollbackButtons"

interface DownloadButtonProps extends IconButtonProps {
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
              modifiers={[
                {
                  name: "preventOverflow",
                  options: {
                    padding: {
                      bottom: padding,
                      left: padding,
                      right: padding,
                      top: padding,
                    },
                  },
                },
              ]}
              placement="bottom"
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
                  colorScheme="neutral"
                  aria-label="Open color download menu"
                  bg={["blackAlpha.100", "whiteAlpha.100"]}
                  borderColor="transparent"
                  color="muted"
                  icon={<Upload fontSize="1.125rem" />}
                  isRounded
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

interface EditButtonProps {
  name: string
  onEdit: (name: string) => void
}

const EditButton: FC<EditButtonProps> = memo(({ name, onEdit }) => {
  const { t } = useI18n()
  const onOpenRef = useRef<() => void>(noop)

  return (
    <>
      <Tooltip label={t("palette.rename")} placement="top">
        <IconButton
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          color="muted"
          icon={<Pencil fontSize="1.125rem" />}
          isRounded
          onClick={() => onOpenRef.current()}
        />
      </Tooltip>

      <PaletteRenameModal
        value={name}
        onOpenRef={onOpenRef}
        onSubmit={onEdit}
      />
    </>
  )
})

EditButton.displayName = "EditButton"

interface DeleteButtonProps {
  name: string
  onDelete: () => void
}

const DeleteButton: FC<DeleteButtonProps> = memo(({ name, onDelete }) => {
  const { t } = useI18n()
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Tooltip label={t("palette.delete")} placement="top">
        <IconButton
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          color="danger"
          icon={<Trash2 fontSize="1.125rem" />}
          isRounded
          onClick={onOpen}
        />
      </Tooltip>

      <Dialog
        cancel={{
          colorScheme: "neutral",
          children: t("palettes.delete.cancel"),
        }}
        header={<Text lineClamp={1}>{name}</Text>}
        isOpen={isOpen}
        success={{
          colorScheme: "danger",
          children: t("palettes.delete.submit"),
        }}
        withCloseButton={false}
        onCancel={onClose}
        onClose={onClose}
        onSuccess={onDelete}
      >
        {t("palettes.delete.description")}
      </Dialog>
    </>
  )
})

DeleteButton.displayName = "DeleteButton"
