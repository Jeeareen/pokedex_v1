import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PokemonCard from '../../components/PokemonCard/PokemonCard'
import { getPokemonDetails } from '../../services/PokeAPIService'
import { FavouritesModel } from '../Favourites/FavouritesModel'
import { MyPokedexModel } from '../MyPokedex/MyPokedexModel'
import type { PokemonListItem } from '../../services/PokeAPIService'

const REGION_GEN_MAP: Record<string, number> = {
  kanto: 1,
  johto: 2,
  hoenn: 3,
  sinnoh: 4,
  unova: 5,
  kalos: 6,
  alola: 7,
  galar: 8,
  hisui: 8,
  paldea: 9,
}

export function CategoryDetailPage() {
  const { categoryType, categoryName } = useParams<{
    categoryType: string
    categoryName: string
  }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pokemons, setPokemons] = useState<PokemonListItem[]>([])
  const [favourites, setFavourites] = useState<PokemonListItem[]>([])
  const [myPokedex, setMyPokedex] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      FavouritesModel.loadFavourites(user.uid).then(setFavourites)
      MyPokedexModel.loadPokedex(user.uid).then(setMyPokedex)
    } else {
      setFavourites([])
      setMyPokedex([])
    }
  }, [user])

  const [rawList, setRawList] = useState<{ name: string; url: string }[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 20

  useEffect(() => {
    if (!categoryType || !categoryName) return

    setLoading(true)
    setError(null)
    setCurrentPage(1)

    const fetchCategoryList = async () => {
      try {
        let list: { name: string; url: string }[] = []

        if (categoryType === 'type') {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${categoryName.toLowerCase()}`)
          if (!res.ok) throw new Error('Failed to fetch type data')
          const data = await res.json()
          list = data.pokemon.map((p: any) => p.pokemon)
        } else if (categoryType === 'region') {
          const genId = REGION_GEN_MAP[categoryName.toLowerCase()] || 1
          const res = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`)
          if (!res.ok) throw new Error('Failed to fetch region data')
          const data = await res.json()
          list = data.pokemon_species.map((p: any) => {
            const parts = p.url.split('/').filter(Boolean)
            const id = parts[parts.length - 1]
            return {
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
            }
          })
        } else if (categoryType === 'habitat') {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${categoryName.toLowerCase()}`)
          if (!res.ok) throw new Error('Failed to fetch habitat data')
          const data = await res.json()
          list = data.pokemon_species.map((p: any) => {
            const parts = p.url.split('/').filter(Boolean)
            const id = parts[parts.length - 1]
            return {
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
            }
          })
        } else if (categoryType === 'color') {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon-color/${categoryName.toLowerCase()}`)
          if (!res.ok) throw new Error('Failed to fetch color data')
          const data = await res.json()
          list = data.pokemon_species.map((p: any) => {
            const parts = p.url.split('/').filter(Boolean)
            const id = parts[parts.length - 1]
            return {
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
            }
          })
        } else if (categoryType === 'shape') {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon-shape/${categoryName.toLowerCase()}`)
          if (!res.ok) throw new Error('Failed to fetch shape data')
          const data = await res.json()
          list = data.pokemon_species.map((p: any) => {
            const parts = p.url.split('/').filter(Boolean)
            const id = parts[parts.length - 1]
            return {
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
            }
          })
        }

        // Sort Pokémon list by National Dex ID in ascending numerical order
        list.sort((a, b) => {
          const idA = parseInt(a.url.split('/').filter(Boolean).pop() || '0', 10)
          const idB = parseInt(b.url.split('/').filter(Boolean).pop() || '0', 10)
          return idA - idB
        })

        setRawList(list)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading.')
        setLoading(false)
      }
    }

    fetchCategoryList()
  }, [categoryType, categoryName])

  // Fetch details dynamically ONLY for the 20 items on the active page
  useEffect(() => {
    if (rawList.length === 0) return

    setLoading(true)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentBatch = rawList.slice(startIndex, startIndex + itemsPerPage)

    Promise.all(currentBatch.map((item) => getPokemonDetails(item)))
      .then((detailed) => {
        setPokemons(detailed)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch page details.'))
      .finally(() => setLoading(false))
  }, [rawList, currentPage])
  const handleFavouriteClick = async (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    const isFav = favourites.some((f) => f.url === pokemon.url)
    if (isFav) {
      await FavouritesModel.deleteFavourite(user.uid, pokemon.url)
      setFavourites((prev) => prev.filter((f) => f.url !== pokemon.url))
    } else {
      await FavouritesModel.saveFavourite(user.uid, pokemon)
      setFavourites((prev) => [...prev, pokemon])
    }
  }

  const handlePokedexClick = async (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    const inDex = myPokedex.some((d) => d.url === pokemon.url)
    if (inDex) {
      await MyPokedexModel.deletePokedex(user.uid, pokemon.url)
      setMyPokedex((prev) => prev.filter((d) => d.url !== pokemon.url))
    } else {
      await MyPokedexModel.savePokedex(user.uid, pokemon)
      setMyPokedex((prev) => [...prev, pokemon])
    }
  }

  const totalPages = Math.ceil(rawList.length / itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/categories')}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-black text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 border border-slate-800"
        >
          ← Back to Categories
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
          {categoryType}: {categoryName}
        </h1>
      </div>

      {authModalMessage && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-[90%] text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Login Required</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{authModalMessage}</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setAuthModalMessage(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMessage(null)
                  navigate('/auth')
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-slate-500 animate-pulse text-center py-12">Loading Pokémon...</p>}

      {error && <p className="text-red-500 text-center py-8">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {pokemons.map((pokemon) => {
              const isFav = favourites.some((f) => f.url === pokemon.url)
              const inDex = myPokedex.some((d) => d.url === pokemon.url)
              return (
                <PokemonCard
                  key={pokemon.name}
                  pokemon={pokemon}
                  isFavourite={isFav}
                  isInPokedex={inDex}
                  onFavouriteClick={handleFavouriteClick}
                  onPokedexClick={handlePokedexClick}
                />
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-28 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-300 text-black text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:enabled:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-28 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-300 text-black text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:enabled:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CategoryDetailPage
