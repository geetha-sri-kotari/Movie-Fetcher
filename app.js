const BASE_URL = "https://www.omdbapi.com/?apikey=8b5b0696&";
    const searchPage = document.getElementById('search-page');
    const detailsPage = document.getElementById('details-page');
    const searchBtn = document.getElementById('search-btn');
    const backBtn = document.getElementById('back-btn');
    const movieInput = document.getElementById('movie-input');
    const resultsContainer = document.getElementById('results-container');
    const backgroundPoster = document.getElementById('background-poster');
    const moviePoster = document.getElementById('movie-poster');

    // Search for movies
    searchBtn.addEventListener('click', searchMovies);
    movieInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchMovies();
      }
    });

    function searchMovies() {
      const searchTerm = movieInput.value.trim();
      if (searchTerm === '') return;
      
      resultsContainer.innerHTML = '<div class="movie-option" style="text-align: center;">Loading...</div>';
      
      fetch(`${BASE_URL}s=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.Response === 'True') {
            displayResults(data.Search);
          } else {
            resultsContainer.innerHTML = '<div class="movie-option" style="text-align: center;">No movies found. Try another search.</div>';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          resultsContainer.innerHTML = '<div class="movie-option" style="text-align: center;">Error fetching data. Please try again.</div>';
        });
    }

    // Display search results
    function displayResults(movies) {
      resultsContainer.innerHTML = '';
      
      if (movies.length === 0) {
        resultsContainer.innerHTML = '<div class="movie-option" style="text-align: center;">No movies found. Try another search.</div>';
        return;
      }
      
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-option';
        movieElement.innerHTML = `
          <h3>${movie.Title}</h3>
          <p>${movie.Year} | ${movie.Type}</p>
        `;
        
        movieElement.addEventListener('click', () => {
          getMovieDetails(movie.imdbID);
        });
        
        resultsContainer.appendChild(movieElement);
      });
    }

    // Get detailed movie information
    function getMovieDetails(imdbID) {
      fetch(`${BASE_URL}i=${imdbID}&plot=full`)
        .then(response => response.json())
        .then(movie => {
          displayMovieDetails(movie);
          
          // Switch to details page
          searchPage.style.opacity = '0';
          detailsPage.style.opacity = '1';
          detailsPage.style.pointerEvents = 'auto';
        })
        .catch(error => {
          console.error('Error:', error);
          resultsContainer.innerHTML = '<div class="movie-option" style="text-align: center;">Error fetching movie details. Please try again.</div>';
        });
    }

    // Display movie details
    function displayMovieDetails(movie) {
      document.getElementById('movie-title').textContent = movie.Title;
      
      // Handle poster image
      if (movie.Poster && movie.Poster !== 'N/A') {
        moviePoster.innerHTML = '';
        moviePoster.style.backgroundImage = 'none';
        const img = document.createElement('img');
        img.src = movie.Poster;
        img.alt = `${movie.Title} Poster`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        moviePoster.appendChild(img);
        backgroundPoster.style.backgroundImage = `url(${movie.Poster})`;
      } else if(movie.Poster == "N/A"){
        moviePoster.innerHTML = '';
        moviePoster.style.backgroundImage = 'none';

        const placeholderImg = document.createElement('img');
        placeholderImg.src = './placeholder.jpg'; 
        placeholderImg.alt = 'No Poster Available';
        placeholderImg.style.width = '100%';
        placeholderImg.style.height = '100%';
        placeholderImg.style.objectFit = 'cover';

        moviePoster.appendChild(placeholderImg);
        backgroundPoster.style.backgroundImage = 'url(./placeholder.jpg)';
      }
      // Set movie meta data
      const metaContainer = document.getElementById('movie-meta');
      metaContainer.innerHTML = '';
      
      if (movie.Year && movie.Year !== 'N/A') {
        const year = document.createElement('span');
        year.textContent = movie.Year;
        metaContainer.appendChild(year);
      }
      
      if (movie.Rated && movie.Rated !== 'N/A') {
        const rated = document.createElement('span');
        rated.textContent = movie.Rated;
        metaContainer.appendChild(rated);
      }
      
      if (movie.Runtime && movie.Runtime !== 'N/A') {
        const runtime = document.createElement('span');
        runtime.textContent = movie.Runtime;
        metaContainer.appendChild(runtime);
      }
      
      if (movie.Genre && movie.Genre !== 'N/A') {
        const genre = document.createElement('span');
        genre.textContent = movie.Genre;
        metaContainer.appendChild(genre);
      }

      // Set movie details
      document.getElementById('movie-plot').textContent = movie.Plot !== 'N/A' ? movie.Plot : 'Not available';
      document.getElementById('movie-director').textContent = movie.Director !== 'N/A' ? movie.Director : 'Not available';
      document.getElementById('movie-writer').textContent = movie.Writer !== 'N/A' ? movie.Writer : 'Not available';
      document.getElementById('movie-actors').textContent = movie.Actors !== 'N/A' ? movie.Actors : 'Not available';
      document.getElementById('movie-genre').textContent = movie.Genre !== 'N/A' ? movie.Genre : 'Not available';
      document.getElementById('movie-runtime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'Not available';
      document.getElementById('movie-rated').textContent = movie.Rated !== 'N/A' ? movie.Rated : 'Not available';
      document.getElementById('movie-released').textContent = movie.Released !== 'N/A' ? movie.Released : 'Not available';
      document.getElementById('movie-production').textContent = movie.Production !== 'N/A' ? movie.Production : 'Not available';

      // Display ratings
      const ratingsContainer = document.getElementById('ratings-container');
      ratingsContainer.innerHTML = '';
      
      if (movie.Ratings && movie.Ratings.length > 0) {
        movie.Ratings.forEach(rating => {
          const ratingElement = document.createElement('div');
          ratingElement.className = 'rating';
          ratingElement.innerHTML = `
            <div>${rating.Source}</div>
            <div class="rating-value">${rating.Value}</div>
          `;
          ratingsContainer.appendChild(ratingElement);
        });
      } else {
        ratingsContainer.innerHTML = '<div class="rating">No ratings available</div>';
      }
    }

    // Back button functionality
    backBtn.addEventListener('click', () => {
      detailsPage.style.opacity = '0';
      detailsPage.style.pointerEvents = 'none';
      searchPage.style.opacity = '1';
      resultsContainer.innerHTML = '';
      movieInput.value = '';
      window.scrollTo(0, 0);
    });