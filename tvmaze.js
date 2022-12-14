"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


async function getShowsByTerm() {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let query=$("#search-query").val();
  $("#search-query").val("");
  const response =await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  //console.log(response.data);
  let shows= response.data.map(result=>{
    let show=result.show;
    if (show.image){
    return {
      id: show.id, name: show.name, summary: show.summary, image: show.image.original 
    };}
    return {
      id: show.id, name: show.name, summary: show.summary, image: null 
    }
  });
  console.log(shows);
  return shows;
}
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  if(!$('#search-query').val()){
    alert('enter a search value do not leave blank')
}else{
    let shows= await getShowsByTerm();
    populateShows(shows);
}

});

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media" data-show-id="${show.id}">
           <img src="${show.image}" alt="Bletchly Circle San Francisco" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

 async function apiEpisodes(id) {
  let response2 = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response2.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(`<li>${episode.name}(season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
$showsList.on( "click", ".Show-getEpisodes" ,async function getEpisodesOfShow(event) {
let showId= $(event.target).closest(".Show").data("show-id");
console.log(showId);
let episodes= await apiEpisodes(showId);
populateEpisodes(episodes);
 });

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
