// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2307-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(API_URL + "/players");
    const data = await response.json();
    return data.data.players
  } 
  catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(API_URL + "/players/" + playerId);
    const data = await response.json()
    return data.data.player
  } 
  catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};


/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = ""
  playerList.forEach((element) => {
    const playerContainer = document.createElement("div");
    //Name
    const playerName = document.createElement("h2");
    playerName.innerHTML = element.name
    playerContainer.appendChild(playerName);

    //ID
    const playerId = document.createElement("h3");
    playerId.innerHTML = "ID: " + element.id;
    playerContainer.appendChild(playerId);

    //Image
    const playerImage = document.createElement("img")
    playerImage.src = element.imageUrl;
    playerImage.alt = element.name;
    playerContainer.appendChild(playerImage)

    // Details Button
    const detailsButton = document.createElement("button");
    detailsButton.innerHTML = "DETAILS";
    playerContainer.appendChild(detailsButton);
    detailsButton.addEventListener("click", async () => {
      renderSinglePlayer(await fetchSinglePlayer(element.id))
    })

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "DELETE";
    playerContainer.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
      mainContainer.removeChild(playerContainer)
    })

    

    mainContainer.appendChild(playerContainer);
  })
  
  

};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = ""
  const playerContainer = document.createElement("div");
  
  // Name
  const playerName = document.createElement("h2");
  playerName.innerHTML = player.name;
  playerContainer.appendChild(playerName);

  // ID
  const playerId = document.createElement("h3");
  playerId.innerHTML = "ID: " + player.id;
  playerContainer.appendChild(playerId);

  // Breed 
  const playerBreed = document.createElement("h4");
  playerBreed.innerHTML = player.breed;
  playerContainer.appendChild(playerBreed);

  // Team Name
  const teamName = document.createElement("h5");
  if (player.team){
    teamName.innerHTML = "Team: " + player.team.name;
  } else {
    teamName.innerHTML = "Unassigned"
  }
  
  playerContainer.appendChild(teamName);

  // Image
  const playerImage = document.createElement("img");
  playerImage.src = player.imageUrl;
  playerImage.alt = player.name;
  playerContainer.appendChild(playerImage);

  // Back to All Players Button

  const allPlayersButton = document.createElement("button");
  allPlayersButton.innerHTML = "Back To All Players"
  playerContainer.appendChild(allPlayersButton);
  allPlayersButton.addEventListener("click", async () => {
    renderAllPlayers(await fetchAllPlayers())
  })


  mainContainer.appendChild(playerContainer);
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    renderAllPlayers,
    renderSinglePlayer,
  };
} else {
  init();
}
