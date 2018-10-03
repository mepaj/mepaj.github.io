const apiKey = 'c71d80fe96ad477ca03e4a88fab4fdd2';
const defaultSource = 'usa-today';
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

window.addEventListener('load', e => {
    sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
    updateNewsSources().then(() => {
        sourceSelector.value = defaultSource;
        updateNews();
    });

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('/serviceWorker.js');
            console.log('OK Register Worker');
        } catch (error) {
            console.log('Worker failed');
        }
    }
});

async function updateNewsSources() {
    const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await response.json();
    sourceSelector.innerHTML =
        json.sources
        .map(source => `<option value="${source.id}">${source.name}</option>`)
        .join('\n');
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${source}&sortBy=publishedAt&apiKey=${apiKey}`);
    const json = await res.json();

    newsArticles.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
      <div class="article">
        <a href="${article.url}">
          <h2>${article.title}</h2>
          <img src="${article.urlToImage}" alt="${article.title}">
        </a>  
        <p>${article.description}</p>
      </div>
    `;
}