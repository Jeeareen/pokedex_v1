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

- Found out that the Region and Type data is shown wrong, it shows Kanto and Normal as default, 
  I did update the HomeView.tsx file manually and prompted Gemini with detail to fix the PokeAPIService.ts file. FIXED

- did manually update the HomeView.tsx file to remove the # before the pokedex number and to Capitalize the type string.

- manually removed the AI generated "pokedex" h1 title.

- after creating the initialPokemons() function, the pokedex # were displayed wrong, and the loading took to much time since we fetched data of the first 1025 pokemon. ive decided to fetch data of 20 pokemon per page, which will remove loading. Wrote prompt. FIXED

- saw that the Gen values are shown wrong for some pokemon (ogerpon is not gen 5). Asked AI. did go on with the solution of fetching data from national dex number, since we already did fetch the pokedex #,this would provide 100% precision and max performance (no extra network requests needed). Now everything works great.

-The pokemon card was coded in HomeView.tsx. Prompted AI to extract it from there and create a new component inside src/components. created: PokemonCard.tsx.

- Set up Firebase on chrome and manually filled in Firebase env variables.

- The agent did create a saveFavourite function in FavouritesModel.ts but forgot to include addFavourite function impoorting from FavouritesModel. Hence the pokemon didnt get added to the favourites page / nor database. Saw the issue by reviewing AI generated code, prompted to fix.

- the star button on cards(to add to favourites) still wasnt working. asked AI to fix and explain it to me. 

- After generating the MyPokedex MVVM architecture, ive discovered that when on fav page, the isInPokedex state wasnt shown; and in the pokedex page, the isFavourite state wasnt shown. Prompted to fix. FIXED.

- After generating the Auth page, there wasnt an navigation link to the Authentication page. ive prompted AI to create a nav button in the header, that links to the auth page works, but there are some issues: 
1. when a user wo an account enters an email and password, the system gives error saying "Invalid mail/password". Instead it should give an error message saying No account with this mail was found.
2. when the user creates an account, no confirmation message is shown, and the user stays on the auth page instead of being redirected to the pokedex page. 
3. the user doesnt get redirected to the homepage after a succesfull Login, but stays in the same page. 
4. after a user crteates an account, he/she should automatically login and get redirected to the homepage.
5. when an non logged in user presses on add to favourites / add to pokedex button. a message shuld get displayed in a small box/popup in the middle of the screen saying "Log in to add this pokemon to your favourites / pokedex.".
6. show a message when a non logged in user opens the favourites/ mypokedex page. To ..., you need to login. add a navigation button that links to the login page so the user can login.

- since the add to pokedex button shows the state of isInPokedex, we dont need the red/green indicator on the top left of each card. update PokemonCard.tsx and remove the red/green indicator.

-ive changed the text on the authentication page navigation button to Login manually.

 





