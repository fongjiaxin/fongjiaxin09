const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const suggestionsContainer = document.querySelector(".suggestions");

let limit = 11;
let offset = 1;

// Fetch the list of Pokemon names from the API
const fetchPokemonNames = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
    const data = await response.json();
    return data.results.map(pokemon => pokemon.name);
  } catch (error) {
    console.error("Error fetching Pokemon names:", error);
    return [];
  }
};

let pokemonNames = [];

// Fetch Pokemon names and store them in the pokemonNames array
fetchPokemonNames().then(names => {
  pokemonNames = names;
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    showSuggestions(searchTerm);
  } else {
    suggestionsContainer.innerHTML = "";
  }
});

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    searchPokemon(searchTerm);
  }
});

function searchPokemon(term) {
  removeChildNodes(pokemonContainer);
  spinner.style.display = "block";
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${term}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Pokemon not found!");
      }
      return res.json();
    })
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      spinner.style.display = "none";
    });
}

function showSuggestions(term) {
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions

  const filteredPokemons = pokemonNames.filter(name => name.includes(term));

  filteredPokemons.forEach(pokemonName => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggestion");
    suggestion.textContent = pokemonName;

    suggestion.addEventListener("click", () => {
      searchInput.value = pokemonName;
      suggestionsContainer.innerHTML = "";
      searchPokemon(pokemonName);
    });

    suggestionsContainer.appendChild(suggestion);
  });
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    searchPokemon(searchTerm);
  }
});

function searchPokemon(term) {
  removeChildNodes(pokemonContainer);
  spinner.style.display = "block";
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${term}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Pokemon not found!");
      }
      return res.json();
    })
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      spinner.style.display = "none";
    });
}

previous.addEventListener("click", () => {
  if (offset != 1) {
    offset -= 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

next.addEventListener("click", () => {
  offset += 9;
  removeChildNodes(pokemonContainer);
  fetchPokemons(offset, limit);
});

function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    });
}

function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i);
  }
}

function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(progressBars(pokemon.stats));

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);
}

function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {
    const stat = stats[i];

    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("stat-container");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);