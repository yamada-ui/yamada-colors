import {
  ScrollArea,
  SegmentedControl,
  SegmentedControlButton,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"
import { useI18n } from "contexts/i18n-context"

const TABS = ["alternatives", "shades", "tints", "tones", "hues"]

export type TabsProps = { tab: string; hex: string }

export const Tabs: FC<TabsProps> = ({ tab, hex }) => {
  const { t } = useI18n()

  return (
    <ScrollArea as="section" type="never" tabIndex={-1}>
      <SegmentedControl as="nav" variant="tabs" value={tab} w="full">
        {TABS.map((tab) => {
          return (
            <SegmentedControlButton
              key={tab}
              as={Link}
              tabIndex={-1}
              value={tab}
              href={`/generators?hex=${hex.replace("#", "")}&tab=${tab}`}
            >
              {t(`generators.${tab}`)}
            </SegmentedControlButton>
          )
        })}
      </SegmentedControl>
    </ScrollArea>
  )
}
