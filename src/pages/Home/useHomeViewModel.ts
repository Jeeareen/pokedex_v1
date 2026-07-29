import { useState, useEffect } from 'react'
import { getPokemon, initialPokemons, type PokemonListItem } from './HomeModel'
import {
  loadFavourites,
  saveFavourite,
  deleteFavourite,
} from '../Favourites/FavouritesModel'
import {
  loadPokedex,
  savePokedex,
  deletePokedex,
} from '../MyPokedex/MyPokedexModel'
import { useAuth } from '../../context/AuthContext'

export function useHomeViewModel() {
  const { user } = useAuth()
  const userId = user?.uid || ''

  const [query, setQuery] = useState('')
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([])
  const [favourites, setFavourites] = useState<PokemonListItem[]>([])
  const [myPokedex, setMyPokedex] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)

  const itemsPerPage = 20
  const TOTAL_POKEMON_COUNT = 1025

  const loadPage = async (page: number) => {
    setLoading(true)
    setError(null)
    try {
      const results = await initialPokemons(page, itemsPerPage)
      setPokemons(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching Pokémon.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLists = async () => {
    if (!userId) {
      setFavourites([])
      setMyPokedex([])
      return
    }
    try {
      const [favs, dex] = await Promise.all([loadFavourites(userId), loadPokedex(userId)])
      setFavourites(favs)
      setMyPokedex(dex)
    } catch (err) {
      console.error('Failed to load user lists in HomeViewModel:', err)
    }
  }

  useEffect(() => {
    fetchUserLists()
  }, [userId])

  useEffect(() => {
    if (!isSearching) {
      loadPage(currentPage)
    }
  }, [currentPage, isSearching])

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    const trimmed = query.trim()
    if (trimmed.length === 0) {
      setIsSearching(false)
      setCurrentPage(1)
      await loadPage(1)
    } else {
      setIsSearching(true)
      setCurrentPage(1)
      try {
        const results = await getPokemon(trimmed)
        setPokemons(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching Pokémon.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleFavourite = async (pokemon: PokemonListItem) => {
    if (!userId) return
    const isFav = favourites.some((item) => item.url === pokemon.url)
    try {
      if (isFav) {
        await deleteFavourite(userId, pokemon)
        setFavourites((prev) => prev.filter((item) => item.url !== pokemon.url))
      } else {
        await saveFavourite(userId, pokemon)
        setFavourites((prev) => [...prev, pokemon])
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err)
    }
  }

  const togglePokedex = async (pokemon: PokemonListItem) => {
    if (!userId) return
    const inDex = myPokedex.some((item) => item.url === pokemon.url)
    try {
      if (inDex) {
        await deletePokedex(userId, pokemon)
        setMyPokedex((prev) => prev.filter((item) => item.url !== pokemon.url))
      } else {
        await savePokedex(userId, pokemon)
        setMyPokedex((prev) => [...prev, pokemon])
      }
    } catch (err) {
      console.error('Failed to toggle pokedex:', err)
    }
  }

  const totalPages = isSearching
    ? Math.max(1, Math.ceil(pokemons.length / itemsPerPage))
    : Math.ceil(TOTAL_POKEMON_COUNT / itemsPerPage)

  const displayedPokemons = isSearching
    ? pokemons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : pokemons

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const resetHome = () => {
    setQuery('')
    setIsSearching(false)
    setCurrentPage(1)
    fetchUserLists()
  }

  return {
    query,
    setQuery,
    pokemons: displayedPokemons,
    favourites,
    myPokedex,
    totalPokemonsCount: isSearching ? pokemons.length : TOTAL_POKEMON_COUNT,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    handleSearch,
    toggleFavourite,
    togglePokedex,
    resetHome,
  }
}
