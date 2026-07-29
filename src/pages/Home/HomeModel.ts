import {
  searchPokemon,
  getPokemonList,
  getPokemonDetails,
  type PokemonListItem,
} from '../../services/PokeAPIService';

export type { PokemonListItem };

export class HomeModel {
  static async getPokemon(query: string): Promise<PokemonListItem[]> {
    return getPokemon(query);
  }

  static async initialPokemons(page: number = 1, limit: number = 20): Promise<PokemonListItem[]> {
    return initialPokemons(page, limit);
  }
}

export async function getPokemon(query: string): Promise<PokemonListItem[]> {
  const cleanedQuery = query.trim();

  if (cleanedQuery.length < 2) {
    return [];
  }

  return await searchPokemon(cleanedQuery);
}

export async function initialPokemons(page: number = 1, limit: number = 20): Promise<PokemonListItem[]> {
  const totalPokemons = 1025;
  const offset = (page - 1) * limit;

  if (offset >= totalPokemons) {
    return [];
  }

  const currentLimit = Math.min(limit, totalPokemons - offset);

  // Fetch only the pokemon list items for the requested page (e.g. 20 items)
  const pokemonList = await getPokemonList(currentLimit, offset);

  const getPokedexNumber = (url: string) => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  };

  // Remove duplicate pokemon using pokedex #
  const uniquePokemons: { name: string; url: string }[] = [];
  const seenPokedexNums = new Set<string>();

  for (const pokemon of pokemonList) {
    const num = getPokedexNumber(pokemon.url);
    if (num && !seenPokedexNums.has(num)) {
      seenPokedexNums.add(num);
      uniquePokemons.push(pokemon);
    }
  }

  // Fetch details ONLY for the 20 pokemon to be displayed on this page in parallel with Promise.all
  const detailedPokemons = await Promise.all(
    uniquePokemons.map((pokemon) => getPokemonDetails(pokemon))
  );

  return detailedPokemons;
}
