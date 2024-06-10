import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  assignRef,
  useDisclosure,
} from "@yamada-ui/react"
import type { StackProps } from "@yamada-ui/react"
import { memo, useRef, useState } from "react"
import type { FC, MutableRefObject } from "react"
import { MagnifyingGlass, Plus } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

export type HeaderProps = StackProps & {
  onCreateRef: MutableRefObject<() => void>
  onSearch: (query: string) => void
  query: string
}

export const Header: FC<HeaderProps> = memo(
  ({ onCreateRef, query, onSearch, ...rest }) => {
    const { t } = useI18n()
    const { createPalette } = useApp()

    return (
      <HStack as="section" gap="sm" {...rest}>
        <InputGroup>
          <InputLeftElement ms="1">
            <MagnifyingGlass color="muted" />
          </InputLeftElement>

          <Input
            defaultValue={query}
            onChange={(ev) => onSearch(ev.target.value)}
            rounded="full"
            pl="2.5rem"
            placeholder={t("palettes.search")}
          />
        </InputGroup>

        <CreateButton onCreate={createPalette} onCreateRef={onCreateRef} />
      </HStack>
    )
  },
)

Header.displayName = "Header"

type CreateButtonProps = {
  onCreate: (name: string) => void
  onCreateRef: MutableRefObject<() => void>
}

const CreateButton: FC<CreateButtonProps> = memo(
  ({ onCreate, onCreateRef }) => {
    const { t } = useI18n()
    const [value, setValue] = useState<string>("")
    const { isOpen, onOpen, onClose } = useDisclosure({
      onClose: () => {
        setValue("")
      },
    })
    const isComposition = useRef<boolean>(false)

    assignRef(onCreateRef, onOpen)

    return (
      <>
        <Tooltip label={t("palette.create")} placement="top">
          <IconButton
            isRounded
            icon={<Plus color="muted" />}
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            colorScheme="neutral"
            onClick={onOpen}
          />
        </Tooltip>

        <Dialog isOpen={isOpen} onClose={onClose} withCloseButton={false}>
          <DialogHeader>{t("palettes.create.title")}</DialogHeader>

          <DialogBody>
            <Input
              value={value}
              onChange={(ev) => setValue(ev.target.value)}
              placeholder={t("palettes.create.placeholder")}
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
                onCreate(value)
              }}
            />
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" colorScheme="neutral" onClick={onClose}>
              {t("palettes.create.cancel")}
            </Button>

            <Button
              isDisabled={!value.length}
              colorScheme="primary"
              onClick={() => {
                onClose()
                onCreate(value)
              }}
            >
              {t("palettes.create.submit")}
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
)

CreateButton.displayName = "CreateButton"
