import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'
import MyPokedexView from './pages/MyPokedex/MyPokedexView'
import AuthView from './pages/Auth/AuthView'
import CategoriesPage from './pages/Categories/CategoriesPage'
import CategoryDetailPage from './pages/Categories/CategoryDetailPage'
import PokemonDetail from './pages/PokemonDetail'
import { useHomeViewModel } from './pages/Home/useHomeViewModel'
import { MotionProvider } from './context/MotionContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    const prevPathname = prevPathnameRef.current

    // Don't auto scroll up if we're switching between pokemon detail pages (/pokemon/1 -> /pokemon/2)
    const isDetailToDetail =
      prevPathname?.startsWith('/pokemon/') && pathname.startsWith('/pokemon/')

    if (!isDetailToDetail) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    prevPathnameRef.current = pathname
  }, [pathname])

  return null
}

function App() {
  const homeViewModel = useHomeViewModel()

  return (
    <MotionProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header
          query={homeViewModel.query}
          setQuery={homeViewModel.setQuery}
          onSearch={homeViewModel.handleSearch}
          onHomeClick={homeViewModel.resetHome}
        />
        <Routes>
          <Route path="/" element={<HomeView viewModel={homeViewModel} />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryType/:categoryName" element={<CategoryDetailPage />} />
          <Route path="/my-pokedex" element={<MyPokedexView />} />
          <Route path="/favourites" element={<FavouritesView />} />
          <Route path="/auth" element={<AuthView />} />
        </Routes>
      </BrowserRouter>
    </MotionProvider>
  )
}

export default App
