import {
  ScrollArea,
  SegmentedControl,
  SegmentedControlButton,
} from "@yamada-ui/react"
import { useState, type FC, type MutableRefObject } from "react"
import { useI18n } from "contexts/i18n-context"

const TABS = ["alternatives", "shades", "tints", "tones", "hues"]

export type TabsProps = {
  tab: string
  hex: string
  onSelectRef: MutableRefObject<(tab: string, hex: string) => void>
}

export const Tabs: FC<TabsProps> = ({ tab: tabProp, hex, onSelectRef }) => {
  const [tab, setTab] = useState<string>(tabProp)
  const { t } = useI18n()

  return (
    <ScrollArea as="section" type="never" tabIndex={-1}>
      <SegmentedControl variant="tabs" value={tab} w="full">
        {TABS.map((tab) => {
          return (
            <SegmentedControlButton
              key={tab}
              tabIndex={-1}
              value={tab}
              onClick={() => {
                setTab(tab)
                onSelectRef.current(tab, hex)
              }}
            >
              {t(`generators.${tab}`)}
            </SegmentedControlButton>
          )
        })}
      </SegmentedControl>
    </ScrollArea>
  )
}
