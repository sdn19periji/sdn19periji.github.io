// Encapsulate the code in an IIFE to avoid global conflicts
(function() {
  function updateResults() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const results = document.querySelectorAll('.result-item');
    let hasVisibleResults = false;

    // Show all results if the query length is less than 3
    if (query.length < 3) {
      results.forEach((result) => {
        result.classList.remove('hidden');
      });
      hasVisibleResults = true;
    } else {
      results.forEach((result) => {
        const text = result.textContent.toLowerCase();
        if (text.includes(query)) {
          result.classList.remove('hidden');
          hasVisibleResults = true;
        } else {
          result.classList.add('hidden');
        }
      });
    }

    // Show or hide the "no-results" message
    document.getElementById('no-results').classList.toggle('hidden', hasVisibleResults);
  }

  document.getElementById('search-input').addEventListener('input', updateResults);
})();

// disable scroll effect if input active
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