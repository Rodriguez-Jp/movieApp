(function () {
  //Variables
  const modal = document.querySelector("#modal");
  const overlay = document.querySelector("#overlay");
  const apiKey = "5592a035fe9f246cb15ff75906b34918";
  const moviesContainer = document.querySelector("#movies-container");
  let DB;

  document.addEventListener("DOMContentLoaded", () => {
    //Open DB connection
    let openConnection = window.indexedDB.open("movies", 1.0);

    openConnection.onerror = () => {
      console.log("there was an error open the db connection");
    };

    openConnection.onsuccess = function (e) {
      DB = e.target.result;
    };
    //Get the element for the session storage to make the search
    const query = window.sessionStorage.getItem("query");
    console.log(query);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${query}`;

    fetch(url)
      .then((response) => response.json())
      .then((movies) => displaySearchedMovies(movies.results, moviesContainer));
  });

  //Displays the movies based on the query
  function displaySearchedMovies(movies, ref) {
    console.log(movies.length);
    console.log(ref);
    if (movies.length === 0) {
      //Add the styles for the ref element
      ref.classList.add("flex", "ml-10", "mt-10", "w-full", "justify-center");
      const p = document.createElement("p");
      p.classList.add(
        "text-xl",
        "text-black",
        "ml-10",
        "w-full",
        "text-center"
      );
      p.textContent = "There are no movies for your search :(";
      ref.appendChild(p);
      return;
    }

    //Add the styles for the ref element
    ref.classList.add("grid", "grid-cols-3", "mt-5", "gap-8");
    //Creates the card for each movie
    movies.forEach((movie) => {
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
      movieImg.alt = title;
      movieImg.classList.add("rounded-t", "h-1/2", "w-[300px]");

      if (backdrop_path !== null) {
        movieImg.src = `https://image.tmdb.org/t/p/w300/${backdrop_path}`;
      } else {
        movieImg.src = "./imgs/no-image.jpeg";
      }

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

  //Clear the HTML ref passed
  function cleanHTML(ref) {
    while (ref.firstChild) {
      ref.firstChild.remove();
    }
  }
})();
