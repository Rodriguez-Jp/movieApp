//Glide JS
import Glide from "../node_modules/@glidejs/glide/dist/glide.esm.js";
//Global variables to be exported

(function () {
  //Variables
  const apiKey = "5592a035fe9f246cb15ff75906b34918";
  const trendingMoviesList = document.querySelector("#trending-movies-list");
  const latestMovie = document.querySelector("#latest-card-container");
  const randomMoviesContainer = document.querySelector("#random-movies");
  let DB;
  const modal = document.querySelector("#modal");
  const overlay = document.querySelector("#overlay");
  const cancelModalBtn = document.querySelector(".cancel-btn");
  const searchBtn = document.querySelector("#search-bar-btn");
  const inputSearchText = document.querySelector("#search-bar");

  //Loads all the API info once the document if fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    createDB();
    loadTrending();
    loadLatest();
    loadRandomMovies();
    cancelModalBtn.addEventListener("click", hideModal);
    searchBtn.addEventListener("click", searchMovie);
    inputSearchText.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchMovie();
      }
    });
  });

  //Creates the DB
  function createDB() {
    const createDB = window.indexedDB.open("movies", 1.0);

    createDB.onerror = function () {
      alert("Sorry, there was an error");
    };

    createDB.onsuccess = function () {
      DB = createDB.result;
    };

    createDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore("movies", {
        keyPath: "id",
        autoIncrement: true,
      });

      //Keys of the DB
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("title", "title", { unique: true });
      objectStore.createIndex("overview", "overview", { unique: false });
      objectStore.createIndex("img", "img", { unique: false });
      objectStore.createIndex("release_date", "release_date", {
        unique: false,
      });
    };
  }

  //Loads all the trending movies info and send to display it
  function loadTrending() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    fetch(url)
      .then((response) => response.json())
      .then((movies) => {
        //Display the movies once they were loaded
        displayMoviesGlide(movies.results, trendingMoviesList);
      })
      .catch((error) => console.log(error));
  }

  //Loads all the latest movie info and send to display it
  function loadLatest() {
    const url = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}&language=en-US&page=1`;
    fetch(url)
      .then((response) => response.json())
      .then((movies) => {
        //Display the movies once they were loaded
        displayLatest(movies, latestMovie);
      })
      .catch((error) => console.log(error));
  }

  //Loads random movies info and send to display it
  function loadRandomMovies() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    fetch(url)
      .then((response) => response.json())
      .then((movie) =>
        //Display the movies once they were loaded
        displayRandomMovies(movie.results, randomMoviesContainer)
      )
      .catch((error) => console.log(error));
  }

  //Special function to display the trending movies using GlideJS
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
      li.onclick = () => {
        displayModal(movie);
      };

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
    //Mounts the Glide Object
    loadGlide();
  }

  // Display the latest movie
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

    //In case that the movie haven't image, it will show a generic one
    img.src =
      String(poster_path) === "null"
        ? "../src/imgs/generic_movie_img.jpg"
        : imgUrlClass;

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

  //Display 3 random movies passed by the API
  function displayRandomMovies(movies, ref) {
    //Cut the result by just 3 movies
    const moviesArr = movies.slice(0, 3);

    //For each movie it generates a card
    moviesArr.forEach((movie) => {
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
        "cursor-pointer",
        "w-[300px]"
      );

      const divMovieCard = document.createElement("div");
      divMovieCard.classList.add("w-full", "rounded-t", "h-[300px]", "rounded");

      const movieImg = document.createElement("img");
      movieImg.src = `https://image.tmdb.org/t/p/w300/${backdrop_path}`;
      movieImg.alt = title;
      movieImg.classList.add("rounded-t", "h-1/2", "w-[300px]");

      const textContainerDiv = document.createElement("div");
      textContainerDiv.classList.add("py-4", "px-2", "w-fit");

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

      //Add the button listener for the modal
      divContainer.onclick = () => {
        displayModal(movie);
      };

      ref.appendChild(divContainer);
    });
  }

  //Displays the hidden modal with all the movie info
  function displayModal(movie) {
    const { backdrop_path, title, overview } = movie;
    const buttonModalSection = document.querySelector("#button-section");

    const modalImgDiv = document.querySelector("#modal-img");
    //Check if there is a previous img
    if (modalImgDiv.firstChild) {
      modalImgDiv.firstChild.remove();
    }
    const modalImg = document.createElement("img");
    modalImg.classList.add("rounded-lg", "shadow-lg");
    modalImg.src = `https://image.tmdb.org/t/p/original/${backdrop_path}`;
    modalImg.alt = title;
    modalImgDiv.appendChild(modalImg);

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const modalTitle = document.querySelector("#modal-title");
    modalTitle.textContent = title;

    const modalOverview = document.querySelector("#modal-overview");
    modalOverview.textContent = overview;

    //Modal save/close movie btn
    cleanHTML(buttonModalSection);
    const saveModalBtn = document.createElement("button");
    saveModalBtn.innerHTML = "Save movie";
    saveModalBtn.classList.add(
      "transition",
      "transform",
      "duration-200",
      "border-2",
      "border-white",
      "bg-white",
      "text-red-400",
      "p-2",
      "rounded-lg",
      "w-1/3",
      "hover:scale-105",
      "hover:shadow-2xl"
    );
    saveModalBtn.onclick = function () {
      //Add the movie to the indexedDB and hide the modal once clicked
      addMovie(movie);
      hideModal();
    };
    const cancelModalBtn = document.createElement("button");
    cancelModalBtn.innerHTML = "Cancel";
    cancelModalBtn.classList.add(
      "transition",
      "transform",
      "duration-200",
      "border-2",
      "border-white",
      "bg-white",
      "text-red-400",
      "p-2",
      "rounded-lg",
      "w-1/3",
      "hover:scale-105",
      "hover:shadow-2xl"
    );
    cancelModalBtn.onclick = function () {
      //Hides the modal once clicked
      hideModal();
    };

    buttonModalSection.appendChild(saveModalBtn);
    buttonModalSection.appendChild(cancelModalBtn);
  }

  //Hides the modal
  function hideModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  //Mount the Glide made with GlideJS
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

  //Add to favorites movies (Added all to the DB)
  function addMovie(movie) {
    //Movie info
    const id = Date.now();
    const { backdrop_path, title, overview, release_date } = movie;

    //DB connection
    const transaction = DB.transaction(["movies"], "readwrite");
    const objectStore = transaction.objectStore("movies");

    //Object to be pushed
    const movieObj = {
      id,
      title,
      overview,
      img: `https://image.tmdb.org/t/p/original${backdrop_path}`,
      release_date,
    };

    //Add the obj to the DB
    objectStore.add(movieObj);

    //Transaction handling
    transaction.oncomplete = function () {
      alert("Movie added");
      hideModal();
    }; // Need to add a notification for both messages
    transaction.onerror = function (e) {
      alert("That movie was already added");
    };
  }

  //Search for a movie
  function searchMovie() {
    //Validates for an empty string
    if (inputSearchText.value.trim() === "") {
      alert("Please enter a valid search");
      return;
    }
    //Once pass the validation, save the query in sessin Storage.
    window.sessionStorage.setItem("query", inputSearchText.value);
    location.replace("./src/searchedMovies.html");
  }

  //Clear the HTML ref passed
  function cleanHTML(ref) {
    while (ref.firstChild) {
      ref.firstChild.remove();
    }
  }
})();
