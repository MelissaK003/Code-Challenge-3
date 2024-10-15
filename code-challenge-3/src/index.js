// Your code here
function displayMovieDetails(movie) {
    //Retrieving HTML elements by ID to be easily manipilated here in js
    document.getElementById('poster').src = movie.poster; //specifies path to image file
    document.getElementById('poster').alt = movie.title; // in the event it is not possible to display the image, the movie title shall be displayed instead
    document.getElementById('title').innerText = movie.title; //specifies path to movie title
    document.getElementById('runtime').innerText = `${movie.runtime} minutes`; //specifies path to movie runtime and add the the text 'minutes' to communicate better
    document.getElementById('film-info').innerText = movie.description; //specifies path to display movie description
    document.getElementById('showtime').innerText = movie.showtime; //specifies path to film show time
    
    const availableTickets = movie.capacity - movie.tickets_sold; //Simple math formula used to calculate number of tickets available
    document.getElementById('ticket-num').innerText = availableTickets; //displays number of tickets available
  
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.disabled = availableTickets === 0; // if there are no available tickets to purchase, the button to buy ticket shall be disabled
    buyTicketButton.textContent = availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'; //if there are available tickets, the button shall display the option of buy tickets
  

    //the function below updates the number of available tickets after a ticket has been bought for a specific movie
    buyTicketButton.onclick = () => {
      if (availableTickets > 0) {
        updateTicketSold(movie.id, movie.tickets_sold + 1);
      }
    };
  }
//GET REQUEST
// Function to fetch all movies and populate the list
function fetchMovies() {
    fetch('http://localhost:3000/films') //Initiates the GET Request for the URL retrieving film data
      .then(response => response.json()) //converts response to json
      .then(movies => { //we have created a new array called movies
        const filmsList = document.getElementById('films'); //creates a new variable name that specifies path to the list retrieved from HTML
        filmsList.innerHTML = ''; // clears all the existing data in the filmlist
        movies.forEach(movie => {
          const li = document.createElement('li'); //We have created a new variable called li that displays a list 
          li.className = 'film item';
          li.innerText = movie.title;
          const deletebutton = document.createElement('button') //we have created a new variable called deletebutton whiich is button key
          deletebutton.innerText = 'X'
          deletebutton.onclick = () => deleteFilm(movie.id, li);
        
          li.appendChild(deletebutton) //add the delete button to every movie title
          li.addEventListener('click', () => displayMovieDetails(movie));
          filmsList.appendChild(li); // add the list of all movie titles
        });
    
        displayMovieDetails(movies[0]); // Display the first movie's details by default
      })
      
  }
  //PATCH REQUEST
 // Function to update the number of tickets sold
 function updateTicketSold(movieId, newTicketsSold) {
    fetch(`http://localhost:3000/films/${movieId}`, {
    method: "PATCH", // for updating a part of file
    headers: { // this in informs the server the format of content we are sending and the format of content we accept
    "Content-Type": "application/json", 
    "Accept": "application/json",
    },
    body: JSON.stringify({ //converting our objects to strings acceptable to JSON
    tickets_sold: newTicketsSold
    })
    })
    .then(response => response.json())
    .then(updatedMovie => {
    console.log('Updated movie:', updatedMovie); 
    displayMovieDetails(updatedMovie); //Ensures that the updates of movie details reflect on the movie display details
    })
    }

  // Function to delete a film
function deleteFilm(movieId, listItem) {
    fetch(`http://localhost:3000/films/${movieId}`, {
    method: 'DELETE' // for deleting a movie in its entirety
    })
    .then(response => {
    if (response.ok) {
        console.log(`Deleted film with ID: ${movieId}`); //if the status from the server is okay it allows for the movie to be deleted 
    listItem.remove();
    } else {
    console.error('Failed to delete film:', response.status); //in the event that the status of code in the server is not okay it shall send this message informing us it wa unsuccessful
    }
    })
    }

  document.addEventListener('DOMContentLoaded', fetchMovies); //Fetches all movies when the page is loaded

 





