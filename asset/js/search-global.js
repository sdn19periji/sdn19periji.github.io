// Inisialisasi worker
const searchWorker = new Worker('/searchWorker.js');

// Menerima hasil dari worker
searchWorker.onmessage = function (event) {
  const { type, results, message } = event.data;
  const resultsContainer = document.getElementById('search-results');

  if (type === 'search-results') {
    if (results.length > 0) {
      displaySearchResults(results);
      resultsContainer.classList.remove('hidden'); // Tampilkan hasil
    } else {
      resultsContainer.innerHTML = '<p class="text-error text-center">Tidak ditemukan apa-apa.</p>';
      resultsContainer.classList.remove('hidden'); // Tampilkan pesan tidak ada hasil
    }
  } else if (type === 'error') {
    resultsContainer.innerHTML = `<p class="text-red-500 text-center">${message}</p>`;
    resultsContainer.classList.remove('hidden'); // Tampilkan pesan error
  }
};

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Hapus hasil sebelumnya

  results.forEach((result) => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('the-result');

    resultItem.innerHTML = `
      <p class="text-md sm:text-lg font-bold mb-2 text-primary">
        <a class="link link-hover" href="${result.url}">${result.title}</a>
      </p>
      <p class="text-sm sm:text-md mb-2">${result.description}</p>
      <p class="text-sm"><span class="badge badge-accent">${result.category}</span> - ${result.date}</p>
    `;

    resultsContainer.appendChild(resultItem);
  });
}

// Event listener untuk input pencarian
document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const categories = ['blog', 'photos', 'unduhan', 'personil', 'visiMisi', 'profil']; // Kategori untuk mencari
  
  // Kirim data ke worker jika panjang query cukup
  if (query.length >= 3) {
    searchWorker.postMessage({ type: 'search', query, categories });
  } else {
    document.getElementById('search-results').classList.add('hidden'); // Sembunyikan jika query terlalu pendek
  }
});

// Fungsi untuk menginisialisasi kontainer hasil dengan pesan awal
document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.classList.add('hidden'); // State awal tersembunyi
});

// Event listener untuk membersihkan input pencarian saat klik di luar
document.addEventListener('click', function (event) {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
    searchInput.value = ''; // Kosongkan input pencarian
    resultsContainer.classList.add('hidden'); // Sembunyikan kontainer hasil
  }
});

// Nonaktifkan efek scroll saat input aktif
document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const navbarInput = document.querySelector('#sticky-parent input');

  if (navbarInput) {
    navbarInput.addEventListener('focus', () => {
      htmlElement.classList.remove('scroll-smooth', 'scroll-pt-[5rem]');
    });

    navbarInput.addEventListener('blur-sm', () => {
      htmlElement.classList.add('scroll-smooth', 'scroll-pt-[5rem]');
    });
  }
});
