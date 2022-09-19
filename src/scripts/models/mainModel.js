import CurrentWeather from "./currentWeather";
import ForecastWeather from "./forecastWeather";
import CityInfo from "./cityInfo";
import APIs from "./APIs";

export default class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new APIs();
  }

  async getCityInfo(city, unit) {
    const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
    const cityInfo = new CityInfo(ApiData);
    return cityInfo;
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new CurrentWeather(currentWeatherData, unit);
    return currentWeather;
  }

  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new ForecastWeather(forecastWeatherData, unit);
    return forecastWeather;
  }
}
