import { useHomeViewModel } from './useHomeViewModel'

interface HomeViewProps {
  viewModel?: ReturnType<typeof useHomeViewModel>
}

function HomeView({ viewModel: propViewModel }: HomeViewProps) {
  const defaultViewModel = useHomeViewModel()
  const { pokemons, loading, error } = propViewModel || defaultViewModel

  const getPokedexNumber = (url: string) => {
    const parts = url.split('/').filter(Boolean)
    return parts[parts.length - 1] || '?'
  }

  return (
    <div className="home-view" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Pokédex</h1>

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
            const pokedexNum = getPokedexNumber(pokemon.url)
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNum}.png`

            return (
              <div
                key={pokemon.name}
                className="pokemon-item"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
                <h3 style={{ textTransform: 'capitalize', margin: '8px 0 4px' }}>
                  {pokemon.name}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Pokédex #:</strong> #{pokedexNum}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Region:</strong> Kanto
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Type:</strong> Normal
                </p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default HomeView
