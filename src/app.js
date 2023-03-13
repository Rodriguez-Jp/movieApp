//Glide JS
import Glide from "../node_modules/@glidejs/glide/dist/glide.esm.js";

const apiKey = "5592a035fe9f246cb15ff75906b34918";
const trendingMoviesList = document.querySelector("#trending-movies-list");
const latestMovie = document.querySelector("#latest-card-container");
const randomMoviesContainer = document.querySelector("#random-movies");

document.addEventListener("DOMContentLoaded", () => {
  loadTrending();
  loadLatest();
  loadRandomMovies();
});

function loadTrending() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayMoviesGlide(movies.results, trendingMoviesList);
    })
    .catch((error) => console.log(error));
}

function loadLatest() {
  const url = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayLatest(movies, latestMovie);
    })
    .catch((error) => console.log(error));
}

function loadRandomMovies() {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movie) => displayRandomMovies(movie.results, randomMoviesContainer))
    .catch((error) => console.log(error));
}

function displayMoviesGlide(movies, ref) {
  movies.forEach((movie) => {
    const { backdrop_path, title, release_date } = movie;

    const divContainer = document.createElement("div");
    divContainer.classList.add("relative", "h-[300px]", "rounded");

    const li = document.createElement("li");
    li.classList.add(
      "glide__slide",
      "hover:scale-105",
      "transform",
      "transition",
      "duration-200"
    );

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

function displayLatest(movie, ref) {
  const { original_title, overview, poster_path } = movie;
  const imgUrlClass = `https://image.tmdb.org/t/p/original${poster_path}`;

  const imgDiv = document.createElement("div");
  imgDiv.classList.add(
    "w-full",
    "h-full",
    "object-fill",
    "hover:scale-105",
    "transform",
    "transition",
    "duration-200",
    "h-full"
  );
  const img = document.createElement("img");
  img.classList.add("object-fill", "h-full", "w-full");
  img.src = String(poster_path) === "null" ? "nothing" : imgUrlClass;

  imgDiv.appendChild(img);

  const textDiv = document.createElement("div");
  const title = document.createElement("h1");
  const description = document.createElement("p");

  title.classList.add("mb-5", "px-5", "text-4xl", "font-bold");
  description.classList.add("px-5", "text-lg");
  textDiv.classList.add(
    "flex",
    "flex-col",
    "justify-center",
    "bg-red-400",
    "text-white"
  );

  title.textContent = original_title;
  description.textContent = overview;

  textDiv.appendChild(title);
  textDiv.appendChild(description);

  ref.appendChild(textDiv);
  ref.appendChild(imgDiv);
}

function displayRandomMovies(movies, ref) {
  const moviesArr = movies.slice(0, 3);
  moviesArr.forEach((movie, i) => {
    console.log(i);
    const { backdrop_path, title, release_date } = movie;

    const divContainer = document.createElement("div");
    divContainer.classList.add(
      "transform",
      "transition",
      "duration-200",
      "h-[300px]",
      "rounded",
      "shadow-xl",
      "hover:scale-110",
      "cursor-pointer"
    );

    const divMovieCard = document.createElement("div");
    divMovieCard.classList.add("w-fit", "rounded-t", "h-[300px]", "rounded");

    const movieImg = document.createElement("img");
    movieImg.src = `https://image.tmdb.org/t/p/w500/${backdrop_path}`;
    movieImg.alt = title;
    movieImg.classList.add("rounded-t", "h-1/2");

    const textContainerDiv = document.createElement("div");
    textContainerDiv.classList.add("py-4", "px-2");

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

    ref.appendChild(divContainer);
  });
}

function loadGlide() {
  new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    perView: 5,
    gap: 20,
    swipeThreshold: false,
    dragThreshold: false,
    autoplay: 2000,
  }).mount();
}
