export default class APIs {
  constructor() {
    // consider injecting the API key from a config file
    this.urlGenerator = new UrlGenerator("e52320b984040185e6040a1e67f254e0");
  }

  // eslint-disable-next-line class-methods-use-this
  async getGeoCoordinates(city) {
    const url = this.urlGenerator.generateGeoCoordsUrl(city);

    // TODO: any idea how we can refactor these lines (see below) to avoid code duplication?
    const response = await fetch(url, { mode: "cors" });
    const geocodingData = await response.json();

    const { lat, lon } = geocodingData[0];

    return { lat, lon };
  }

  async getCurrentWeatherData(city, unit) {
    const { lat, lon } = await this.getGeoCoordinates(city);
    // TODO: encapsulate these url templates inside the UrlGenerator class (see example above)
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e52320b984040185e6040a1e67f254e0&units=${unit}`;
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    return weatherData;
  }

  async getForecastWeatherData(city, unit) {
    const { lat, lon } = await this.getGeoCoordinates(city);
    // TODO: encapsulate these url templates inside the UrlGenerator class (see example above)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=e52320b984040185e6040a1e67f254e0&units=${unit}`;
    const response = await fetch(url, { mode: "cors" });
    const forecastData = await response.json();
    return forecastData;
  }
}

/**
 * Responsible for generating resource URLs against the constant base URL and a given API key.
 * Generating URLs is a separate responsibility that should be kept outside of the APIs class.
 */
class UrlGenerator
{
  constructor(appId)
  {
    this.baseUrl = "https://api.openweathermap.org";
    this.appId = appId;
  }

  generateGeoCoordsUrl(city)
  {
    return `${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.appId}`;
  }

  // TODO: create methods for other URLs
}