import { useState, useEffect } from 'react'
import {
  loadFavourites as fetchFavouritesFromModel,
  saveFavourite as addFavouriteToModel,
  deleteFavourite as removeFavouriteFromModel,
} from './FavouritesModel'
import {
  loadPokedex as fetchPokedexFromModel,
  savePokedex as addPokedexToModel,
  deletePokedex as removePokedexFromModel,
} from '../MyPokedex/MyPokedexModel'
import { useAuth } from '../../context/AuthContext'
import type { PokemonListItem } from '../../types/pokemon'

export function useFavouritesViewModel(userIdProp?: string) {
  const { user } = useAuth()
  const userId = userIdProp || user?.uid || ''

  const [favourites, setFavourites] = useState<PokemonListItem[]>([])
  const [myPokedex, setMyPokedex] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!userId) {
      setFavourites([])
      setMyPokedex([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [favs, dex] = await Promise.all([
        fetchFavouritesFromModel(userId),
        fetchPokedexFromModel(userId),
      ])
      setFavourites(favs)
      setMyPokedex(dex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favourite Pokémon.')
    } finally {
      setLoading(false)
    }
  }

  const addFavourite = async (pokemon: PokemonListItem) => {
    if (!userId) return
    try {
      await addFavouriteToModel(userId, pokemon)
      setFavourites((prev) => {
        if (prev.some((item) => item.url === pokemon.url)) return prev
        return [...prev, pokemon]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokémon to favourites.')
    }
  }

  const removeFavourite = async (pokemon: PokemonListItem) => {
    if (!userId) return
    try {
      await removeFavouriteFromModel(userId, pokemon)
      setFavourites((prev) => prev.filter((item) => item.url !== pokemon.url))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove Pokémon from favourites.')
    }
  }

  const togglePokedex = async (pokemon: PokemonListItem) => {
    if (!userId) return
    const inDex = myPokedex.some((item) => item.url === pokemon.url)
    try {
      if (inDex) {
        await removePokedexFromModel(userId, pokemon)
        setMyPokedex((prev) => prev.filter((item) => item.url !== pokemon.url))
      } else {
        await addPokedexToModel(userId, pokemon)
        setMyPokedex((prev) => [...prev, pokemon])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update My Pokédex.')
    }
  }

  useEffect(() => {
    loadData()
  }, [userId])

  return {
    favourites,
    myPokedex,
    loading,
    error,
    loadFavourites: loadData,
    addFavourite,
    removeFavourite,
    togglePokedex,
  }
}
