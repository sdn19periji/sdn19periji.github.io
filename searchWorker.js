// searchWorker.js

// Fungsi untuk mengambil data pencarian
async function fetchSearchData() {
  try {
    const response = await fetch('/search-data.json');
    const searchData = await response.json();
    return searchData;
  } catch (error) {
    console.error('Error loading search data:', error);
    return null;
  }
}

// Fungsi pencarian generik untuk memfilter data di beberapa kategori
function searchDataAcrossCategories(searchData, query, categories) {
  const results = [];

  categories.forEach((category) => {
    if (searchData[category] && Array.isArray(searchData[category])) {
      searchData[category].forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        ) {
          results.push(item);
        }
      });
    }
  });

  return results;
}

// Event listener untuk menerima pesan dari main thread
onmessage = async function (event) {
  const { type, query, categories } = event.data;
  
  if (type === 'search') {
    const searchData = await fetchSearchData();
    if (searchData) {
      const results = searchDataAcrossCategories(searchData, query, categories);
      postMessage({ type: 'search-results', results });
    } else {
      postMessage({ type: 'error', message: 'Error loading search data' });
    }
  }
};
