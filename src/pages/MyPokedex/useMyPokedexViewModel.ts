import { useState, useEffect } from 'react'
import {
  loadPokedex as fetchPokedexFromModel,
  savePokedex as addPokedexToModel,
  deletePokedex as removePokedexFromModel,
} from './MyPokedexModel'
import {
  loadFavourites as fetchFavouritesFromModel,
  saveFavourite as addFavouriteToModel,
  deleteFavourite as removeFavouriteFromModel,
} from '../Favourites/FavouritesModel'
import { useAuth } from '../../context/AuthContext'
import type { PokemonListItem } from '../../types/pokemon'

export function useMyPokedexViewModel(userIdProp?: string) {
  const { user } = useAuth()
  const userId = userIdProp || user?.uid || ''

  const [pokedex, setPokedex] = useState<PokemonListItem[]>([])
  const [favourites, setFavourites] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!userId) {
      setPokedex([])
      setFavourites([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [dex, favs] = await Promise.all([
        fetchPokedexFromModel(userId),
        fetchFavouritesFromModel(userId),
      ])
      setPokedex(dex)
      setFavourites(favs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load My Pokédex.')
    } finally {
      setLoading(false)
    }
  }

  const addToPokedex = async (pokemon: PokemonListItem) => {
    if (!userId) return
    try {
      await addPokedexToModel(userId, pokemon)
      setPokedex((prev) => {
        if (prev.some((item) => item.url === pokemon.url)) return prev
        return [...prev, pokemon]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokémon to My Pokédex.')
    }
  }

  const removeFromPokedex = async (pokemon: PokemonListItem) => {
    if (!userId) return
    try {
      await removePokedexFromModel(userId, pokemon)
      setPokedex((prev) => prev.filter((item) => item.url !== pokemon.url))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove Pokémon from My Pokédex.')
    }
  }

  const toggleFavourite = async (pokemon: PokemonListItem) => {
    if (!userId) return
    const isFav = favourites.some((item) => item.url === pokemon.url)
    try {
      if (isFav) {
        await removeFavouriteFromModel(userId, pokemon)
        setFavourites((prev) => prev.filter((item) => item.url !== pokemon.url))
      } else {
        await addFavouriteToModel(userId, pokemon)
        setFavourites((prev) => [...prev, pokemon])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Favourites.')
    }
  }

  useEffect(() => {
    loadData()
  }, [userId])

  return {
    pokedex,
    favourites,
    loading,
    error,
    loadPokedex: loadData,
    addToPokedex,
    removeFromPokedex,
    toggleFavourite,
  }
}
