import { handleCitySearch } from './app.js';

function initializeApp() {
    const searchBar = document.getElementById("searchBar");
    
    searchBar.addEventListener("change", async () => {
        await handleCitySearch();
    });
}

initializeApp();