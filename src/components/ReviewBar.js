import React, { useState, useEffect } from "react";

const ReviewBar = ({ handleMediaSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResult] = useState({ movies: [], games: [], music: [], books: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const omdbAPIKey = 'ba6a8650';
    const twitchSecret = 'kytr0y5d4wq9031ntvi39rjo93e575';
    const twitchClientID = 'u421h2kfdvdzwm9xzqca1upjjbr05v';
    const spotifyClientID = 'fea5693b81384bedb83b166f8f928476'; 
    const spotifyClientSecret = '6145547217774280ac7176fb7b366d80';

    const clearSearchQuery = () => {
      setSearchQuery('');
    };

    // Fetches movie and game data from the OMDB API
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${omdbAPIKey}`);
        const data = await response.json();
        return data.Response === "True" ? data.Search : [];
      } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
      }      
    }

    // Currently not used, since the omdbAPI also fetches games.
    const fetchGames = async () => {
        const authResponse = await fetch(`https://id.twitch.tv/oauth2/token`,
          {
            method: 'POST',
            body: new URLSearchParams({
              client_id: twitchClientID,
              client_secret: twitchSecret,
              grant_type: 'client_credentials',
            })
          }
        );
        const { access_token } = await authResponse.json();
        const response = await fetch(`https://api.igdb.com/v4/games`, {
          method: 'POST',
          headers: {
            'Client-ID': twitchClientID,
            'Authorization': `Bearer ${access_token}`,
          },
          body: `search "${searchQuery}"; fields name, release_dates.human;`
        });
        const data = await response.json();
        return data || [];
    }

    // Fetches the Spotify API token
    const fetchSpotifyToken = async () => {
      try {
        const authResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
          'Authorization': 'Basic ' + btoa(`${spotifyClientID}:${spotifyClientSecret}`),
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials'
        });
        const data = await authResponse.json();
        return data.access_token || [];
        } catch (error) {
          console.error("Error fetching music:", error);
          return [];
      }       
    };

    // Fetches music data from the Spotify API
    const fetchMusic = async (token) => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      const data = await response.json();
      return data.tracks.items.slice(0, 15) || [];
      } catch (error) {
        console.error("Error fetching music:", error);
      }      
    };

    // Currently not used, needs to be debugged. Made the website fail with some specific search inputs.
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${searchQuery}`
        );
        const data = await response.json();
        return data.docs.slice(0, 15) || [];
      } catch (error) {
        console.error("Error fetching books:", error);
        return [];
      }
      
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Triggers the search whenever the search query changes
    useEffect(() => {
      const handleSearchSubmit = async () => {
        if (searchQuery.trim() === '') {
          setSearchResult({ movies: [], music: [], books: [] });
          return;
        }
        setLoading(true);
        setError(null);

        try {
          const [movies, spotifyToken, books] = await Promise.all([
            fetchMovies(),
            fetchSpotifyToken(),
            fetchBooks()
          ]);

          const music = await fetchMusic(spotifyToken);

          // Update state with search results, null if there are none.
          setSearchResult({
            movies: movies || [],
            music: music || [],
            books: books || []
          });
        } catch (error) {
          setError("Failed to fetch data. Please try again");
        } finally {
          setLoading(false);
        }
      };

      // Adds a delay to the search query to avoid excessive API calls.
      const delay = setTimeout(() => {
        if (searchQuery) {
          handleSearchSubmit();
        }
      }, 500);

      return () => clearTimeout(delay);
    }, [searchQuery]);

    return (
      <div className="review-bar rounded box-shadow protest-strike">
      <h1 className="review-bar-title">Do you wish to write a review?</h1>
      
      {/* Search Input */}
      <input 
          type="text"
          className="search-bar rounded"
          placeholder="Search for a Movie, Game or Song title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Only show the pop-up container if there are search results */}
      {searchQuery && !loading && (
        <div className="popup-container">
          {/* Movies */}
          {searchResults.movies.length > 0 && (
            <div>
              <h3>Movies & Games</h3>
              {searchResults.movies.map((movie) => (
                <p 
                  key={movie.imdbID}
                  onClick={() => {
                    handleMediaSelect({
                      type: 'movie',
                      title: movie.Title,
                      year: movie.Year,
                      imdbID: movie.imdbID,
                      imageUrl: movie.Poster
                    });
                    clearSearchQuery();  // Clear search query on media select
                  }}
                  className="clickable"
                >
                  {movie.Title} ({movie.Year})
                </p>
              ))}
            </div>
          )}

          {/* Music */}
          {searchResults.music.length > 0 && (
            <div>
              <h3>Music</h3>
              {searchResults.music.map((track) => (
                <p 
                  key={track.id}
                  onClick={() => {
                    handleMediaSelect({
                      type: 'track',
                      title: track.name,
                      artist: track.artists[0].name || "Unknown Artist",
                      imageUrl: track.album.images[0]?.url || null,
                      year: new Date(track.album.release_date).getFullYear()
                    });
                    clearSearchQuery();
                  }}
                  className="clickable"
                >
                  {track.name} - {track.artists[0].name} ({new Date(track.album.release_date).getFullYear()})
                </p>
              ))}
            </div>
          )}

          {/* Books NOT USED BECAUSE OF SEARCH ERRORS*/}
          {/* {searchResults.books.length > 0 && (
            <div>
              <h3>Books</h3>
              {searchResults.books.map((book, index) => (
                <p 
                  key={index}
                  onClick={() => {
                    handleMediaSelect({
                      type: 'book',
                      title: book.title,
                      author: book.author_name?.[0] || "Unknown Author",
                      year: book.first_publish_year,
                      imageUrl: book.cover_i 
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                      : null, // Default to null if no cover image is available
                    });
                    clearSearchQuery();
                  }}
                  className="clickable"
                >
                  {book.title} - {book.author_name[0].name} ({book.first_publish_year})
                </p>
              ))}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default ReviewBar;