import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeViewModel } from './useHomeViewModel'
import { useAuth } from '../../context/AuthContext'
import PokemonCard from '../../components/PokemonCard/PokemonCard'
import type { PokemonListItem } from '../../services/PokeAPIService'

interface HomeViewProps {
  viewModel?: ReturnType<typeof useHomeViewModel>
}

function HomeView({ viewModel: propViewModel }: HomeViewProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const defaultViewModel = useHomeViewModel()
  const {
    pokemons,
    favourites,
    myPokedex,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    toggleFavourite,
    togglePokedex,
  } = propViewModel || defaultViewModel

  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null)

  const handleFavouriteClick = (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    toggleFavourite(pokemon)
  }

  const handlePokedexClick = (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    togglePokedex(pokemon)
  }

  return (
    <div className="home-view" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1></h1>

      {authModalMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px 32px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              maxWidth: '380px',
              width: '90%',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>Login Required</h3>
            <p style={{ margin: '16px 0', fontSize: '15px', color: '#555' }}>
              {authModalMessage}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setAuthModalMessage(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMessage(null)
                  navigate('/auth')
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#d32f2f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="loading-message">Loading Pokémon...</p>}

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      <div
        className="pokemon-list"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {!loading &&
          pokemons.map((pokemon) => {
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

      {!loading && pokemons.length > 0 && (
        <div
          className="pagination"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default HomeView
