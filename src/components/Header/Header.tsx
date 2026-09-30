import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Star, Search } from 'lucide-react'
import SettingsMenu from '../SettingsMenu/SettingsMenu'
import './Header.css'

interface HeaderProps {
  query?: string
  setQuery?: (query: string) => void
  onSearch?: () => void
  onHomeClick?: () => void
}

const PokeballIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="12" r="1.5" fill="white" />
  </svg>
)

function Header({ query = '', setQuery, onSearch, onHomeClick }: HeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch()
    }
  }

  return (
    <>
      <header className="header">
        {/* Desktop Navigation Links */}
        <nav className="header__nav header__nav--desktop" aria-label="Desktop navigation">
          <NavLink to="/" className="header__link" end onClick={onHomeClick}>
            <Home className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/categories" className="header__link">
            <LayoutGrid className="w-4 h-4" />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/my-pokedex" className="header__link">
            <PokeballIcon className="w-4 h-4" />
            <span>My Pokedex</span>
          </NavLink>
          <NavLink to="/favourites" className="header__link">
            <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
            <span>Favourites</span>
          </NavLink>
        </nav>

        {/* Top Right Controls (Search & Settings) */}
        <div className="header__right">
          <form className="header__search" onSubmit={handleSubmit}>
            <input
              type="search"
              className="header__search-input"
              placeholder="Pokemon name"
              aria-label="Pokemon name"
              value={query}
              onChange={(e) => setQuery && setQuery(e.target.value)}
            />
            <button type="submit" className="header__search-button" aria-label="Search">
              <Search className="w-4 h-4 header__search-icon" />
              <span className="header__search-text">Search</span>
            </button>
          </form>
          <SettingsMenu />
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <NavLink
          to="/"
          end
          onClick={onHomeClick}
          className={({ isActive }) =>
            `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="mobile-bottom-nav__label">Home</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`
          }
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="mobile-bottom-nav__label">Categories</span>
        </NavLink>

        <NavLink
          to="/my-pokedex"
          className={({ isActive }) =>
            `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`
          }
        >
          <PokeballIcon className="w-5 h-5 mb-0.5" />
          <span className="mobile-bottom-nav__label">My Pokédex</span>
        </NavLink>

        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`
          }
        >
          <Star className="w-5 h-5 mb-0.5" />
          <span className="mobile-bottom-nav__label">Favourites</span>
        </NavLink>
      </nav>
    </>
  )
}

export default Header
