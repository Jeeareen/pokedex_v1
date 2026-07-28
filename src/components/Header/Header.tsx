import React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  query?: string
  setQuery?: (query: string) => void
  onSearch?: () => void
}

function Header({ query = '', setQuery, onSearch }: HeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch()
    }
  }

  return (
    <header className="header">
      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" className="header__link" end>
          Home
        </NavLink>
        <NavLink to="/favourites" className="header__link">
          <span className="header__star" aria-hidden="true">
            ★
          </span>
          Favourites
        </NavLink>
        <NavLink to="/categories" className="header__link">
          Categories
        </NavLink>
      </nav>

      <form className="header__search" onSubmit={handleSubmit}>
        <input
          type="search"
          className="header__search-input"
          placeholder="Pokemon name"
          aria-label="Pokemon name"
          value={query}
          onChange={(e) => setQuery && setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="header__search-button"
        >
          Search
        </button>
      </form>
    </header>
  )
}

export default Header
