import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'
import MyPokedexView from './pages/MyPokedex/MyPokedexView'
import AuthView from './pages/Auth/AuthView'
import CategoriesPage from './pages/Categories/CategoriesPage'
import CategoryDetailPage from './pages/Categories/CategoryDetailPage'
import { useHomeViewModel } from './pages/Home/useHomeViewModel'

function App() {
  const homeViewModel = useHomeViewModel()

  return (
    <BrowserRouter>
      <Header
        query={homeViewModel.query}
        setQuery={homeViewModel.setQuery}
        onSearch={homeViewModel.handleSearch}
        onHomeClick={homeViewModel.resetHome}
      />
      <Routes>
        <Route path="/" element={<HomeView viewModel={homeViewModel} />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:categoryType/:categoryName" element={<CategoryDetailPage />} />
        <Route path="/my-pokedex" element={<MyPokedexView />} />
        <Route path="/favourites" element={<FavouritesView />} />
        <Route path="/auth" element={<AuthView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
