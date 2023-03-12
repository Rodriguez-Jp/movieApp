//Glide JS
import Glide from "../node_modules/@glidejs/glide/dist/glide.esm.js";

const apiKey = "5592a035fe9f246cb15ff75906b34918";
const trendingMoviesList = document.querySelector("#trending-movies-list");
const upcomingMoviesList = document.querySelector("#upcoming-movies-list");

document.addEventListener("DOMContentLoaded", () => {
  loadTrending();
  loadUpcoming();
  //   loadAdventure();
  //   loadComedy();
});

function loadTrending() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayMovies(movies.results, trendingMoviesList);
    })
    .catch((error) => console.log(error));
}

function loadUpcoming() {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayMovies(movies.results, upcomingMoviesList);
    })
    .catch((error) => console.log(error));
}

function displayMovies(movies, ref) {
  console.log(movies);

  movies.forEach((movie) => {
    const { backdrop_path, title, release_date } = movie;

    const divContainer = document.createElement("div");
    divContainer.classList.add("relative", "h-[300px]", "rounded");

    const li = document.createElement("li");
    li.classList.add("glide__slide");

    const divMovieCard = document.createElement("div");
    divMovieCard.classList.add("w-full", "rounded", "h-[300px]", "rounded");

    const movieImg = document.createElement("img");
    movieImg.src = `https://image.tmdb.org/t/p/w200/${backdrop_path}`;
    movieImg.alt = title;
    movieImg.classList.add("rounded", "h-1/2");

    const textContainerDiv = document.createElement("div");
    textContainerDiv.classList.add("py-4");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add(
      "font-bold",
      "text-lg",
      "mb-2",
      "text-red-400",
      "text-left"
    );
    titleDiv.textContent = title;

    const releaseDateP = document.createElement("p");
    releaseDateP.classList.add("font-ligth", "text-sm");
    releaseDateP.textContent = release_date;

    textContainerDiv.appendChild(titleDiv);
    textContainerDiv.appendChild(releaseDateP);

    divMovieCard.appendChild(movieImg);
    divMovieCard.appendChild(textContainerDiv);

    divContainer.appendChild(divMovieCard);

    li.appendChild(divContainer);

    ref.appendChild(li);
  });
  loadGlide();
}

function loadGlide() {
  new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    perView: 5,
    gap: 20,
  }).mount();
}
