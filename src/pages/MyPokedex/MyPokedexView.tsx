import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyPokedexViewModel } from './useMyPokedexViewModel'
import { useAuth } from '../../context/AuthContext'
import PokemonCard from '../../components/PokemonCard/PokemonCard'
import type { PokemonListItem } from '../../services/PokeAPIService'

interface MyPokedexViewProps {
  viewModel?: ReturnType<typeof useMyPokedexViewModel>
}

function MyPokedexView({ viewModel: propViewModel }: MyPokedexViewProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const defaultViewModel = useMyPokedexViewModel()
  const {
    pokedex,
    favourites,
    loading,
    error,
    removeFromPokedex,
    toggleFavourite,
  } = propViewModel || defaultViewModel

  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null)

  if (!user) {
    return (
      <div
        className="my-pokedex-view"
        style={{
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '40px auto',
          textAlign: 'center',
        }}
      >
        <h1>My Pokédex</h1>
        <p style={{ fontSize: '16px', color: '#555', margin: '24px 0' }}>
          To add Pokémon to your Pokédex, you need to login.
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#d32f2f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Go to Login Page
        </button>
      </div>
    )
  }

  const handlePokedexClick = (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    removeFromPokedex(pokemon)
  }

  const handleFavouriteClick = (pokemon: PokemonListItem) => {
    if (!user) {
      setAuthModalMessage('Log in to add this pokemon to your favourites / pokedex.')
      return
    }
    toggleFavourite(pokemon)
  }

  return (
    <div className="my-pokedex-view" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Pokédex</h1>

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

      {loading && <p className="loading-message">Loading My Pokédex...</p>}

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && pokedex.length === 0 && (
        <p className="empty-message" style={{ textAlign: 'center', margin: '32px 0', color: '#666' }}>
          Your Pokédex is empty! Explore Pokémon on the home page and click "Add to Pokedex" to add them.
        </p>
      )}

      <div
        className="pokemon-list"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {!loading &&
          pokedex.map((pokemon) => {
            const isFav = favourites.some((f) => f.url === pokemon.url)
            return (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                isInPokedex={true}
                isFavourite={isFav}
                onPokedexClick={handlePokedexClick}
                onFavouriteClick={handleFavouriteClick}
              />
            )
          })}
      </div>
    </div>
  )
}

export default MyPokedexView
