import CurrentWeather from "./currentWeather";
import APIs from "./APIs";

export default class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new APIs();
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new CurrentWeather(currentWeatherData);
    console.log(currentWeather);
  }
}
