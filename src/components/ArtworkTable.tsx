import { DataTable } from 'primereact/datatable'
import type { DataTablePageEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import fetchArtworks from '../api'
import type { Artwork } from '../types'
import CustomSelectOverlay from './CustomSelectOverlay'

export default function ArtworkTable() {
  const [data, setData] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    setLoading(true)
    fetchArtworks(page)
      .then(res => {
        setData(res.data)
        setTotalRecords(res.pagination.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const onPageChange = (e: DataTablePageEvent) => {
    setPage((e.page ?? 0) + 1)
  }

  const selectedRows = data.filter(row => selectedIds.has(row.id))

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <CustomSelectOverlay
          currentPageData={data}
          selectedIds={selectedIds}
          onUpdate={setSelectedIds}
        />
      </div>

      <DataTable
        value={data}
        loading={loading}
        paginator
        rows={12}
        totalRecords={totalRecords}
        lazy
        first={(page - 1) * 12}
        onPage={onPageChange}
        selection={selectedRows}
        onSelectionChange={(e) => {
          const updated = new Set(selectedIds)
          e.value.forEach((row: Artwork) => updated.add(row.id))

          data.forEach(row => {
            if (!e.value.some((r: Artwork) => r.id === row.id)) {
              updated.delete(row.id)
            }
          })

          setSelectedIds(updated)
        }}
        selectionMode="checkbox"
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Year" />
        <Column field="date_end" header="End Year" />
      </DataTable>
    </>
  )
}
