export default class MainModel {
  constructor() {}

  // eslint-disable-next-line class-methods-use-this
  async getGeoCoordinates(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&APPID=e52320b984040185e6040a1e67f254e0`;
    const response = await fetch(url, { mode: "cors" });
    const geocodingData = await response.json();

    const { lat, lon } = geocodingData[0];

    return { lat, lon };
  }

  async getWeatherData(city, unit) {
    const { lat, lon } = await this.getGeoCoordinates(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e52320b984040185e6040a1e67f254e0&units=${unit}`;
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
  }
}
