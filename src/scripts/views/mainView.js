import CityInfoView from "./cityInfoView";
import CurrentWeatherView from "./currentWeatherView";
import ForecastWeatherView from "./forecastWeatherView";

export default class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById("city-info");
    new CityInfoView(element, cityInfo);
  }

  appendCurrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new CurrentWeatherView(element, currentWeather);
  }

  appendForecastWeather(forecastWeather) {
    const element = document.getElementById("forecast");
    new ForecastWeatherView(element, forecastWeather);
  }

  changeUnitTemp(unit) {
    if (unit === "imperial") {
      document.querySelector(".unitC").style.color = "white";
      document.querySelector(".unitF").style.color = "black";
    } else {
      document.querySelector(".unitF").style.color = "white";
      document.querySelector(".unitC").style.color = "black";
    }
  }
}
