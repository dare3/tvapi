// "use strict";

// const $showsList = $("#showsList");
// const $episodesArea = $("#episodesArea");
// const $searchForm = $("#searchForm");


// /** Given a search term, search for tv shows that match that query.
//  *
//  *  Returns (promise) array of show objects: [show, show, ...].
//  *    Each show object should contain exactly: {id, name, summary, image}
//  *    (if no image URL given by API, put in a default image URL)
//  */

// async function getShowsByTerm( /* term */) {
//   // ADD: Remove placeholder & make request to TVMaze search shows API.

//   return [
//     {
//       id: 1767,
//       name: "The Bletchley Circle",
//       summary:
//         `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//            women with extraordinary skills that helped to end World War II.</p>
//          <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//            normal lives, modestly setting aside the part they played in
//            producing crucial intelligence, which helped the Allies to victory
//            and shortened the war. When Susan discovers a hidden code behind an
//            unsolved murder she is met by skepticism from the police. She
//            quickly realises she can only begin to crack the murders and bring
//            the culprit to justice with her former friends.</p>`,
//       image:
//         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//     }
//   ];
// }


// /** Given list of shows, create markup for each and to DOM */

// function populateShows(shows) {
//   $showsList.empty();

//   for (let show of shows) {
//     const $show = $(
//       `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
//          <div class="media">
//            <img
//               src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
//               alt="Bletchly Circle San Francisco"
//               class="w-25 me-3">
//            <div class="media-body">
//              <h5 class="text-primary">${show.name}</h5>
//              <div><small>${show.summary}</small></div>
//              <button class="btn btn-outline-light btn-sm Show-getEpisodes">
//                Episodes
//              </button>
//            </div>
//          </div>
//        </div>
//       `);

//     $showsList.append($show);
//   }
// }


// /** Handle search form submission: get shows from API and display.
//  *    Hide episodes area (that only gets shown if they ask for episodes)
//  */

// async function searchForShowAndDisplay() {
//   const term = $("#searchForm-term").val();
//   const shows = await getShowsByTerm(term);

//   $episodesArea.hide();
//   populateShows(shows);
// }

// $searchForm.on("submit", async function (evt) {
//   evt.preventDefault();
//   await searchForShowAndDisplay();
// });


// /** Given a show ID, get from API and return (promise) array of episodes:
//  *      { id, name, season, number }
//  */

// // async function getEpisodesOfShow(id) { }

// /** Write a clear docstring for this function... */


"use strict";

// DOM elements
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

// Default image URL for shows without an image
const DEFAULT_IMAGE_URL = "https://tinyurl.com/tv-missing";

// Function to fetch shows based on search term
async function getShowsByTerm(term) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  const shows = response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : DEFAULT_IMAGE_URL,
      // Extract actors from the cast array
      actors: show._embedded && show._embedded.cast ? show._embedded.cast.map(actor => actor.person.name) : [],
      // Extract genres from the genres array
      genres: show.genres || []
    };
  });
  return shows;
}


// Function to populate shows in the DOM
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <p><strong>Actors:</strong> ${show.actors.join(', ')}</p>
             <p><strong>Genres:</strong> ${show.genres.join(', ')}</p>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


// Function to handle search form submission
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val(); // Get search term from input
  const shows = await getShowsByTerm(term); // Fetch shows based on term
  $episodesArea.hide(); // Hide episodes area initially
  populateShows(shows); // Populate shows in the DOM
}


// Event listener for search form submission
$searchForm.on("submit", async function (evt) {
  evt.preventDefault(); // Prevent default form submission behavior
  await searchForShowAndDisplay(); // Search for shows and display them
});

// Function to fetch episodes of a show by its ID
async function getEpisodesOfShow(id) {
  // Make API request to get episodes of the show with the given ID
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // Extract relevant data from response and format episodes array
  const episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  return episodes;
}

// Function to populate episodes in the DOM
function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty(); // Clear previous episodes from the list

  // Create HTML markup for each episode and append to episodes list
  for (let episode of episodes) {
    const $item = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($item); // Append the episode to the episodes list
  }
  $episodesArea.show(); // Show episodes area after populating episodes
}

// Event listener for clicking "Episodes" button for a show
$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  // Get the show ID from the clicked button's parent element
  const showId = $(evt.target).closest(".Show").data("show-id");
  // Fetch episodes of the show based on its ID
  const episodes = await getEpisodesOfShow(showId);
  // Populate episodes in the DOM
  populateEpisodes(episodes);
});




