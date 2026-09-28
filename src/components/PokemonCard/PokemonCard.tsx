import { Link, useLocation } from 'react-router-dom'
import type { PokemonListItem } from '../../services/PokeAPIService'

interface PokemonCardProps {
  pokemon: PokemonListItem
  isInPokedex?: boolean
  isFavourite?: boolean
  onFavouriteClick?: (pokemon: PokemonListItem) => void
  onPokedexClick?: (pokemon: PokemonListItem) => void
}

const getPokedexNumber = (url: string) => {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1] || '?'
}

function PokemonCard({
  pokemon,
  isInPokedex = false,
  isFavourite = false,
  onFavouriteClick,
  onPokedexClick,
}: PokemonCardProps) {
  const location = useLocation()
  const pokedexNum = getPokedexNumber(pokemon.url)
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNum}.png`

  return (
    <div
      className="pokemon-item transition-transform hover:-translate-y-1 hover:shadow-lg"
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Favourite star button in top-right corner */}
      <button
        type="button"
        className="favourite-button"
        title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        onClick={() => onFavouriteClick && onFavouriteClick(pokemon)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: '24px',
            color: isFavourite ? '#ffd700' : '#ffffff',
            WebkitTextStroke: '1.5px #000000',
            display: 'inline-block',
          }}
        >
          ★
        </span>
      </button>

      <Link
        to={`/pokemon/${pokedexNum}`}
        state={{ from: location.pathname + location.search }}
        className="block group cursor-pointer"
        title={`View details for ${pokemon.name}`}
      >
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="transition-transform duration-200 group-hover:scale-105"
          style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto', display: 'block' }}
        />
        <h3 className="group-hover:text-amber-600 transition-colors" style={{ textTransform: 'capitalize', margin: '8px 0 4px', fontWeight: 700 }}>
          {pokemon.name}
        </h3>
      </Link>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
        <strong>Pokédex #:</strong> {pokedexNum}
      </p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
        <strong>Gen:</strong> {pokemon.gen}
      </p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
        <strong>Type:</strong> {pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)}
      </p>

      {/* Add / Remove from Pokedex button */}
      <button
        type="button"
        onClick={() => onPokedexClick && onPokedexClick(pokemon)}
        style={{
          marginTop: '12px',
          padding: '6px 14px',
          backgroundColor: isInPokedex ? '#d32f2f' : '#ffffff',
          color: isInPokedex ? '#ffffff' : '#000000',
          border: '2px solid red',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {isInPokedex ? 'Remove from Pokedex' : 'Add to Pokedex'}
      </button>
    </div>
  )
}

export default PokemonCard
