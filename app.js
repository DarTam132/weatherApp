const apiID = "abb412a4c111804415d00ee669c4e5de";
const city = document.querySelector(".city");
const time = document.querySelector(".time");
const wkDay = document.querySelector(".week-day");
const mainTemp = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-integer");
const humidity = document.querySelector(".hum-integer");
// const map = document.querySelector(".map");

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const renderMap = async () => {
  const curLoc = await getPosition();
  const { latitude: lat, longitude: lng } = curLoc.coords;
  coords = [lat, lng];
  const map = L.map("map").setView(coords, 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(coords).addTo(map);
};

window.addEventListener(
  "load",
  (wetherLocation = async () => {
    const curLoc = await getPosition();
    const { latitude: lat, longitude: lng } = curLoc.coords;

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiID}`
    );
    const res = await result.json();
    console.log(res);
    city.innerText = res.city.name;
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentTime = new Date();
    const weekday = weekdays[currentTime.getDay()];
    const hour = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    time.innerText = `${hour} : ${minutes}`;
    wkDay.innerText = weekday;

    const currentConditions = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiID}`
    );

    const curRes = await currentConditions.json();
    mainTemp.innerHTML = `<span>${Math.trunc(
      curRes.main.temp - 273.15
    )}</span><sup>o</sup>`;

    windSpeed.innerText = String(curRes.wind.speed * 3.6).substring(0, 4);
    humidity.innerText = `${curRes.main.humidity} %`;
    console.log(curRes);
    renderMap();

    return res;
  })
);

// const bos = (async () => {
//   const final = await wetherLocation();
//   // console.log(final);
// })();
