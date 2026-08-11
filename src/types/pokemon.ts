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

export interface NamedAPIResource {
  name: string
  url: string
}

export interface RegionData {
  name: string
  displayName: string
  generation: string
  starterId: number
  gradientClass: string
}

export interface PokemonTypeData {
  name: string
  url: string
}

export interface HabitatBadgeProps {
  name: string
  onClick?: () => void
}

export interface ColorSwatchProps {
  name: string
  hex: string
  onClick?: () => void
}

export interface ShapeCardProps {
  name: string
  onClick?: () => void
}
