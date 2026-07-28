import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'
import { useHomeViewModel } from './pages/Home/useHomeViewModel'

function App() {
  const homeViewModel = useHomeViewModel()

  return (
    <BrowserRouter>
      <Header
        query={homeViewModel.query}
        setQuery={homeViewModel.setQuery}
        onSearch={homeViewModel.handleSearch}
      />
      <Routes>
        <Route path="/" element={<HomeView viewModel={homeViewModel} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
