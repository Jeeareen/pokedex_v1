// This file will contain communication logic with the PokeAPI.

// Keep your code clean by declaring the API 
// base URL as a reusable constant inside 
const BASE_URL = 'https://pokeapi.co';

export interface PokemonListItem {
  name: string;
  url: string;
  type: string;
  gen: number;
}

export interface PokeAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export function getPokemonGenFromId(idOrUrl: number | string): number {
  let pokedexNum = 0;
  if (typeof idOrUrl === 'number') {
    pokedexNum = idOrUrl;
  } else {
    const parts = idOrUrl.split('/').filter(Boolean);
    pokedexNum = parseInt(parts[parts.length - 1], 10) || 0;
  }

  if (pokedexNum >= 1 && pokedexNum <= 151) return 1;
  if (pokedexNum >= 152 && pokedexNum <= 251) return 2;
  if (pokedexNum >= 252 && pokedexNum <= 386) return 3;
  if (pokedexNum >= 387 && pokedexNum <= 493) return 4;
  if (pokedexNum >= 494 && pokedexNum <= 649) return 5;
  if (pokedexNum >= 650 && pokedexNum <= 721) return 6;
  if (pokedexNum >= 722 && pokedexNum <= 809) return 7;
  if (pokedexNum >= 810 && pokedexNum <= 905) return 8;
  if (pokedexNum >= 906) return 9;

  return 1;
}

export async function getPokemonList(limit: number = 1025, offset: number = 0): Promise<{ name: string; url: string }[]> {
  const response = await fetch(`${BASE_URL}/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${response.status} ${response.statusText}`);
  }
  const data: PokeAPIResponse = await response.json();
  return data.results;
}

export async function getPokemonDetails(pokemon: { name: string; url: string }): Promise<PokemonListItem> {
  try {
    // Determine direct endpoint if url is a species url
    const fetchUrl = pokemon.url.includes('/pokemon-species/')
      ? pokemon.url.replace('/pokemon-species/', '/pokemon/')
      : pokemon.url;

    const detailRes = await fetch(fetchUrl);
    if (!detailRes.ok) {
      const gen = getPokemonGenFromId(pokemon.url);
      return {
        name: pokemon.name,
        url: pokemon.url,
        type: 'Unknown',
        gen,
      };
    }
    const detailData = await detailRes.json();
    const numericId = detailData.id;
    const typeString = detailData.types
      ? detailData.types.map((t: any) => t.type.name).join(', ')
      : 'Unknown';

    // Standardized numeric Pokemon URL so PokemonCard getPokedexNumber gets the integer ID
    const canonicalUrl = `${BASE_URL}/api/v2/pokemon/${numericId}/`;
    const gen = getPokemonGenFromId(numericId);

    return {
      name: pokemon.name,
      url: canonicalUrl,
      type: typeString,
      gen,
    };
  } catch {
    const gen = getPokemonGenFromId(pokemon.url);
    return {
      name: pokemon.name,
      url: pokemon.url,
      type: 'Unknown',
      gen,
    };
  }
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

  const detailedResults = await Promise.all(
    filteredResults.map((pokemon) => getPokemonDetails(pokemon))
  );

  return detailedResults;
}