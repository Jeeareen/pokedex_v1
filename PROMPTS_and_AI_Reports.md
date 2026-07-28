Ive used Composer 2.5 Fast model in Cursor.

Prompt 1: 
Initialize a new React application using Vite, React, and TypeScript.

Use functional components only.

Do not install any UI library.

Do not add any movie functionality yet.

-React app init went good, got it in single run and had basic text showing on website.

Prompt 2:
Remove all default Vite content, images, styles, and demonstration code.

Leave a minimal working React application with an empty App component.

Do not create any additional components or functionality.

- Removed everything from the UI, leaving with blank page. Good job.

Prompt 3:
Create a reusable Header component.

The Header should contain:

- a Home navigation link
- a Favourites navigation link (resembled by a star)
- a categories navigation link
- a search input (Pokemon name)
- a Search button 


Use React Router links for navigation.

Only create and display the Header.

Do not create the Home, Categories or Favourites screens yet.

Do not connect the search input to any functionality.

Please add styling to the header with bright blue, red, yellow colors. 

- didnt like the styling, so i wrote a prompt to change it

Prompt 4:
Change the style of the header:

- the active nav link should highlight in a white tint (50% opacity).
- the text on the navigation buttons should be black when they are active. 
- remove the red stripe on the bottom of the header. just the yellow stripe should remain.
- the yellow star should remain yellow when the favourites nav button is active or passive.

apply these changes to the header. dont change anything else.

- asked for another iteration to change some other style decisions.

Prompt 5:
- change the nav button shapes to rectangles with rounded edges, just like the search button.
- also the active button should have yellow edges instead of red ones.
- decrease the thickness of the yellow stripe on the bottom of the head to half of its current thickness.

apply these 3 changes. dont alter anything else.

- asked for another iteration to change some other style decisions.

Prompt 6:

remvoe the space between search input field and search buitton. also decrease the search buttons width to 70% of its current size. the combined searchbar's right edge should allign to the current  search button's right edge.

- now im feeling alright with this design.

Prompt 7:

Create the empty MVVM file structure for the Home screen.

Create:

src/pages/Home/HomeModel.ts
src/pages/Home/useHomeViewModel.ts
src/pages/Home/HomeView.tsx

Requirements:

- HomeModel.ts will later contain Home-specific data and business logic.
- useHomeViewModel.ts will later contain React state and actions.
- HomeView.tsx will later render the Home interface.

Create only minimal placeholder exports so the application can compile.

Do not add API requests, React state, or UI.

- AI did create the file structure wo any issues.


I DID SWITCH TO ANTIGRAVITY WITH GEMINI 3.6 FLASH (LOW) SINCE I'VE REACHED MY LIMIT ON CURSOR.

Prompt 8: 

I am experiencing FOUT (Flash of Unstyled Text) where the website briefly shows a fallback font before quickly switching to 'Saira Semi Condensed'. 

Please review my codebase to find how 'Saira Semi Condensed' is currently being imported. Once you locate it, refactor the code to optimize the font loading and eliminate this layout shift. 

Depending on my current setup, please apply the best fix:
1. If it's using HTML <link> tags in index.html, add the appropriate 'rel="preload"' tags with high priority.
2. If it's using a manual CSS @import or @font-face, ensure 'font-display: swap;' is explicitly set and configure a closer matching fallback font like 'Arial Narrow'.
3. If applicable, suggest switching to self-hosting via the '@fontsource/saira-semi-condensed' npm package if that provides a better performance boost for our setup.

Please show me the modified files and explain the changes you made.

- Went with an alternative method: Refactored font loading to self-host 'Saira Semi Condensed' via @fontsource/saira-semi-condensed and added 'Arial Narrow' as a metric-compatible fallback. This eliminates external Google Fonts requests and prevents Flash of Unstyled Text (FOUT) and layout shifts.

- decided to return to the old method consisting of:
|-High Priority Font Preloading in index.html
|-Closer Matching Fallback Font in src/index.css

Prompt 9: 

Create the empty MVVM file structure for the Favourites page.

Create:

src/pages/Favourites/FavouritesModel.ts

src/pages/Favourites/useFavouritesViewModel.ts

src/pages/Favourites/FavouritesView.tsx


Create only minimal placeholder exports so the application can compile.

Do not add Firebase, state, cards, or other functionality.

- no issues, great job

Prompt 10:

Create a services folder and an empty PokeAPI service file:

src/services/PokeAPIService.ts

Add a short comment explaining that this file will contain communication with the PokeAPI.

Do not implement the API request yet.

Prompt 11:

Please update my existing file at `src/services/PokeAPIService.ts`. 

Keep the existing comment and base URL constant, and add the following TypeScript interfaces directly below them so I can get autocomplete benefits:

1. PokemonListItem: An object containing 'name' (string) and 'url' (string).

2. PokeAPIResponse: An object containing 'count' (number), 'next' (string or null), 'previous' (string or null), and 'results' (an array of PokemonListItem).

Do not implement any API fetching functions or network requests yet. Just add these interfaces.

- Reason behind: They act as a contract and a map that tells your code editor exactly what data comes back from the PokeAPI.
PokemonListItem : This defines the structure of a single Pokémon inside the list.
PokeAPIResponse: This defines the structure of the entire package of data that the PokeAPI sends back when you ask for a list.
count: The total number of all Pokémon available in the entire database (usually over 1000).
next: The web link to load the next page of Pokémon (or null if you are on the last page).
previous: The web link to load the previous page of Pokémon (or null if you are on the first page).
results: A list (array) filled with individual PokemonListItem objects (by default, the first 20 Pokémon).

Prompt 12:
Implement the PokeAPI search request inside:

src/services/PokeAPIService.ts

Create an exported async function:

searchPokemon(name: string): Promise<PokemonListItem[]>

Requirements:

- use the PokeAPI endpoint to filter or find the pokemon
- lowercase the incoming name string before searching
- use the PokemonListItem and PokeAPIResponse types
- filter the results array to only include pokemon whose names contain the search string
- throw a readable error when the HTTP request fails

For the API_URL use https://pokeapi.co

Do not use React hooks.
Do not use useEffect.
Do not manage loading, error, or component state.

Prompt 13:
Add console logs just to double check if it works
- to check whether the search request does anything or not.

Prompt 14:
when i type in a pokemon name and press on the search button, nothing changes in the inspect -> console page of the browser.
- Now when i search for a pokemon, the console shows some results.

Prompt 15:
Implement the Home model inside:

src/pages/Home/HomeModel.ts

Import searchPokemon from PokeAPIService.

Create and export:

getPokemon(query: string): Promise<Pokemon[]>

Responsibilities:

- trim the query
- validate that the query contains at least two characters
- call searchPokemon with the cleaned query
- return the pokemon list

Do not use React hooks.
Do not use useState or useEffect.
Do not call fetch directly.

Prompt 16:

Implement a custom hook inside:

src/pages/Home/useHomeViewModel.ts

Create and export:

useHomeViewModel()

Manage these properties using useState:

- query
- pokemons
- loading
- error

Create a function:

handleSearch()

The function should:

- set loading to true
- clear the previous error
- call getPokemon from HomeModel using the current query
- save the returned pokemon list in pokemons state
- store a readable error if the request fails
- set loading to false when finished

Return:

- query
- setQuery
- pokemons
- loading
- error
- handleSearch

Do not render JSX.
Do not call fetch directly.
Do not import PokeAPIService directly.

Prompt 17: 

Implement the Home view inside:

src/pages/Home/HomeView.tsx

Requirements:

- import and use useHomeViewModel
- display the current search input
- connect the input value to query
- update query using setQuery
- call handleSearch when the Search button is clicked
- also allow searching by submitting the form
- display a loading message while loading is true
- display the error message when error exists
- render the pokemon list using .map()
- display the pokemon name, Pokedex Number, region, type, and image

Do not call fetch directly.
Do not import HomeModel or PokeAPIService.
Do not implement favourites yet.
Do not create a reusable PokemonCard component yet.

- IMPORTANT: After letting AI process this prompt, i got a blank screen. my header is gone. now ill ask AI what happened and to fix it.

Prompt 18:
now, when i launch the application, i get a blank screen, and my header doesnt show up. just look at what happened and explain, dont to anything before i say u to do.

-AI's response:
Vite failed to bundle and load the JavaScript modules due to a runtime module export error.

Because this module loading error occurs when the browser attempts to evaluate the JavaScript files, the entire React application fails to execute, preventing <Header /> and the rest of the page from mounting.

Technical Details
In TypeScript, PokemonListItem is defined as an interface. TypeScript interfaces exist only during development and are completely erased when compiled to JavaScript.
When imported as a standard value (import { PokemonListItem }), Vite's JavaScript bundler looks for an actual runtime JavaScript object/value named PokemonListItem. Because it was erased during compilation, Vite throws a runtime import error and stops script execution.

Prompt 19: Fix this issue.
- Now the blank page issue is gone, but i have 2 search bars & searching from the search bar on the header doesnt show the pokemon according to the input. 

Prompt 20: we dont need a second search input because we have it already in the header. the search bar in the header doesnt work. take all the functionality of the working search bar and add these to the one on the header, and completely remove the newly added searchbar. Dont do anything else.
- Done well.

