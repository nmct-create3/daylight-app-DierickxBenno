let data, timeSunrise, timeSunset, totalMinutes, minutesSunUp;

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = "0" + date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ":" + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function (percentage) {
  let minutesLeftHtml = document.querySelector(".js-time-left");

  let minutesLeft = totalMinutes - minutesSunUp;
  console.log(minutesLeft);
  if (minutesLeft < 0) {
    minutesLeft = 0;
  }
  minutesLeftHtml.innerHTML = `${Math.round(minutesLeft)} minutes`;

  console.log("updateSun", percentage);
  // <span class="c-horizon__sun js-sun" data-time="19:01" style="bottom: 5%; left: 90%;">
  const vertical = -0.5 * percentage ** 2 + 24 * percentage - 32;
  // const vertical = 85;
  console.log("vertical: ", vertical);
  const horizontal = percentage;
  const currentTime = new Date().getTime() / 1000;
  const sun = document.querySelector(".js-sun");
  sun.style.bottom = `${vertical}%`;
  sun.style.left = `${horizontal}%`;
  const currentValueDateTime = sun.getAttribute("data-time");
  sun.setAttribute(
    "data-time",
    _parseMillisecondsIntoReadableTime(currentTime)
  );
  console.log("sunUpdated ", _parseMillisecondsIntoReadableTime(currentTime));
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  const currentTime = new Date().getTime() / 1000;
  minutesSunUp = (currentTime - sunrise) / 60;
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  const percentage = currentTime / 60000 / totalMinutes;
  updateSun(percentage);
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  document.querySelector("body").classList.add("is-loaded");
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  setInterval(function () {
    updateSun(percentage);
    if (currentTime < timeSunrise || currentTime > timeSunset) {
      document.querySelector("html").classList.add("is-night");
      document.querySelector("html").classList.remove("is-day");
    } else {
      document.querySelector("html").classList.add("is-day");
      document.querySelector("html").classList.remove("is-night");
    }
  }, 60000);

  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};
// 3 Met de data van de API kunnen we de app opvullen

let showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  const stad = queryResponse.city.name;
  const land = queryResponse.city.country;
  document.querySelector(".js-location").innerHTML = `${stad}, ${land}`;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  const timeSunrise = queryResponse.city.sunrise;
  const timeSunset = queryResponse.city.sunset;

  document.querySelector(".js-sunrise").innerHTML =
    _parseMillisecondsIntoReadableTime(timeSunrise);
  document.querySelector(".js-sunset").innerHTML =
    _parseMillisecondsIntoReadableTime(timeSunset);
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  totalMinutes = (timeSunset - timeSunrise) / 60;
  //   console.log(totalMinutes);
  placeSunAndStartMoving(totalMinutes, timeSunrise);
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5657a345f2f6699b3b83b37b31468e98&units=metric&lang=nl&cnt=1`;
  // Met de fetch API proberen we de data op te halen.
  data = await getData(url);
  console.log(data);
  // Als dat gelukt is, gaan we naar onze showResult functie.
  showResult(data);
};

const getData = (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

document.addEventListener("DOMContentLoaded", function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.861701, 4.512677);
});

// const
