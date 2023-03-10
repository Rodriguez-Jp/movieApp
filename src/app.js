const apiKey = "5592a035fe9f246cb15ff75906b34918";
const trendingMovies = document.querySelector("#trending-movies");

document.addEventListener("DOMContentLoaded", () => {
  loadTrending();
  //   loadAction();
  //   loadAdventure();
  //   loadComedy();
});

function loadTrending() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayMovies(movies.results, trendingMovies);
    })
    .catch((error) => console.log(error));
}

function displayMovies(movies, ref) {
  console.log(movies);
  movies.forEach((movie) => {
    const { backdrop_path, title, release_date } = movie;
    const divMovieCard = document.createElement("div");
    divMovieCard.classList.add(
      "max-w-fit",
      "rounded",
      "overflow-hidden",
      "shadow-lg"
    );

    const movieImg = document.createElement("img");
    movieImg.src = `https://image.tmdb.org/t/p/w200/${backdrop_path}`;
    movieImg.alt = title;

    const textContainerDiv = document.createElement("div");
    textContainerDiv.classList.add("px-6", "py-4");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("font-bold", "text-xl", "mb-2", "text-red-400");
    titleDiv.textContent = title;

    const releaseDateP = document.createElement("p");
    releaseDateP.classList.add("font-ligth", "text-sm");
    releaseDateP.textContent = release_date;

    textContainerDiv.appendChild(titleDiv);
    textContainerDiv.appendChild(releaseDateP);

    divMovieCard.appendChild(movieImg);
    divMovieCard.appendChild(textContainerDiv);

    ref.appendChild(divMovieCard);
  });
}
