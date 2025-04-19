import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBookOpen, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Book } from '../../types/DataTypes';
import './Header.css';

const Header: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`/api/book/search/${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setSearchResults(response.data.books || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setShowSearchDropdown(true);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleBookClick = (bookId: string) => {
    clearSearch();
    navigate(`/book/${bookId}`);
  };

  return (
    <nav className='navbar navbar-expand-lg shadow-sm bg-white sticky-top'>
      <div className='container'>
        <Link to='/bookshelf' className='text-decoration-none'>
          <div className='d-flex align-items-center'>
            <FaBookOpen className='text-primary me-2' size={24} />
            <span className='navbar-brand mb-0 h1 text-primary'>MyBookshelf</span>
          </div>
        </Link>

        <div className='d-flex align-items-center gap-3'>
          <div className='search-container' ref={searchRef}>
            <div className='search-input-wrapper'>
              <FaSearch className='search-icon text-muted' />
              <input
                type='text'
                className='form-control search-input'
                placeholder='Search books...'
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  className='search-clear-button'
                  onClick={clearSearch}
                  aria-label='Clear search'
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showSearchDropdown && (
              <div className='search-results-dropdown'>
                {isSearching ? (
                  <div className='search-loading'>
                    <div className='spinner-border spinner-border-sm text-primary' role='status'>
                      <span className='visually-hidden'>Searching...</span>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((book) => (
                    <div
                      key={book.id}
                      className='search-result-item'
                      onClick={() => handleBookClick(book.id)}
                    >
                      <div className='search-result-image'>
                        <img
                          src={book.imageLinks?.thumbnail || '/default-book-cover.png'}
                          alt={book.title}
                        />
                      </div>
                      <div className='search-result-info'>
                        <h6 className='search-result-title'>
                          {book.title || 'Untitled Book'}
                        </h6>
                        <p className='search-result-author text-muted'>
                          {book.authors?.join(', ') || 'Unknown Author'} • 
                          {book.shelf === 'wantToRead' ? ' Want to Read' :
                           book.shelf === 'currentlyReading' ? ' Currently Reading' :
                           book.shelf === 'read' ? ' Read' : ''}
                        </p>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className='search-no-results'>
                    No books found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <button
            className='btn btn-outline-danger nav-button'
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header; 