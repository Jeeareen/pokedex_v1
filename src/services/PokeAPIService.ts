// This file will contain communication logic with the PokeAPI.

// Keep your code clean by declaring the API 
// base URL as a reusable constant inside 
const BASE_URL = 'https://pokeapi.co';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokeAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export async function searchPokemon(name: string): Promise<PokemonListItem[]> {
  const searchString = name.toLowerCase().trim();
  console.log(`[searchPokemon] Searching for: "${searchString}"`);

  const response = await fetch(`${BASE_URL}/api/v2/pokemon?limit=10000`);

  if (!response.ok) {
    console.error(`[searchPokemon] Request failed with status: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch Pokémon list: ${response.status} ${response.statusText}`);
  }

  const data: PokeAPIResponse = await response.json();
  console.log(`[searchPokemon] Fetched ${data.results.length} total Pokémon from API.`);

  const filteredResults = data.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchString)
  );

  console.log(`[searchPokemon] Found ${filteredResults.length} matching Pokémon:`, filteredResults);

  return filteredResults;
}