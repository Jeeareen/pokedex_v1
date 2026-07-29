export interface PokemonListItem {
  name: string
  url: string
  type: string
  gen: number
}

export interface PokeAPIResponse {
  count: number
  next: string | null
  previous: string | null
  results: { name: string; url: string }[]
}
