- I didnt like the AI generated header Style, so wrote explicit prompts to change the current header to what i would have liked.

- I did recognize a problem: after i've prompted Cursor to change the font to Saira Semi Condensed, when i reload the webpage, a default font gets displayed for a few microseconds before the wanted Saira Semi Condensed is shown. So i did write a prompt to fix this issue.

- Refactored font loading to self-host 'Saira Semi Condensed' via @fontsource/saira-semi-condensed and added 'Arial Narrow' as a metric-compatible fallback. This eliminates external Google Fonts requests and prevents Flash of Unstyled Text (FOUT) and layout shifts.

- After experiencing with self-hsot method, ive decided to keep the old fix since self-host method wasnt working that seamless.

- To connect the PokeAPI, i've choosen native fetch
- I declared the API Base URL as a reusable constant inside the src/services/PokeAPIService.ts file.

- Ive asked AI to add console logs so i can double check if the search request works. It did but we had another issue,i needed to debug, wrote a prompt. FIXED

- IMPORTANT: After letting AI Implement the HomeView.tsx file, i got a blank screen. my header is gone. now ill ask AI what happened and to fix it. 
    Reason was: Vite failed to bundle and load the JavaScript modules due to a runtime module export error.

    Because this module loading error occurs when the browser attempts to evaluate the JavaScript files, the entire React application fails to execute, preventing <Header /> and the rest of the page from mounting.

    Technical Details
    In TypeScript, PokemonListItem is defined as an interface. TypeScript interfaces exist only during development and are completely erased when compiled to JavaScript.
    When imported as a standard value (import { PokemonListItem }), Vite's JavaScript bundler looks for an actual runtime JavaScript object/value named PokemonListItem. Because it was erased during compilation, Vite throws a runtime import error and stops script execution.

    Prompted AI to fix it and problem got fixed.

- After fixing the blank page issue, there are 2 search bars & searching from the search bar on the header doesnt show the pokemon according to the input. FIXED

- Since its late, i did commit and push it to my gitHub repo.





