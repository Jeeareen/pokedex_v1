import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

interface HeaderProps {
  query?: string
  setQuery?: (query: string) => void
  onSearch?: () => void
  onHomeClick?: () => void
}

function Header({ query = '', setQuery, onSearch, onHomeClick }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch()
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <header className="header">
      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" className="header__link" end onClick={onHomeClick}>
          Home
        </NavLink>
        <NavLink to="/categories" className="header__link">
          Categories
        </NavLink>
        <NavLink to="/my-pokedex" className="header__link">
          My Pokedex
        </NavLink>
        <NavLink to="/favourites" className="header__link">
          <span className="header__star" aria-hidden="true">
            ★
          </span>
          Favourites
        </NavLink>
        {user ? (
          <button type="button" className="header__link" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/auth" className="header__link">
            Login
          </NavLink>
        )}
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
