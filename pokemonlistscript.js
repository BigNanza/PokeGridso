let keywords;
let categoryList;
let pokemonData;
let dictoflists;
let selectedCategories = new Set(); // Track selected items
let validPokemon = [];

fetch("keywords.json")
  .then((response) => response.json())
  .then((data) => {
    keywords = data["keywords"];
    validPokemon = keywords;
    updateSelectedList();
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

fetch("categoryList.json")
  .then((response) => response.json())
  .then((data) => {
    categoryList = data["categoryList"];
    updateDropdown();
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

fetch("pokemonData.json")
  .then((response) => response.json())
  .then((data) => {
    pokemonData = data;
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

fetch("dictoflists.json")
  .then((response) => response.json())
  .then((data) => {
    dictoflists = data;
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

// Function to format category names
function formatCategoryName(index, name) {
  // 1-18 : Type
  // 19 - 22 : Group
  // 24 - 27 : Evolution
  // 28-37 : Color
  // 38 : 41 : Abil
  // 42 - 50 : Generation
  // 51 - 969 : Move
  // 970 - 982 : Evolution Trigger
  // 983 - 1289 : Ability
  // 1290 - 1304 : Egg Group
  // 1305 - 1309 : Gender Rate
  // 1310 - 1315 : Growth Rate
  // 1316 - 1329 : Shape
  if (index >= 1 && index <= 18) return `Type: ${name}`;
  if (index >= 19 && index <= 22) return `Group: ${name}`;
  if (index >= 24 && index <= 27) return `Evolution: ${name}`;
  if (index >= 28 && index <= 37) return `Color: ${name}`;
  if (index >= 38 && index <= 41) return `Ability: ${name}`;
  if (index >= 42 && index <= 50) return `Generation: ${name}`;
  if (index >= 51 && index <= 969) return `Move: ${name}`;
  if (index >= 970 && index <= 982) return `Evolution Trigger: ${name}`;
  if (index >= 983 && index <= 1289) return `Ability: ${name}`;
  if (index >= 1290 && index <= 1304) return `Egg Group: ${name}`;
  if (index >= 1305 && index <= 1309) return `Gender Rate: ${name}`;
  if (index >= 1310 && index <= 1315) return `Growth Rate: ${name}`;
  if (index >= 1316 && index <= 1329) return `Shape: ${name}`;
  return name; // Default fallback
}

// Function to update the datalist options (single-line format with category type)
function updateDropdown() {
  const datalist = document.getElementById("categories");
  datalist.innerHTML = ""; // Clear previous options

  categoryList.forEach((category, index) => {
    let formattedName = formatCategoryName(index, category);
    let option = document.createElement("option");
    option.value = formattedName; // Show category type in title
    datalist.appendChild(option);
  });

  document
    .getElementById("dropdown")
    .addEventListener("input", handleInputChange);
}

// Function to handle category selection and deselection
function handleInputChange(event) {
  const selectedValue = event.target.value;

  // Remove the prefix (e.g., "Type: ") before checking against categoryList
  const cleanedValue = selectedValue.split(": ").pop();

  // Check if the value matches a category
  if (categoryList.includes(cleanedValue)) {
    if (selectedCategories.has(cleanedValue)) {
      selectedCategories.delete(cleanedValue); // Remove if already selected
    } else {
      selectedCategories.add(cleanedValue); // Add if not selected
    }

    updateValidPokemon();
    updateSelectedCategoriesList(); // Ensure selected categories are displayed

    // Clear the input field only after selection
    setTimeout(() => {
      event.target.value = ""; // Reset input text to blank
    }, 100); // Delay slightly to allow for selection
  }
}

// Function to update the list of valid Pokemon fitting the selected categories
function updateValidPokemon() {
  validPokemon = keywords.filter((pokemon) =>
    Array.from(selectedCategories).every((category) =>
      verify(pokemon, categoryList.indexOf(category))
    )
  );
  updateSelectedList(); // Update displayed Pokémon
}

// Function to verify if a Pokémon fits the selected category
function verify(mon, category) {
  //console.log("Verifying " + mon + " with " + category);
  let pokemon = pokemonData[mon];
  let one = category;

  if (one == 0 && pokemon[2] != 0) return false;
  if (one < 19 && !(pokemon[1] == one || pokemon[2] == one)) return false;
  if (one > 18 && one < 23 && one - 18 != pokemon[3]) return false;
  if (one == 23 && pokemon[2] == 0) return false;
  if (one > 23 && one < 28 && one - 24 != pokemon[6]) return false;
  if (one > 27 && one < 38 && one - 27 != pokemon[7]) return false;
  if (one == 38 && pokemon[8] > 1) return false;
  if (one == 39 && (pokemon[8] == 1 || pokemon[8] >= 20)) return false;
  if (one == 40 && (pokemon[8] < 20 || pokemon[8] > 30)) return false;
  if (one == 41 && pokemon[8] <= 30) return false;
  if (one < 51 && one > 41 && one - 41 != pokemon[0]) return false;
  if (one > 50 && one < 970 && !pokemon[9].includes(one - 50)) return false;
  if (one > 969 && one < 983 && pokemon[10] != one - 969) return false;
  if (one > 982 && one < 1290 && !pokemon[11].includes(one - 982)) return false;
  if (one > 1289 && one < 1305 && !pokemon[12].includes(one - 1289))
    return false;
  if (one > 1304 && one < 1310 && pokemon[13] != one - 1304) return false;
  if (one > 1309 && one < 1316 && pokemon[14] != one - 1309) return false;
  if (one > 1315 && pokemon[15] != one - 1315) return false;

  return true;
}

// Function to update the list of selected Pokémon
function updateSelectedList() {
  const selectedList = document.getElementById("selected-list");
  selectedList.innerHTML = ""; // Clear the previous list

  validPokemon.forEach((pokemon) => {
    const listItem = document.createElement("li");
    listItem.textContent = pokemon;
    selectedList.appendChild(listItem);
  });
}

// Function to update the list of selected categories
function updateSelectedCategoriesList() {
  const selectedCategoryList = document.getElementById("selected-categories");
  selectedCategoryList.innerHTML = ""; // Clear previous selections

  selectedCategories.forEach((category) => {
    const listItem = document.createElement("li");
    listItem.textContent = category; // Just the category name, no extra text
    selectedCategoryList.appendChild(listItem);
  });
}
