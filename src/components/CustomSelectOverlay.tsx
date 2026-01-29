import  { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import type { Artwork } from '../types'
import { useRef, useState } from 'react'

interface Props {
  currentPageData: Artwork[]
  selectedIds: Set<number>
  onUpdate: (ids: Set<number>) => void
}

export default function CustomSelectOverlay({
  currentPageData,
  selectedIds,
  onUpdate
}: Props) {
  const op = useRef<OverlayPanel>(null)
  const [count, setCount] = useState('')

  const applySelection = () => {
    const n = parseInt(count)
    if (!n || n <= 0) return

    const updated = new Set(selectedIds)
    currentPageData.slice(0, n).forEach(row => updated.add(row.id))
    onUpdate(updated)

    setCount('')
    op.current?.hide()
  }

  return (
    <>
      <Button
        label="Custom Select"
        icon="pi pi-check-square"
        onClick={(e) => op.current?.toggle(e)}
      />

      <OverlayPanel ref={op}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <InputText
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Rows to select"
          />
          <Button label="Apply" onClick={applySelection} />
        </div>
      </OverlayPanel>
    </>
  )
}
