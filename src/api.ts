import type { ApiResponse } from './types'


export default async function fetchArtworks(page: number): Promise<ApiResponse> {
  const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
  if (!res.ok) {
    throw new Error('Failed to fetch artworks')
  }
  return res.json()
}
