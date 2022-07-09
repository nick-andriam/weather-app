// ----------- Defining the variables --------

let usedName = undefined;
let favorites = []

//------ Getting the locally saved locations ----------

let localFavorites = localStorage.getItem("favorites")
if (localFavorites === null || localFavorites === "") { favorites = [] }
else {
  favorites = JSON.parse(localStorage.getItem("favorites"))
}

let weather = {
  apiKey: "033b7b4476333f8426d606e31ace84c2",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=metric&appid=" +
      this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => { this.displayWeather(data), usedName = data.name });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search .search-button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// --------------- Displaying locally saved locations -----------------
function displayList() {
  favorites?.map(location => {
    createElement(location)
  })
}

// ------------------- Add to favorites -----------------------
function addToFavorite() {

  const exists = favorites.find(location => location === usedName)
  if (!exists) {
    createElement(usedName)
    favorites.push(usedName)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  } else {
    alert('Name already exists')
  }
}

function createElement(text) {
  const uuid = create_UUID()
  const rightCard = document.getElementById('right-card')
  const innerValue = document.createElement("div")
  const innerCard = document.createElement("div")
  const innerText = document.createTextNode(text)

  // Adding classes and id
  innerValue.classList.add("inner-value")
  innerValue.id = `inner-value-${uuid}`
  innerCard.id = `inner-card-${uuid}`
  innerCard.classList.add("inner-card")


  // Delete button and its function
  let deleteButton = new Image()
  deleteButton.src = "../svg/delete.svg"
  deleteButton.width = "25"
  deleteButton.height = "25"
  deleteButton.alt = "Delete Button"
  deleteButton.id = `${uuid}`
  deleteButton.classList.add("delete")

  // Function to delete a location
  deleteButton.onclick = function (e) {
    deleteFavorite(e.target.id)
  }

  // Appending child
  rightCard.appendChild(innerValue)
  innerValue.append(innerCard, deleteButton)
  innerCard.appendChild(innerText)

}



// ----------------------- Delete a favorite ----------------------

function deleteFavorite(id) {

  // Getting location name to remove from list
  const text = document.getElementById(`inner-value-${id}`).innerText

  // Getting element to remove and removing it
  const elToRemove = document.getElementById(`inner-value-${id}`)
  elToRemove.remove()


  // Finding the index of location to remove and removing location from the array
  const index = favorites.indexOf(text)
  if (index > -1) {
    favorites.splice(index, 1);
  }
  // Updating localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

document.querySelector(".favorite-button").addEventListener("click", function () {
  addToFavorite()
})

//--------------------  Creating a unique id  -------------------------
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

displayList()
weather.fetchWeather("Bangkok");

