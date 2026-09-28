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

export interface PokemonDetailData {
  id: number;
  name: string;
  types: string[];
  height: number; // in decimeters
  weight: number; // in hectograms
  speciesTitle: string;
  flavorText: string;
  cryUrl: string | null;
  spriteUrl: string;
  gen: number;
}

export async function fetchPokemonDetailById(idOrName: string | number): Promise<PokemonDetailData> {
  const cleanId = String(idOrName).toLowerCase().trim();
  const pokemonRes = await fetch(`${BASE_URL}/api/v2/pokemon/${cleanId}`);
  if (!pokemonRes.ok) {
    throw new Error(`Pokemon not found: ${cleanId}`);
  }
  const pokeData = await pokemonRes.json();

  const id = pokeData.id;
  const name = pokeData.name;
  const types = pokeData.types ? pokeData.types.map((t: any) => t.type.name) : [];
  const height = pokeData.height;
  const weight = pokeData.weight;
  const cryUrl = pokeData.cries?.latest || pokeData.cries?.legacy || null;
  const spriteUrl =
    pokeData.sprites?.other?.['official-artwork']?.front_default ||
    pokeData.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const gen = getPokemonGenFromId(id);

  let speciesTitle = 'Pokémon';
  let flavorText = 'No Pokédex entry available.';

  if (pokeData.species?.url) {
    try {
      const speciesRes = await fetch(pokeData.species.url);
      if (speciesRes.ok) {
        const speciesData = await speciesRes.json();

        // Find English genus / species title (e.g. "The Mouse Pokémon" or "Mouse Pokémon")
        const englishGenus = speciesData.genera?.find(
          (g: any) => g.language.name === 'en'
        );
        if (englishGenus?.genus) {
          speciesTitle = englishGenus.genus.startsWith('The ')
            ? englishGenus.genus
            : `The ${englishGenus.genus}`;
        }

        // Find English flavor text entry (prefer latest game release entries)
        const englishEntries = speciesData.flavor_text_entries?.filter(
          (entry: any) => entry.language.name === 'en'
        );
        if (englishEntries && englishEntries.length > 0) {
          const lastEntry = englishEntries[englishEntries.length - 1];
          flavorText = lastEntry.flavor_text
            .replace(/[\n\f]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
    } catch {
      // Gracefully fall back to defaults
    }
  }

  return {
    id,
    name,
    types,
    height,
    weight,
    speciesTitle,
    flavorText,
    cryUrl,
    spriteUrl,
    gen,
  };
}