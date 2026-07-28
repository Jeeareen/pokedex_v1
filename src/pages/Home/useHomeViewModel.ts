import { useState } from 'react'
import { getPokemon, type PokemonListItem } from './HomeModel'

export function useHomeViewModel() {
  const [query, setQuery] = useState('')
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await getPokemon(query)
      setPokemons(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching Pokémon.')
    } finally {
      setLoading(false)
    }
  }

  return {
    query,
    setQuery,
    pokemons,
    loading,
    error,
    handleSearch,
  }
}
