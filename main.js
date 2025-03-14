import './style.css';
import { supabase } from './src/supabase';

let selectedItem = null;

async function searchItems(query) {
  const { data, error } = await supabase
    .from('allMovies')
    .select('*')
    .ilike('Title', `%${query}%`)
    .limit(5);

  if (error) {
    console.error('Error fetching movies:', error);
    return [];
  }

  return data;
}

function renderSearchResults(results) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';
  console.log(results)

  results.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'search-result';
    div.innerHTML = `<h3 class="font-semibold">${movie.Title}</h3>`;
    div.onclick = () => {
      showItemDetails(movie);
      resultsContainer.innerHTML = '';
    };
    resultsContainer.appendChild(div);
  });
}

function formatOTTDetails(ottDatesPlatforms) {
  let formattedDetails = '<div class="mt-4">';
  formattedDetails += '<h3 class="text-lg font-semibold mb-2">Streaming Details</h3>';

  if (ottDatesPlatforms && Array.isArray(ottDatesPlatforms.movie)) {
    for (const ottItem of ottDatesPlatforms.movie) {
      formattedDetails += `<div class="mb-2 p-2 bg-gray-50 rounded">
        <div class="font-medium">${ottItem.platform}</div>
        <div>${`Release Date: ${ottItem.date || 'No release date available'}`}</div>
      </div>`;
    }
  } else {
    formattedDetails += '<div>No OTT details available</div>';
  }

  formattedDetails += '</div>';
  return formattedDetails;
}

function showItemDetails(movie) {
  selectedItem = movie;
  const detailsContainer = document.getElementById('itemDetails');
  detailsContainer.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">${movie.Title}</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">Description</h3>
          <p class="text-gray-600">${movie.description || 'No description available'}</p>
        </div>

        ${movie.Director ? `
          <div>
            <h3 class="text-lg font-semibold mb-2">Director</h3>
            <p class="text-gray-600">${movie.Director}</p>
          </div>
        ` : ''}

        ${movie.Language ? `
          <div>
            <h3 class="text-lg font-semibold mb-2">Language</h3>
            <p class="text-gray-600">${movie.Language}</p>
          </div>
        ` : ''}

        ${movie['Production House'] ? `
          <div>
            <h3 class="text-lg font-semibold mb-2">Production House</h3>
            <p class="text-gray-600">${movie['Production House']}</p>
          </div>
        ` : 'No Production House Information'}

        ${(movie.Cast) ? `
          <div>
            <h3 class="text-lg font-semibold mb-2">Cast</h3>
            <p class="text-gray-600">${movie.Cast}</p>
          </div>
        ` : 'No Cast details'}

        ${movie.release_date ? `
          <div>
            <h3 class="text-lg font-semibold mb-2">Release Date</h3>
            <p class="text-gray-600">${new Date(movie['Release Date']).toLocaleDateString()}</p>
          </div>
        ` : ''}

        ${formatOTTDetails(movie.ott_dates_platforms)}
      </div>
    </div>
  `;
}

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="relative">
          <input
            type="search"
            id="searchInput"
            placeholder="Search movies..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <div id="searchResults" class="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-10"></div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div id="itemDetails" class="mt-8">
        <div class="text-center text-gray-500">
          Search for movies and click on a result to see details
        </div>
      </div>
    </main>
  </div>
`;

const searchInput = document.getElementById('searchInput');
let debounceTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const query = e.target.value.trim();
    if (query.length >= 2) {
      const results = await searchItems(query);
      renderSearchResults(results);
    } else {
      document.getElementById('searchResults').innerHTML = '';
    }
  }, 300);
});