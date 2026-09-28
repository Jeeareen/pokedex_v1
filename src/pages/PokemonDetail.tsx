import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import PokemonViewer from '../components/PokemonViewer'
import {
  fetchPokemonDetailById,
  type PokemonDetailData,
  type PokemonListItem,
} from '../services/PokeAPIService'
import { POKEMON_TYPE_COLORS } from '../utils/constants'
import { useAuth } from '../context/AuthContext'
import {
  addFavourite,
  removeFavourite,
  getFavourites,
  addToPokedex,
  removeFromPokedex,
  getPokedex,
} from '../services/firebaseService'

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Track the origin page (Home, Categories, MyPokédex, Favourites, etc.)
  const [returnPath] = useState<string>(() => {
    const stateFrom = (location.state as { from?: string } | null)?.from
    if (stateFrom && !stateFrom.startsWith('/pokemon/')) {
      sessionStorage.setItem('pokemon_detail_origin', stateFrom)
      return stateFrom
    }
    const saved = sessionStorage.getItem('pokemon_detail_origin')
    if (saved && !saved.startsWith('/pokemon/')) {
      return saved
    }
    return '/'
  })

  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Firebase integration: favourites & pokedex
  const [isFavourite, setIsFavourite] = useState<boolean>(false)
  const [isInPokedex, setIsInPokedex] = useState<boolean>(false)
  const [fbActionLoading, setFbActionLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true })
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    fetchPokemonDetailById(id)
      .then((data) => {
        if (!isMounted) return
        setPokemon(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load pokemon detail:', err)
        setError('Could not find Pokémon details. Please check the ID or try again.')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, navigate])

  // Sync Firebase favourite and pokedex state
  useEffect(() => {
    if (!user || !pokemon) {
      setIsFavourite(false)
      setIsInPokedex(false)
      return
    }

    let isMounted = true

    Promise.all([getFavourites(user.uid), getPokedex(user.uid)])
      .then(([favs, dex]) => {
        if (!isMounted) return
        const favFound = favs.some((f) => {
          const num = f.url?.split('/').filter(Boolean).pop()
          return num === String(pokemon.id) || f.name.toLowerCase() === pokemon.name.toLowerCase()
        })
        const dexFound = dex.some((p) => {
          const num = p.url?.split('/').filter(Boolean).pop()
          return num === String(pokemon.id) || p.name.toLowerCase() === pokemon.name.toLowerCase()
        })
        setIsFavourite(favFound)
        setIsInPokedex(dexFound)
      })
      .catch((err) => {
        console.warn('Error fetching user pokemon lists from Firebase:', err)
      })

    return () => {
      isMounted = false
    }
  }, [user, pokemon])

  const handleToggleFavourite = async () => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (!pokemon || fbActionLoading) return

    setFbActionLoading(true)
    const pokeItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
      type: pokemon.types[0] || 'normal',
      gen: pokemon.gen,
    }

    try {
      if (isFavourite) {
        await removeFavourite(user.uid, String(pokemon.id))
        setIsFavourite(false)
      } else {
        await addFavourite(user.uid, pokeItem)
        setIsFavourite(true)
      }
    } catch (err) {
      console.error('Firebase favourite error:', err)
    } finally {
      setFbActionLoading(false)
    }
  }

  const handleTogglePokedex = async () => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (!pokemon || fbActionLoading) return

    setFbActionLoading(true)
    const pokeItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
      type: pokemon.types[0] || 'normal',
      gen: pokemon.gen,
    }

    try {
      if (isInPokedex) {
        await removeFromPokedex(user.uid, String(pokemon.id))
        setIsInPokedex(false)
      } else {
        await addToPokedex(user.uid, pokeItem)
        setIsInPokedex(true)
      }
    } catch (err) {
      console.error('Firebase Pokédex error:', err)
    } finally {
      setFbActionLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
        <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-lg">Accessing Pokédex database...</p>
      </div>
    )
  }

  // Error / Invalid ID state
  if (error || !pokemon) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 border border-red-300 flex items-center justify-center mb-4 text-red-500 text-3xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pokémon Not Found</h2>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          {error || "We couldn't retrieve the Pokémon you were looking for."}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-sm font-medium"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Conversions
  const heightMeters = (pokemon.height / 10).toFixed(1)
  const heightFeet = (pokemon.height * 0.328084).toFixed(1)
  const weightKg = (pokemon.weight / 10).toFixed(1)
  const weightLbs = (pokemon.weight * 0.220462).toFixed(1)

  const primaryType = pokemon.types[0]?.toLowerCase() || 'normal'
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || POKEMON_TYPE_COLORS.normal

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb / Top Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-sm font-semibold cursor-pointer select-none active:scale-95"
            title="Go back to previous page"
          >
            <span className="text-lg leading-none">←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Main Content Layout: 60% Left (3D Viewer) / 40% Right (Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60% on desktop: 7 of 12 cols or 60/40) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* 3D Model Viewer flanked by Prev and Next buttons */}
            <div className="relative flex items-center w-full">
              {/* Previous Pokémon Button (Left) */}
              {pokemon.id > 1 ? (
                <Link
                  to={`/pokemon/${pokemon.id - 1}`}
                  state={{ from: returnPath }}
                  className="absolute left-2 sm:left-3 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 group"
                  title={`Previous Pokémon (#${String(pokemon.id - 1).padStart(3, '0')})`}
                  aria-label="Previous Pokémon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : null}

              {/* 3D Model Viewer */}
              <div className="w-full">
                <PokemonViewer
                  id={pokemon.id}
                  name={pokemon.name}
                  fallbackImage={pokemon.spriteUrl}
                  cryUrl={pokemon.cryUrl}
                />
              </div>

              {/* Next Pokémon Button (Right) */}
              <Link
                to={`/pokemon/${pokemon.id + 1}`}
                state={{ from: returnPath }}
                className="absolute right-2 sm:right-3 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 group"
                title={`Next Pokémon (#${String(pokemon.id + 1).padStart(3, '0')})`}
                aria-label="Next Pokémon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column (40% on desktop: 5 of 12 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header / Identity Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Subtle background tint based on primary type */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ backgroundColor: primaryColor.hex }}
              />

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono font-bold text-red-600 tracking-wider">
                  #{String(pokemon.id).padStart(4, '0')}
                </span>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  Gen {pokemon.gen}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 capitalize tracking-tight">
                {pokemon.name}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1 italic">
                {pokemon.speciesTitle}
              </p>

              {/* Types badge list */}
              <div className="flex flex-wrap gap-2 mt-4">
                {pokemon.types.map((type) => {
                  const typeInfo = POKEMON_TYPE_COLORS[type.toLowerCase()]
                  return (
                    <span
                      key={type}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                      style={{
                        backgroundColor: typeInfo ? typeInfo.hex : '#718096',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                      {type}
                    </span>
                  )
                })}
              </div>

              {/* Action Buttons: Favourite & Pokédex */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                {/* Favourite button */}
                <button
                  type="button"
                  onClick={handleToggleFavourite}
                  disabled={fbActionLoading}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition border select-none active:scale-95 cursor-pointer ${
                    isFavourite
                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                >
                  <span className={`text-base leading-none ${isFavourite ? 'text-amber-500' : 'text-slate-400'}`}>
                    ★
                  </span>
                  <span>{isFavourite ? 'In Favourites' : 'Add to Favourites'}</span>
                </button>

                {/* Pokédex caught button */}
                <button
                  type="button"
                  onClick={handleTogglePokedex}
                  disabled={fbActionLoading}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition border select-none active:scale-95 cursor-pointer ${
                    isInPokedex
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm'
                  }`}
                  title={isInPokedex ? 'Remove from My Pokédex' : 'Add to My Pokédex'}
                >
                  <span>{isInPokedex ? '✓ In My Pokédex' : '+ Add to Pokédex'}</span>
                </button>
              </div>
            </div>

            {/* Pokédex Lore / Flavor Text Panel */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Pokédex Lore Entry
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-sans bg-slate-50 p-4 rounded-2xl border border-slate-200/80 italic">
                "{pokemon.flavorText}"
              </p>
            </div>

            {/* Vital Statistics: Height, Weight, General specs */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Physical Characteristics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Height */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium mb-1">Height</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    {heightMeters} <span className="text-xs font-normal text-slate-500">m</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ({heightFeet} ft)
                  </div>
                </div>

                {/* Weight */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium mb-1">Weight</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    {weightKg} <span className="text-xs font-normal text-slate-500">kg</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ({weightLbs} lbs)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
