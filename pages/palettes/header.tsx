import type { StackProps } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import { Plus, Search } from "@yamada-ui/lucide"
import {
  assignRef,
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
  useDisclosure,
} from "@yamada-ui/react"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { memo, useRef, useState } from "react"

export interface HeaderProps extends StackProps {
  query: string
  onCreateRef: MutableRefObject<() => void>
  onSearch: (query: string) => void
}

export const Header: FC<HeaderProps> = memo(
  ({ query, onCreateRef, onSearch, ...rest }) => {
    const { t } = useI18n()
    const { createPalette } = useApp()

    return (
      <HStack as="section" gap="sm" {...rest}>
        <InputGroup>
          <InputLeftElement color="muted" ms="1">
            <Search fontSize="1.125rem" />
          </InputLeftElement>

          <Input
            defaultValue={query}
            pl="2.5rem"
            placeholder={t("palettes.search")}
            rounded="full"
            onChange={(ev) => onSearch(ev.target.value)}
          />
        </InputGroup>

        <CreateButton onCreate={createPalette} onCreateRef={onCreateRef} />
      </HStack>
    )
  },
)

Header.displayName = "Header"

interface CreateButtonProps {
  onCreate: (name: string) => void
  onCreateRef: MutableRefObject<() => void>
}

const CreateButton: FC<CreateButtonProps> = memo(
  ({ onCreate, onCreateRef }) => {
    const { t } = useI18n()
    const [value, setValue] = useState<string>("")
    const { isOpen, onClose, onOpen } = useDisclosure({
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
            colorScheme="neutral"
            bg={["blackAlpha.100", "whiteAlpha.100"]}
            borderColor="transparent"
            color="muted"
            icon={<Plus fontSize="1.125rem" />}
            isRounded
            onClick={onOpen}
          />
        </Tooltip>

        <Dialog isOpen={isOpen} withCloseButton={false} onClose={onClose}>
          <DialogHeader>{t("palettes.create.title")}</DialogHeader>

          <DialogBody>
            <Input
              placeholder={t("palettes.create.placeholder")}
              value={value}
              onChange={(ev) => setValue(ev.target.value)}
              onCompositionEnd={() => {
                isComposition.current = false
              }}
              onCompositionStart={() => {
                isComposition.current = true
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
            <Button colorScheme="neutral" variant="ghost" onClick={onClose}>
              {t("palettes.create.cancel")}
            </Button>

            <Button
              colorScheme="primary"
              isDisabled={!value.length}
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
