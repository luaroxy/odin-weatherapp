export default class APIs {
  constructor() {
    this.urlGenerator = new UrlGenerator("e52320b984040185e6040a1e67f254e0");
  }

  async getGeoCoordinates(city) {
    try {
      const url = this.urlGenerator.generateGeoCoordsUrl(city);
      const response = await fetch(url, { mode: "cors" });
      const geocodingData = await response.json();
      const { lat, lon } = geocodingData[0];
      document.getElementById("error").style.display = "none";
      return { lat, lon };
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }

  async getCurrentWeatherData(city, unit) {
    try {
      const { lat, lon } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateCurrentWeatherUrl(lat, lon, unit);
      const response = await fetch(url, { mode: "cors" });
      const weatherData = await response.json();
      document.getElementById("error").style.display = "none";
      return weatherData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }

  async getForecastWeatherData(city, unit) {
    try {
      const { lat, lon } = await this.getGeoCoordinates(city);
      const url = this.urlGenerator.generateForecastWeatherUrl(lat, lon, unit);
      const response = await fetch(url, { mode: "cors" });
      const forecastData = await response.json();
      document.getElementById("error").style.display = "none";
      return forecastData;
    } catch (err) {
      console.log(err);
      document.getElementById("error").style.display = "block";
      return null;
    }
  }
}

class UrlGenerator {
  constructor(appId) {
    this.baseUrl = "https://api.openweathermap.org";
    this.appId = appId;
  }

  generateGeoCoordsUrl(city) {
    return `${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.appId}`;
  }

  generateCurrentWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.appId}&units=${unit}`;
  }

  generateForecastWeatherUrl(lat, lon, unit) {
    return `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=${this.appId}&units=${unit}`;
  }
}
