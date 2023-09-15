(function () {
  //Variables
  const moviesContainer = document.querySelector("#movies-container");
  let DB;
  //Open DB connection
  let openConnection = window.indexedDB.open("movies", 1.0);

  openConnection.onerror = () => {
    console.log("there was an error open the db connection");
  };

  openConnection.onsuccess = function (e) {
    DB = e.target.result;
    printMovies();
  };

  //Print the movies marked as favorities
  function printMovies() {
    //Clear all the previous movies
    cleanHTML(moviesContainer);

    //Create the objectStore for read the content
    const objectStore = DB.transaction("movies").objectStore("movies");
    const countRequest = objectStore.count();
    let count = (countRequest.onsuccess = () => {
      return countRequest.result;
    });

    console.log(count);

    //In case the user didnt add favorite movies yet
    // if (countRequest.onsuccess = () => === 0) {
    //   const p = document.createElement("p");
    //   p.classList.add(
    //     "text-xl",
    //     "text-black",
    //     "w-full",
    //     "text-center",
    //     "col-span-3",
    //     "mt-10"
    //   );
    //   p.textContent =
    //     "You don't have favorite movies yet, start by adding some movies!";
    //   moviesContainer.appendChild(p);
    //   return;
    // }

    objectStore.openCursor().onsuccess = function (e) {
      const movie = e.target.result;
      if (movie) {
        //A copy of the value is made to solve the program taking the last input and not the selected one
        const movieObj = movie.value;
        const { title, img, release_date } = movieObj;
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
          "w-[300px]",
          "m-10"
        );

        const divMovieCard = document.createElement("div");
        divMovieCard.classList.add(
          "w-full",
          "rounded-t",
          "h-[300px]",
          "rounded"
        );

        const movieImg = document.createElement("img");
        movieImg.src = img;
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

        //Add the event listener to the div to display the modal
        divContainer.onclick = function () {
          displayModal(movieObj);
        };

        moviesContainer.appendChild(divContainer);

        movie.continue();
      }
    };
  }

  //Displays the modal
  function displayModal(movie) {
    const cancelxModalBtn = document.querySelector(".cancel-btn");
    const buttonModalSection = document.querySelector("#button-section");
    const { id, title, overview, img } = movie;

    //Add the cancel function for the 'x' btn in the modal
    cancelxModalBtn.addEventListener("click", hideModal);

    const modalImgDiv = document.querySelector("#modal-img");
    //Check if there is a previous img
    if (modalImgDiv.firstChild) {
      modalImgDiv.firstChild.remove();
    }
    const modalImg = document.createElement("img");
    modalImg.classList.add("rounded-lg", "shadow-lg");
    modalImg.src = img;
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
    const deleteModalBtn = document.createElement("button");
    deleteModalBtn.innerHTML = "Delete movie";
    deleteModalBtn.classList.add(
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

    //Add the listener for the delete button
    deleteModalBtn.onclick = function () {
      deleteMovie(id);
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
    //Add the listener for the cancel btn
    cancelModalBtn.onclick = function () {
      hideModal();
    };

    buttonModalSection.appendChild(deleteModalBtn);
    buttonModalSection.appendChild(cancelModalBtn);
  }

  //Deletes the movie from the indexedDB based in ID
  function deleteMovie(id) {
    const transaction = DB.transaction(["movies"], "readwrite");
    const objectStore = transaction.objectStore("movies");
    objectStore.delete(Number(id));

    transaction.oncomplete = function () {
      //Hide the modal once is deleted and print the movies again
      hideModal();
      printMovies();
    };
    transaction.onerror = function () {
      console.log("there was an error");
    };
  }

  //Hides the modal
  function hideModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  //Clean the HTML ref passed
  function cleanHTML(ref) {
    while (ref.firstChild) {
      ref.firstChild.remove();
    }
  }
})();
