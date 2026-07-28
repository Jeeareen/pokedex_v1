import { searchPokemon, type PokemonListItem } from '../../services/PokeAPIService';

export type { PokemonListItem };

export class HomeModel {
  static async getPokemon(query: string): Promise<PokemonListItem[]> {
    return getPokemon(query);
  }
}

export async function getPokemon(query: string): Promise<PokemonListItem[]> {
  const cleanedQuery = query.trim();

  if (cleanedQuery.length < 2) {
    return [];
  }

  return await searchPokemon(cleanedQuery);
}
