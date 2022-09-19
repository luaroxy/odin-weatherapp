/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/controllers/mainController.js":
/*!***************************************************!*\
  !*** ./src/scripts/controllers/mainController.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainController)
/* harmony export */ });
class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    window.addEventListener("load", () => this.callFunc());
  }

  async callFunc() {
    const cityInfo = await this.model.getCityInfo("Regina", "metric");
    const currentWeather = await this.model.getCurrentWeather("Regina", "metric");
    const forecastWeather = await this.model.getForecastWeather("Regina", "metric");
    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }

}

/***/ }),

/***/ "./src/scripts/models/APIs.js":
/*!************************************!*\
  !*** ./src/scripts/models/APIs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ APIs)
/* harmony export */ });
class APIs {
  constructor() {
    this.urlGenerator = new UrlGenerator("e52320b984040185e6040a1e67f254e0");
  }

  async getGeoCoordinates(city) {
    const url = this.urlGenerator.generateGeoCoordsUrl(city);
    const response = await fetch(url, {
      mode: "cors"
    });
    const geocodingData = await response.json();
    const {
      lat,
      lon
    } = geocodingData[0];
    return {
      lat,
      lon
    };
  }

  async getCurrentWeatherData(city, unit) {
    const {
      lat,
      lon
    } = await this.getGeoCoordinates(city);
    const url = this.urlGenerator.generateCurrentWeatherUrl(lat, lon, unit);
    const response = await fetch(url, {
      mode: "cors"
    });
    const weatherData = await response.json();
    return weatherData;
  }

  async getForecastWeatherData(city, unit) {
    const {
      lat,
      lon
    } = await this.getGeoCoordinates(city);
    const url = this.urlGenerator.generateForecastWeatherUrl(lat, lon, unit);
    const response = await fetch(url, {
      mode: "cors"
    });
    const forecastData = await response.json();
    return forecastData;
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

/***/ }),

/***/ "./src/scripts/models/cityInfo.js":
/*!****************************************!*\
  !*** ./src/scripts/models/cityInfo.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfo)
/* harmony export */ });
class CityInfo {
  constructor(ApiData) {
    this.cityDescription = this.createCityDescription(ApiData);
    this.dateDescription = this.createDateDescription(ApiData);
  }

  createCityDescription(ApiData) {
    const city = ApiData.name;
    const {
      country
    } = ApiData.sys;
    return `${city}, ${country}`;
  }

  createDateDescription(ApiData) {
    const day = this.getDay();
    const month = this.getMonth();
    const date = this.getDate();
    return `${day}, ${month} ${date}`;
  }

  getDay() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = weekday[d.getDay()];
    return day;
  }

  getMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month = monthNames[d.getMonth()];
    return month;
  }

  getDate() {
    const d = new Date();
    const date = d.getDate();
    return date;
  }

}

/***/ }),

/***/ "./src/scripts/models/currentWeather.js":
/*!**********************************************!*\
  !*** ./src/scripts/models/currentWeather.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeather)
/* harmony export */ });
class CurrentWeather {
  constructor(currentWeatherData, unit) {
    this.temperature = this.getTemperature(Math.round(currentWeatherData.main.temp), unit);
    this.feelsLikeTemp = this.getTemperature(Math.round(currentWeatherData.main.feels_like), unit);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = this.getWeatherConditionImg(currentWeatherData.weather[0].main, currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone);
  }

  getTemperature(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }

  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = unixTime === 0 ? new Date() : new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const dateInSearchedCity = this.convertToSearchedCityDate(unixTime, timezone);
    const hours = dateInSearchedCity.getHours();
    const minutes = `0${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
  }

  getWeatherConditionImg(value, sunriseUnix, sunsetUnix, timezone) {
    if (value === "Drizzle") return "Rain";
    const mistEquivalentes = ["Smoke", "Haze", "Dust", "Fog", "Sand", "Dust", "Ash", "Squall", "Tornado"];
    if (mistEquivalentes.includes(value)) return "Mist";
    if (value !== "Clear") return value;
    const currentDate = this.convertToSearchedCityDate(0, timezone);
    const sunriseDate = this.convertToSearchedCityDate(sunriseUnix, timezone);
    const sunsetDate = this.convertToSearchedCityDate(sunsetUnix, timezone);
    return currentDate > sunriseDate && currentDate < sunsetDate ? `${value}Day` : `${value}Night`;
  }

}

/***/ }),

/***/ "./src/scripts/models/forecastWeather.js":
/*!***********************************************!*\
  !*** ./src/scripts/models/forecastWeather.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForecastWeather)
/* harmony export */ });
class ForecastWeather {
  constructor(forecastWeatherData, unit) {
    this.temperatures = this.getTemperatures(forecastWeatherData, unit);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
    this.time = this.getTimes(forecastWeatherData);
  }

  getTemperatures(forecastWeatherData, unit) {
    const temperatures = [];
    forecastWeatherData.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      const tempWithUnit = this.getTemperatureUnit(temp, unit);
      temperatures.push(tempWithUnit);
    });
    return temperatures;
  }

  getTemperatureUnit(degree, unit) {
    return unit === "metric" ? `${degree}℃` : `${degree}℉`;
  }

  convertToSearchedCityDate(unixTime, timezone) {
    const localDate = unixTime === 0 ? new Date() : new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    return dateInSearchedCity;
  }

  getWeatherConditionImg(value, sunriseUnix, sunsetUnix, timezone) {
    if (value !== "Clear") return value;
    const currentDate = this.convertToSearchedCityDate(0, timezone);
    const sunriseDate = this.convertToSearchedCityDate(sunriseUnix, timezone);
    const sunsetDate = this.convertToSearchedCityDate(sunsetUnix, timezone);
    return currentDate > sunriseDate && currentDate < sunsetDate ? `${value}Day` : `${value}Night`;
  }

  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    const sunriseUnix = forecastWeatherData.city.sunrise;
    const sunsetUnix = forecastWeatherData.city.sunset;
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const cond = this.getWeatherConditionImg(item.weather[0].main, sunriseUnix, sunsetUnix, timezone);
      weatherCondition.push(cond);
    });
    return weatherCondition;
  }

  getTimes(forecastWeatherData) {
    const times = [];
    const {
      timezone
    } = forecastWeatherData.city;
    forecastWeatherData.list.forEach(item => {
      const time = this.convertToSearchedCityTime(item, timezone);
      times.push(time);
    });
    return times;
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const localDate = new Date(unixTime.dt * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    const hours = dateInSearchedCity.getHours();
    const time = `${hours}:00`;
    return time;
  }

}

/***/ }),

/***/ "./src/scripts/models/mainModel.js":
/*!*****************************************!*\
  !*** ./src/scripts/models/mainModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainModel)
/* harmony export */ });
/* harmony import */ var _currentWeather__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./currentWeather */ "./src/scripts/models/currentWeather.js");
/* harmony import */ var _forecastWeather__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forecastWeather */ "./src/scripts/models/forecastWeather.js");
/* harmony import */ var _cityInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cityInfo */ "./src/scripts/models/cityInfo.js");
/* harmony import */ var _APIs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./APIs */ "./src/scripts/models/APIs.js");




class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new _APIs__WEBPACK_IMPORTED_MODULE_3__["default"]();
  }

  async getCityInfo(city, unit) {
    const ApiData = await this.APIs.getCurrentWeatherData(city, unit);
    const cityInfo = new _cityInfo__WEBPACK_IMPORTED_MODULE_2__["default"](ApiData);
    return cityInfo;
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new _currentWeather__WEBPACK_IMPORTED_MODULE_0__["default"](currentWeatherData, unit);
    return currentWeather;
  }

  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new _forecastWeather__WEBPACK_IMPORTED_MODULE_1__["default"](forecastWeatherData, unit);
    return forecastWeather;
  }

}

/***/ }),

/***/ "./src/scripts/views/cityInfoView.js":
/*!*******************************************!*\
  !*** ./src/scripts/views/cityInfoView.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CityInfoView)
/* harmony export */ });
class CityInfoView {
  constructor(element, cityInfoModel) {
    this.element = element;
    this.model = cityInfoModel;
    this.city = cityInfoModel.cityDescription;
    this.date = cityInfoModel.dateDescription;
  }

  get city() {
    return this.element.querySelector("h1");
  }

  set city(value) {
    this.city.textContent = value;
  }

  get date() {
    return this.element.querySelector("h2");
  }

  set date(value) {
    this.date.textContent = value;
  }

}

/***/ }),

/***/ "./src/scripts/views/currentWeatherView.js":
/*!*************************************************!*\
  !*** ./src/scripts/views/currentWeatherView.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CurrentWeatherView)
/* harmony export */ });
class CurrentWeatherView {
  constructor(element, currentWeatherModel) {
    this.element = element;
    this.model = currentWeatherModel;
    this.weatherConditionImg = currentWeatherModel.weatherConditionImg;
    this.temperature = currentWeatherModel.temperature;
    this.weatherConditionDesc = currentWeatherModel.weatherConditionDesc;
    this.feelsLikeTemp = currentWeatherModel.feelsLikeTemp;
    this.sunrise = currentWeatherModel.sunrise;
    this.sunset = currentWeatherModel.sunset;
    this.humidity = currentWeatherModel.humidity;
    this.windSpeed = currentWeatherModel.windSpeed;
    this.pressure = currentWeatherModel.pressure;
    this.nowWeatherCondition = currentWeatherModel.weatherConditionImg;
    this.nowTemperature = currentWeatherModel.temperature;
  }

  get weatherConditionImg() {
    return this.element.querySelector("img");
  }

  set weatherConditionImg(value) {
    this.weatherConditionImg.src = `images/${value}.png`;
  }

  get temperature() {
    return this.element.querySelector("h1");
  }

  set temperature(value) {
    this.temperature.textContent = value;
  }

  get weatherConditionDesc() {
    return this.element.querySelector("h2");
  }

  set weatherConditionDesc(value) {
    this.weatherConditionDesc.textContent = value;
  }

  get feelsLikeTemp() {
    return this.element.querySelector(".feels-like");
  }

  set feelsLikeTemp(value) {
    this.feelsLikeTemp.textContent = value;
  }

  get sunrise() {
    return this.element.querySelector(".sunrise");
  }

  set sunrise(value) {
    this.sunrise.textContent = value;
  }

  get sunset() {
    return this.element.querySelector(".sunset");
  }

  set sunset(value) {
    this.sunset.textContent = value;
  }

  get humidity() {
    return this.element.querySelector(".humidity");
  }

  set humidity(value) {
    this.humidity.textContent = value;
  }

  get windSpeed() {
    return this.element.querySelector(".wind-speed");
  }

  set windSpeed(value) {
    this.windSpeed.textContent = value;
  }

  get pressure() {
    return this.element.querySelector(".pressure");
  }

  set pressure(value) {
    this.pressure.textContent = value;
  }

  get nowWeatherCondition() {
    return document.getElementById("forecast__item__current-condition");
  }

  set nowWeatherCondition(value) {
    this.nowWeatherCondition.src = `images/${value}.png`;
  }

  get nowTemperature() {
    return document.getElementById("forecast__item__curent-temp");
  }

  set nowTemperature(value) {
    this.nowTemperature.textContent = value;
  }

}

/***/ }),

/***/ "./src/scripts/views/forecastWeatherView.js":
/*!**************************************************!*\
  !*** ./src/scripts/views/forecastWeatherView.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ forecastWeatherView)
/* harmony export */ });
class forecastWeatherView {
  constructor(element, forecastWeatherModel) {
    this.element = element;
    this.model = forecastWeatherModel;
    this.time = forecastWeatherModel.time;
    this.weatherCondition = forecastWeatherModel.weatherCondition;
    this.temperatures = forecastWeatherModel.temperatures;
  }

  get time() {
    return this.element.querySelectorAll(".forecast__item__time");
  }

  set time(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.time[i].textContent = value[i];
    }
  }

  get weatherCondition() {
    return this.element.querySelectorAll("img");
  }

  set weatherCondition(value) {
    for (let i = 1; i < this.weatherCondition.length; i++) {
      this.weatherCondition[i].src = `images/${value[i - 1]}.png`;
    }
  }

  get temperatures() {
    return this.element.querySelectorAll(".forecast__item__temperature");
  }

  set temperatures(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.temperatures[i].textContent = value[i];
    }
  }

}

/***/ }),

/***/ "./src/scripts/views/mainView.js":
/*!***************************************!*\
  !*** ./src/scripts/views/mainView.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainView)
/* harmony export */ });
/* harmony import */ var _cityInfoView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cityInfoView */ "./src/scripts/views/cityInfoView.js");
/* harmony import */ var _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currentWeatherView */ "./src/scripts/views/currentWeatherView.js");
/* harmony import */ var _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./forecastWeatherView */ "./src/scripts/views/forecastWeatherView.js");



class MainView {
  appendCityInfo(cityInfo) {
    const element = document.getElementById("city-info");
    new _cityInfoView__WEBPACK_IMPORTED_MODULE_0__["default"](element, cityInfo);
  }

  appendCurrentWeather(currentWeather) {
    const element = document.getElementById("current-weather");
    new _currentWeatherView__WEBPACK_IMPORTED_MODULE_1__["default"](element, currentWeather);
  }

  appendForecastWeather(forecastWeather) {
    const element = document.getElementById("forecast");
    new _forecastWeatherView__WEBPACK_IMPORTED_MODULE_2__["default"](element, forecastWeather);
  }

}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../images/magnify.png */ "./src/images/magnify.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n", "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAEA;EACE,+BAA+B;EAC/B,gDAAgD;EAChD,mCAAmC;EACnC,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;EACb,aAAa;AACf;;AAEA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,oCAAoC;EACpC,8BAA8B;EAC9B,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,6BAA6B;EAC7B,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,uBAAuB;AACzB;;AAEA;EACE,UAAU;EACV,4BAA4B;EAC5B,mBAAmB;EACnB,YAAY;EACZ,yDAA4C;EAC5C,4BAA4B;EAC5B,gCAAgC;EAChC,mCAAmC;EACnC,uBAAuB;AACzB;;AAEA;EACE,gBAAgB;EAChB,sBAAsB;EACtB,0BAA0B;EAC1B,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;EAChB,eAAe;EACf,0BAA0B;AAC5B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;EAClB,SAAS;EACT,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,WAAW;EACX,eAAe;AACjB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,WAAW;EACX,kBAAkB;EAClB,qBAAqB;EACrB,2CAA2C;AAC7C;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB","sourcesContent":["@import url(./normalize.css);\n\n:root {\n  --clr-neutral: hsl(0, 0%, 100%);\n  --clr-neutral-transp: rgba(255, 255, 255, 0.171);\n  --ff-primary: \"Poppins\", sans-serif;\n  --fw-300: 300;\n  --fw-400: 400;\n  --fw-500: 500;\n  --fw-600: 600;\n  --fw-700: 700;\n}\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  width: 100vw;\n  min-height: 100vh;\n  background-color: rgb(212, 207, 207);\n  font-family: var(--ff-primary);\n  color: var(--clr-neutral);\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  width: 100vw;\n  min-height: 100vh;\n  padding: 4rem 2rem;\n}\n\n.search-wrapper {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n\n.search-wrapper input {\n  width: 40%;\n  padding: 10px 10px 10px 40px;\n  border-radius: 2rem;\n  border: none;\n  background-image: url(../images/magnify.png);\n  background-repeat: no-repeat;\n  background-position: 10px center;\n  background-size: calc(1rem + 0.5vw);\n  background-color: white;\n}\n\n.city-info h1 {\n  margin: 0.3rem 0;\n  letter-spacing: 0.1rem;\n  font-weight: var(--fw-600);\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 1.1rem;\n  font-weight: var(--fw-300);\n}\n\n.current-weather {\n  display: flex;\n  justify-content: space-around;\n}\n\n.current-weather_cointainer {\n  display: flex;\n}\n\n.current-weather_cointainer img {\n  width: calc(10rem + 10vw);\n}\n\n.current-weather_cointainer h1 {\n  margin: 0.3rem 0;\n  font-size: 4rem;\n  font-weight: var(--fw-400);\n}\n\n.current-weather_temp {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n.current-weather__details {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  height: max-content;\n  padding: 2rem 4rem;\n  gap: 4rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.current-weather__item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n}\n\n.current-weather__item img {\n  width: calc(1rem + 1vw);\n}\n\n.current-weather__details__column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.forecast {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding: 1rem 2rem;\n  border-radius: 0.5rem;\n  background-color: var(--clr-neutral-transp);\n}\n\n.forecast__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.forecast__item img {\n  width: calc(2rem + 3vw);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/normalize.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n html {\n    line-height: 1.15; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  \n  /* Sections\n     ========================================================================== */\n  \n  /**\n   * Remove the margin in all browsers.\n   */\n  \n  body {\n    margin: 0;\n  }\n  \n  /**\n   * Render the `main` element consistently in IE.\n   */\n  \n  main {\n    display: block;\n  }\n  \n  /**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\n  \n  h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n  \n  /* Grouping content\n     ========================================================================== */\n  \n  /**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\n  \n  hr {\n    box-sizing: content-box; /* 1 */\n    height: 0; /* 1 */\n    overflow: visible; /* 2 */\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  pre {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /* Text-level semantics\n     ========================================================================== */\n  \n  /**\n   * Remove the gray background on active links in IE 10.\n   */\n  \n  a {\n    background-color: transparent;\n  }\n  \n  /**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\n  \n  abbr[title] {\n    border-bottom: none; /* 1 */\n    text-decoration: underline; /* 2 */\n    text-decoration: underline dotted; /* 2 */\n  }\n  \n  /**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\n  \n  b,\n  strong {\n    font-weight: bolder;\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  code,\n  kbd,\n  samp {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /**\n   * Add the correct font size in all browsers.\n   */\n  \n  small {\n    font-size: 80%;\n  }\n  \n  /**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\n  \n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n  \n  sub {\n    bottom: -0.25em;\n  }\n  \n  sup {\n    top: -0.5em;\n  }\n  \n  /* Embedded content\n     ========================================================================== */\n  \n  /**\n   * Remove the border on images inside links in IE 10.\n   */\n  \n  img {\n    border-style: none;\n  }\n  \n  /* Forms\n     ========================================================================== */\n  \n  /**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\n  \n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 1 */\n    line-height: 1.15; /* 1 */\n    margin: 0; /* 2 */\n  }\n  \n  /**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\n  \n  button,\n  input { /* 1 */\n    overflow: visible;\n  }\n  \n  /**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\n  \n  button,\n  select { /* 1 */\n    text-transform: none;\n  }\n  \n  /**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\n  \n  button,\n  [type=\"button\"],\n  [type=\"reset\"],\n  [type=\"submit\"] {\n    -webkit-appearance: button;\n  }\n  \n  /**\n   * Remove the inner border and padding in Firefox.\n   */\n  \n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n  }\n  \n  /**\n   * Restore the focus styles unset by the previous rule.\n   */\n  \n  button:-moz-focusring,\n  [type=\"button\"]:-moz-focusring,\n  [type=\"reset\"]:-moz-focusring,\n  [type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n  }\n  \n  /**\n   * Correct the padding in Firefox.\n   */\n  \n  fieldset {\n    padding: 0.35em 0.75em 0.625em;\n  }\n  \n  /**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\n  \n  legend {\n    box-sizing: border-box; /* 1 */\n    color: inherit; /* 2 */\n    display: table; /* 1 */\n    max-width: 100%; /* 1 */\n    padding: 0; /* 3 */\n    white-space: normal; /* 1 */\n  }\n  \n  /**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\n  \n  progress {\n    vertical-align: baseline;\n  }\n  \n  /**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\n  \n  textarea {\n    overflow: auto;\n  }\n  \n  /**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n  \n  [type=\"checkbox\"],\n  [type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n  }\n  \n  /**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n  \n  [type=\"number\"]::-webkit-inner-spin-button,\n  [type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n  }\n  \n  /**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n  \n  [type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    outline-offset: -2px; /* 2 */\n  }\n  \n  /**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n  \n  [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n  \n  /**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n  \n  ::-webkit-file-upload-button {\n    -webkit-appearance: button; /* 1 */\n    font: inherit; /* 2 */\n  }\n  \n  /* Interactive\n     ========================================================================== */\n  \n  /*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\n  \n  details {\n    display: block;\n  }\n  \n  /*\n   * Add the correct display in all browsers.\n   */\n  \n  summary {\n    display: list-item;\n  }\n  \n  /* Misc\n     ========================================================================== */\n  \n  /**\n   * Add the correct display in IE 10+.\n   */\n  \n  template {\n    display: none;\n  }\n  \n  /**\n   * Add the correct display in IE 10.\n   */\n  \n  [hidden] {\n    display: none;\n  }", "",{"version":3,"sources":["webpack://./src/styles/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;CAED;IACG,iBAAiB,EAAE,MAAM;IACzB,8BAA8B,EAAE,MAAM;EACxC;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,SAAS;EACX;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;IACE,cAAc;IACd,gBAAgB;EAClB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;IACE,uBAAuB,EAAE,MAAM;IAC/B,SAAS,EAAE,MAAM;IACjB,iBAAiB,EAAE,MAAM;EAC3B;;EAEA;;;IAGE;;EAEF;IACE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,6BAA6B;EAC/B;;EAEA;;;IAGE;;EAEF;IACE,mBAAmB,EAAE,MAAM;IAC3B,0BAA0B,EAAE,MAAM;IAClC,iCAAiC,EAAE,MAAM;EAC3C;;EAEA;;IAEE;;EAEF;;IAEE,mBAAmB;EACrB;;EAEA;;;IAGE;;EAEF;;;IAGE,iCAAiC,EAAE,MAAM;IACzC,cAAc,EAAE,MAAM;EACxB;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,wBAAwB;EAC1B;;EAEA;IACE,eAAe;EACjB;;EAEA;IACE,WAAW;EACb;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;;IAGE;;EAEF;;;;;IAKE,oBAAoB,EAAE,MAAM;IAC5B,eAAe,EAAE,MAAM;IACvB,iBAAiB,EAAE,MAAM;IACzB,SAAS,EAAE,MAAM;EACnB;;EAEA;;;IAGE;;EAEF;UACQ,MAAM;IACZ,iBAAiB;EACnB;;EAEA;;;IAGE;;EAEF;WACS,MAAM;IACb,oBAAoB;EACtB;;EAEA;;IAEE;;EAEF;;;;IAIE,0BAA0B;EAC5B;;EAEA;;IAEE;;EAEF;;;;IAIE,kBAAkB;IAClB,UAAU;EACZ;;EAEA;;IAEE;;EAEF;;;;IAIE,8BAA8B;EAChC;;EAEA;;IAEE;;EAEF;IACE,8BAA8B;EAChC;;EAEA;;;;;IAKE;;EAEF;IACE,sBAAsB,EAAE,MAAM;IAC9B,cAAc,EAAE,MAAM;IACtB,cAAc,EAAE,MAAM;IACtB,eAAe,EAAE,MAAM;IACvB,UAAU,EAAE,MAAM;IAClB,mBAAmB,EAAE,MAAM;EAC7B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;;IAGE;;EAEF;;IAEE,sBAAsB,EAAE,MAAM;IAC9B,UAAU,EAAE,MAAM;EACpB;;EAEA;;IAEE;;EAEF;;IAEE,YAAY;EACd;;EAEA;;;IAGE;;EAEF;IACE,6BAA6B,EAAE,MAAM;IACrC,oBAAoB,EAAE,MAAM;EAC9B;;EAEA;;IAEE;;EAEF;IACE,wBAAwB;EAC1B;;EAEA;;;IAGE;;EAEF;IACE,0BAA0B,EAAE,MAAM;IAClC,aAAa,EAAE,MAAM;EACvB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,cAAc;EAChB;;EAEA;;IAEE;;EAEF;IACE,kBAAkB;EACpB;;EAEA;iFAC+E;;EAE/E;;IAEE;;EAEF;IACE,aAAa;EACf;;EAEA;;IAEE;;EAEF;IACE,aAAa;EACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n html {\n    line-height: 1.15; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  \n  /* Sections\n     ========================================================================== */\n  \n  /**\n   * Remove the margin in all browsers.\n   */\n  \n  body {\n    margin: 0;\n  }\n  \n  /**\n   * Render the `main` element consistently in IE.\n   */\n  \n  main {\n    display: block;\n  }\n  \n  /**\n   * Correct the font size and margin on `h1` elements within `section` and\n   * `article` contexts in Chrome, Firefox, and Safari.\n   */\n  \n  h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n  \n  /* Grouping content\n     ========================================================================== */\n  \n  /**\n   * 1. Add the correct box sizing in Firefox.\n   * 2. Show the overflow in Edge and IE.\n   */\n  \n  hr {\n    box-sizing: content-box; /* 1 */\n    height: 0; /* 1 */\n    overflow: visible; /* 2 */\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  pre {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /* Text-level semantics\n     ========================================================================== */\n  \n  /**\n   * Remove the gray background on active links in IE 10.\n   */\n  \n  a {\n    background-color: transparent;\n  }\n  \n  /**\n   * 1. Remove the bottom border in Chrome 57-\n   * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n   */\n  \n  abbr[title] {\n    border-bottom: none; /* 1 */\n    text-decoration: underline; /* 2 */\n    text-decoration: underline dotted; /* 2 */\n  }\n  \n  /**\n   * Add the correct font weight in Chrome, Edge, and Safari.\n   */\n  \n  b,\n  strong {\n    font-weight: bolder;\n  }\n  \n  /**\n   * 1. Correct the inheritance and scaling of font size in all browsers.\n   * 2. Correct the odd `em` font sizing in all browsers.\n   */\n  \n  code,\n  kbd,\n  samp {\n    font-family: monospace, monospace; /* 1 */\n    font-size: 1em; /* 2 */\n  }\n  \n  /**\n   * Add the correct font size in all browsers.\n   */\n  \n  small {\n    font-size: 80%;\n  }\n  \n  /**\n   * Prevent `sub` and `sup` elements from affecting the line height in\n   * all browsers.\n   */\n  \n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n  \n  sub {\n    bottom: -0.25em;\n  }\n  \n  sup {\n    top: -0.5em;\n  }\n  \n  /* Embedded content\n     ========================================================================== */\n  \n  /**\n   * Remove the border on images inside links in IE 10.\n   */\n  \n  img {\n    border-style: none;\n  }\n  \n  /* Forms\n     ========================================================================== */\n  \n  /**\n   * 1. Change the font styles in all browsers.\n   * 2. Remove the margin in Firefox and Safari.\n   */\n  \n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 1 */\n    line-height: 1.15; /* 1 */\n    margin: 0; /* 2 */\n  }\n  \n  /**\n   * Show the overflow in IE.\n   * 1. Show the overflow in Edge.\n   */\n  \n  button,\n  input { /* 1 */\n    overflow: visible;\n  }\n  \n  /**\n   * Remove the inheritance of text transform in Edge, Firefox, and IE.\n   * 1. Remove the inheritance of text transform in Firefox.\n   */\n  \n  button,\n  select { /* 1 */\n    text-transform: none;\n  }\n  \n  /**\n   * Correct the inability to style clickable types in iOS and Safari.\n   */\n  \n  button,\n  [type=\"button\"],\n  [type=\"reset\"],\n  [type=\"submit\"] {\n    -webkit-appearance: button;\n  }\n  \n  /**\n   * Remove the inner border and padding in Firefox.\n   */\n  \n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n  }\n  \n  /**\n   * Restore the focus styles unset by the previous rule.\n   */\n  \n  button:-moz-focusring,\n  [type=\"button\"]:-moz-focusring,\n  [type=\"reset\"]:-moz-focusring,\n  [type=\"submit\"]:-moz-focusring {\n    outline: 1px dotted ButtonText;\n  }\n  \n  /**\n   * Correct the padding in Firefox.\n   */\n  \n  fieldset {\n    padding: 0.35em 0.75em 0.625em;\n  }\n  \n  /**\n   * 1. Correct the text wrapping in Edge and IE.\n   * 2. Correct the color inheritance from `fieldset` elements in IE.\n   * 3. Remove the padding so developers are not caught out when they zero out\n   *    `fieldset` elements in all browsers.\n   */\n  \n  legend {\n    box-sizing: border-box; /* 1 */\n    color: inherit; /* 2 */\n    display: table; /* 1 */\n    max-width: 100%; /* 1 */\n    padding: 0; /* 3 */\n    white-space: normal; /* 1 */\n  }\n  \n  /**\n   * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n   */\n  \n  progress {\n    vertical-align: baseline;\n  }\n  \n  /**\n   * Remove the default vertical scrollbar in IE 10+.\n   */\n  \n  textarea {\n    overflow: auto;\n  }\n  \n  /**\n   * 1. Add the correct box sizing in IE 10.\n   * 2. Remove the padding in IE 10.\n   */\n  \n  [type=\"checkbox\"],\n  [type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n  }\n  \n  /**\n   * Correct the cursor style of increment and decrement buttons in Chrome.\n   */\n  \n  [type=\"number\"]::-webkit-inner-spin-button,\n  [type=\"number\"]::-webkit-outer-spin-button {\n    height: auto;\n  }\n  \n  /**\n   * 1. Correct the odd appearance in Chrome and Safari.\n   * 2. Correct the outline style in Safari.\n   */\n  \n  [type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    outline-offset: -2px; /* 2 */\n  }\n  \n  /**\n   * Remove the inner padding in Chrome and Safari on macOS.\n   */\n  \n  [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n  \n  /**\n   * 1. Correct the inability to style clickable types in iOS and Safari.\n   * 2. Change font properties to `inherit` in Safari.\n   */\n  \n  ::-webkit-file-upload-button {\n    -webkit-appearance: button; /* 1 */\n    font: inherit; /* 2 */\n  }\n  \n  /* Interactive\n     ========================================================================== */\n  \n  /*\n   * Add the correct display in Edge, IE 10+, and Firefox.\n   */\n  \n  details {\n    display: block;\n  }\n  \n  /*\n   * Add the correct display in all browsers.\n   */\n  \n  summary {\n    display: list-item;\n  }\n  \n  /* Misc\n     ========================================================================== */\n  \n  /**\n   * Add the correct display in IE 10+.\n   */\n  \n  template {\n    display: none;\n  }\n  \n  /**\n   * Add the correct display in IE 10.\n   */\n  \n  [hidden] {\n    display: none;\n  }"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/images/magnify.png":
/*!********************************!*\
  !*** ./src/images/magnify.png ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "001051c069dde3ca2ccb.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _models_mainModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/mainModel */ "./src/scripts/models/mainModel.js");
/* harmony import */ var _views_mainView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/mainView */ "./src/scripts/views/mainView.js");
/* harmony import */ var _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controllers/mainController */ "./src/scripts/controllers/mainController.js");




const model = new _models_mainModel__WEBPACK_IMPORTED_MODULE_1__["default"]();
const view = new _views_mainView__WEBPACK_IMPORTED_MODULE_2__["default"]();
const controller = new _controllers_mainController__WEBPACK_IMPORTED_MODULE_3__["default"](model, view);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvY29udHJvbGxlcnMvbWFpbkNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL0FQSXMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2NpdHlJbmZvLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9jdXJyZW50V2VhdGhlci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvZm9yZWNhc3RXZWF0aGVyLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9tYWluTW9kZWwuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvdmlld3MvY2l0eUluZm9WaWV3LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL2N1cnJlbnRXZWF0aGVyVmlldy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9mb3JlY2FzdFdlYXRoZXJWaWV3LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL3ZpZXdzL21haW5WaWV3LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zdHlsZXMvbWFpbi5jc3MiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3N0eWxlcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc3R5bGVzL21haW4uY3NzP2U4MGEiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5Db250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IobW9kZWwsIHZpZXcpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB0aGlzLmNhbGxGdW5jKCkpO1xuICB9XG5cbiAgYXN5bmMgY2FsbEZ1bmMoKSB7XG4gICAgY29uc3QgY2l0eUluZm8gPSBhd2FpdCB0aGlzLm1vZGVsLmdldENpdHlJbmZvKFwiUmVnaW5hXCIsIFwibWV0cmljXCIpO1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihcIlJlZ2luYVwiLCBcIm1ldHJpY1wiKTtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihcIlJlZ2luYVwiLCBcIm1ldHJpY1wiKTtcblxuICAgIHRoaXMudmlldy5hcHBlbmRDaXR5SW5mbyhjaXR5SW5mbyk7XG4gICAgdGhpcy52aWV3LmFwcGVuZEN1cnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kRm9yZWNhc3RXZWF0aGVyKGZvcmVjYXN0V2VhdGhlcik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFQSXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVybEdlbmVyYXRvciA9IG5ldyBVcmxHZW5lcmF0b3IoXCJlNTIzMjBiOTg0MDQwMTg1ZTYwNDBhMWU2N2YyNTRlMFwiKTtcbiAgfVxuXG4gIGFzeW5jIGdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUdlb0Nvb3Jkc1VybChjaXR5KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcbiAgICBjb25zdCBnZW9jb2RpbmdEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gZ2VvY29kaW5nRGF0YVswXTtcblxuICAgIHJldHVybiB7IGxhdCwgbG9uIH07XG4gIH1cblxuICBhc3luYyBnZXRDdXJyZW50V2VhdGhlckRhdGEoY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IHsgbGF0LCBsb24gfSA9IGF3YWl0IHRoaXMuZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSk7XG4gICAgY29uc3QgdXJsID0gdGhpcy51cmxHZW5lcmF0b3IuZ2VuZXJhdGVDdXJyZW50V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICB9XG5cbiAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyRGF0YShjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUZvcmVjYXN0V2VhdGhlclVybChsYXQsIGxvbiwgdW5pdCk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG4gICAgY29uc3QgZm9yZWNhc3REYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBmb3JlY2FzdERhdGE7XG4gIH1cbn1cblxuY2xhc3MgVXJsR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IoYXBwSWQpIHtcbiAgICB0aGlzLmJhc2VVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xuICAgIHRoaXMuYXBwSWQgPSBhcHBJZDtcbiAgfVxuXG4gIGdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9nZW8vMS4wL2RpcmVjdD9xPSR7Y2l0eX0mYXBwaWQ9JHt0aGlzLmFwcElkfWA7XG4gIH1cblxuICBnZW5lcmF0ZUN1cnJlbnRXZWF0aGVyVXJsKGxhdCwgbG9uLCB1bml0KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcbiAgfVxuXG4gIGdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyVXJsKGxhdCwgbG9uLCB1bml0KSB7XG4gICAgcmV0dXJuIGAke3RoaXMuYmFzZVVybH0vZGF0YS8yLjUvZm9yZWNhc3Q/bGF0PSR7bGF0fSZsb249JHtsb259JmNudD04JmFwcGlkPSR7dGhpcy5hcHBJZH0mdW5pdHM9JHt1bml0fWA7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdHlJbmZvIHtcbiAgY29uc3RydWN0b3IoQXBpRGF0YSkge1xuICAgIHRoaXMuY2l0eURlc2NyaXB0aW9uID0gdGhpcy5jcmVhdGVDaXR5RGVzY3JpcHRpb24oQXBpRGF0YSk7XG4gICAgdGhpcy5kYXRlRGVzY3JpcHRpb24gPSB0aGlzLmNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKTtcbiAgfVxuXG4gIGNyZWF0ZUNpdHlEZXNjcmlwdGlvbihBcGlEYXRhKSB7XG4gICAgY29uc3QgY2l0eSA9IEFwaURhdGEubmFtZTtcbiAgICBjb25zdCB7IGNvdW50cnkgfSA9IEFwaURhdGEuc3lzO1xuICAgIHJldHVybiBgJHtjaXR5fSwgJHtjb3VudHJ5fWA7XG4gIH1cblxuICBjcmVhdGVEYXRlRGVzY3JpcHRpb24oQXBpRGF0YSkge1xuICAgIGNvbnN0IGRheSA9IHRoaXMuZ2V0RGF5KCk7XG4gICAgY29uc3QgbW9udGggPSB0aGlzLmdldE1vbnRoKCk7XG4gICAgY29uc3QgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuICAgIHJldHVybiBgJHtkYXl9LCAke21vbnRofSAke2RhdGV9YDtcbiAgfVxuXG4gIGdldERheSgpIHtcbiAgICBjb25zdCB3ZWVrZGF5ID0gW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl07XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF5ID0gd2Vla2RheVtkLmdldERheSgpXTtcbiAgICByZXR1cm4gZGF5O1xuICB9XG5cbiAgZ2V0TW9udGgoKSB7XG4gICAgY29uc3QgbW9udGhOYW1lcyA9IFtcbiAgICAgIFwiSmFudWFyeVwiLFxuICAgICAgXCJGZWJydWFyeVwiLFxuICAgICAgXCJNYXJjaFwiLFxuICAgICAgXCJBcHJpbFwiLFxuICAgICAgXCJNYXlcIixcbiAgICAgIFwiSnVuZVwiLFxuICAgICAgXCJKdWx5XCIsXG4gICAgICBcIkF1Z3VzdFwiLFxuICAgICAgXCJTZXB0ZW1iZXJcIixcbiAgICAgIFwiT2N0b2JlclwiLFxuICAgICAgXCJOb3ZlbWJlclwiLFxuICAgICAgXCJEZWNlbWJlclwiLFxuICAgIF07XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgbW9udGggPSBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV07XG4gICAgcmV0dXJuIG1vbnRoO1xuICB9XG5cbiAgZ2V0RGF0ZSgpIHtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBkYXRlID0gZC5nZXREYXRlKCk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnJlbnRXZWF0aGVyIHtcbiAgY29uc3RydWN0b3IoY3VycmVudFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IHRoaXMuZ2V0VGVtcGVyYXR1cmUoTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi50ZW1wKSwgdW5pdCk7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wID0gdGhpcy5nZXRUZW1wZXJhdHVyZShNYXRoLnJvdW5kKGN1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2UpLCB1bml0KTtcbiAgICB0aGlzLmh1bWlkaXR5ID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLm1haW4uaHVtaWRpdHl9JWA7XG4gICAgdGhpcy53aW5kU3BlZWQgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEud2luZC5zcGVlZH0gbS9zYDtcbiAgICB0aGlzLnByZXNzdXJlID0gYCR7Y3VycmVudFdlYXRoZXJEYXRhLm1haW4ucHJlc3N1cmV9IGhQYWA7XG4gICAgdGhpcy5zdW5yaXNlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3VucmlzZSwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcbiAgICB0aGlzLnN1bnNldCA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShjdXJyZW50V2VhdGhlckRhdGEuc3lzLnN1bnNldCwgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lKTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gdGhpcy5nZXRXZWF0aGVyQ29uZGl0aW9uSW1nKFxuICAgICAgY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0ubWFpbixcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3VucmlzZSxcbiAgICAgIGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LFxuICAgICAgY3VycmVudFdlYXRoZXJEYXRhLnRpbWV6b25lXG4gICAgKTtcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlKGRlZ3JlZSwgdW5pdCkge1xuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKTtcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBgMCR7ZGF0ZUluU2VhcmNoZWRDaXR5LmdldE1pbnV0ZXMoKX1gO1xuICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzLnN1YnN0cigtMil9YDtcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbiAgfVxuXG4gIGdldFdlYXRoZXJDb25kaXRpb25JbWcodmFsdWUsIHN1bnJpc2VVbml4LCBzdW5zZXRVbml4LCB0aW1lem9uZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJEcml6emxlXCIpIHJldHVybiBcIlJhaW5cIjtcbiAgICBjb25zdCBtaXN0RXF1aXZhbGVudGVzID0gW1wiU21va2VcIiwgXCJIYXplXCIsIFwiRHVzdFwiLCBcIkZvZ1wiLCBcIlNhbmRcIiwgXCJEdXN0XCIsIFwiQXNoXCIsIFwiU3F1YWxsXCIsIFwiVG9ybmFkb1wiXTtcbiAgICBpZiAobWlzdEVxdWl2YWxlbnRlcy5pbmNsdWRlcyh2YWx1ZSkpIHJldHVybiBcIk1pc3RcIjtcbiAgICBpZiAodmFsdWUgIT09IFwiQ2xlYXJcIikgcmV0dXJuIHZhbHVlO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKDAsIHRpbWV6b25lKTtcbiAgICBjb25zdCBzdW5yaXNlRGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZShzdW5yaXNlVW5peCwgdGltZXpvbmUpO1xuICAgIGNvbnN0IHN1bnNldERhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3Vuc2V0VW5peCwgdGltZXpvbmUpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZSA+IHN1bnJpc2VEYXRlICYmIGN1cnJlbnREYXRlIDwgc3Vuc2V0RGF0ZSA/IGAke3ZhbHVlfURheWAgOiBgJHt2YWx1ZX1OaWdodGA7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcmVjYXN0V2VhdGhlciB7XG4gIGNvbnN0cnVjdG9yKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlcyA9IHRoaXMuZ2V0VGVtcGVyYXR1cmVzKGZvcmVjYXN0V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbiA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbnMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XG4gICAgdGhpcy50aW1lID0gdGhpcy5nZXRUaW1lcyhmb3JlY2FzdFdlYXRoZXJEYXRhKTtcbiAgfVxuXG4gIGdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhLCB1bml0KSB7XG4gICAgY29uc3QgdGVtcGVyYXR1cmVzID0gW107XG4gICAgZm9yZWNhc3RXZWF0aGVyRGF0YS5saXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHRlbXAgPSBNYXRoLnJvdW5kKGl0ZW0ubWFpbi50ZW1wKTtcbiAgICAgIGNvbnN0IHRlbXBXaXRoVW5pdCA9IHRoaXMuZ2V0VGVtcGVyYXR1cmVVbml0KHRlbXAsIHVuaXQpO1xuICAgICAgdGVtcGVyYXR1cmVzLnB1c2godGVtcFdpdGhVbml0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGVtcGVyYXR1cmVzO1xuICB9XG5cbiAgZ2V0VGVtcGVyYXR1cmVVbml0KGRlZ3JlZSwgdW5pdCkge1xuICAgIHJldHVybiB1bml0ID09PSBcIm1ldHJpY1wiID8gYCR7ZGVncmVlfeKEg2AgOiBgJHtkZWdyZWV94oSJYDtcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gdW5peFRpbWUgPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUodW5peFRpbWUgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICByZXR1cm4gZGF0ZUluU2VhcmNoZWRDaXR5O1xuICB9XG5cbiAgZ2V0V2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSwgc3VucmlzZVVuaXgsIHN1bnNldFVuaXgsIHRpbWV6b25lKSB7XG4gICAgaWYgKHZhbHVlICE9PSBcIkNsZWFyXCIpIHJldHVybiB2YWx1ZTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSgwLCB0aW1lem9uZSk7XG4gICAgY29uc3Qgc3VucmlzZURhdGUgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eURhdGUoc3VucmlzZVVuaXgsIHRpbWV6b25lKTtcbiAgICBjb25zdCBzdW5zZXREYXRlID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlEYXRlKHN1bnNldFVuaXgsIHRpbWV6b25lKTtcbiAgICByZXR1cm4gY3VycmVudERhdGUgPiBzdW5yaXNlRGF0ZSAmJiBjdXJyZW50RGF0ZSA8IHN1bnNldERhdGUgPyBgJHt2YWx1ZX1EYXlgIDogYCR7dmFsdWV9TmlnaHRgO1xuICB9XG5cbiAgZ2V0V2VhdGhlckNvbmRpdGlvbnMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IHdlYXRoZXJDb25kaXRpb24gPSBbXTtcbiAgICBjb25zdCBzdW5yaXNlVW5peCA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eS5zdW5yaXNlO1xuICAgIGNvbnN0IHN1bnNldFVuaXggPSBmb3JlY2FzdFdlYXRoZXJEYXRhLmNpdHkuc3Vuc2V0O1xuICAgIGNvbnN0IHsgdGltZXpvbmUgfSA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eTtcbiAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgY29uZCA9IHRoaXMuZ2V0V2VhdGhlckNvbmRpdGlvbkltZyhpdGVtLndlYXRoZXJbMF0ubWFpbiwgc3VucmlzZVVuaXgsIHN1bnNldFVuaXgsIHRpbWV6b25lKTtcbiAgICAgIHdlYXRoZXJDb25kaXRpb24ucHVzaChjb25kKTtcbiAgICB9KTtcbiAgICByZXR1cm4gd2VhdGhlckNvbmRpdGlvbjtcbiAgfVxuXG4gIGdldFRpbWVzKGZvcmVjYXN0V2VhdGhlckRhdGEpIHtcbiAgICBjb25zdCB0aW1lcyA9IFtdO1xuICAgIGNvbnN0IHsgdGltZXpvbmUgfSA9IGZvcmVjYXN0V2VhdGhlckRhdGEuY2l0eTtcbiAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuY29udmVydFRvU2VhcmNoZWRDaXR5VGltZShpdGVtLCB0aW1lem9uZSk7XG4gICAgICB0aW1lcy5wdXNoKHRpbWUpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aW1lcztcbiAgfVxuXG4gIGNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUodW5peFRpbWUsIHRpbWV6b25lKSB7XG4gICAgY29uc3QgbG9jYWxEYXRlID0gbmV3IERhdGUodW5peFRpbWUuZHQgKiAxMDAwKTtcbiAgICBjb25zdCB1dGNVbml4VGltZSA9IGxvY2FsRGF0ZS5nZXRUaW1lKCkgKyBsb2NhbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwO1xuICAgIGNvbnN0IHVuaXhUaW1lSW5TZWFyY2hlZENpdHkgPSB1dGNVbml4VGltZSArIHRpbWV6b25lICogMTAwMDtcbiAgICBjb25zdCBkYXRlSW5TZWFyY2hlZENpdHkgPSBuZXcgRGF0ZSh1bml4VGltZUluU2VhcmNoZWRDaXR5KTtcbiAgICBjb25zdCBob3VycyA9IGRhdGVJblNlYXJjaGVkQ2l0eS5nZXRIb3VycygpO1xuICAgIGNvbnN0IHRpbWUgPSBgJHtob3Vyc306MDBgO1xuICAgIHJldHVybiB0aW1lO1xuICB9XG59XG4iLCJpbXBvcnQgQ3VycmVudFdlYXRoZXIgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJcIjtcbmltcG9ydCBGb3JlY2FzdFdlYXRoZXIgZnJvbSBcIi4vZm9yZWNhc3RXZWF0aGVyXCI7XG5pbXBvcnQgQ2l0eUluZm8gZnJvbSBcIi4vY2l0eUluZm9cIjtcbmltcG9ydCBBUElzIGZyb20gXCIuL0FQSXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbk1vZGVsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kYXRhID0ge307XG4gICAgdGhpcy5BUElzID0gbmV3IEFQSXMoKTtcbiAgfVxuXG4gIGFzeW5jIGdldENpdHlJbmZvKGNpdHksIHVuaXQpIHtcbiAgICBjb25zdCBBcGlEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICBjb25zdCBjaXR5SW5mbyA9IG5ldyBDaXR5SW5mbyhBcGlEYXRhKTtcbiAgICByZXR1cm4gY2l0eUluZm87XG4gIH1cblxuICBhc3luYyBnZXRDdXJyZW50V2VhdGhlcihjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgY3VycmVudFdlYXRoZXJEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KTtcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IG5ldyBDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlckRhdGEsIHVuaXQpO1xuICAgIHJldHVybiBjdXJyZW50V2VhdGhlcjtcbiAgfVxuXG4gIGFzeW5jIGdldEZvcmVjYXN0V2VhdGhlcihjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyRGF0YSA9IGF3YWl0IHRoaXMuQVBJcy5nZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgIGNvbnN0IGZvcmVjYXN0V2VhdGhlciA9IG5ldyBGb3JlY2FzdFdlYXRoZXIoZm9yZWNhc3RXZWF0aGVyRGF0YSwgdW5pdCk7XG4gICAgcmV0dXJuIGZvcmVjYXN0V2VhdGhlcjtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0eUluZm9WaWV3IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY2l0eUluZm9Nb2RlbCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5tb2RlbCA9IGNpdHlJbmZvTW9kZWw7XG4gICAgdGhpcy5jaXR5ID0gY2l0eUluZm9Nb2RlbC5jaXR5RGVzY3JpcHRpb247XG4gICAgdGhpcy5kYXRlID0gY2l0eUluZm9Nb2RlbC5kYXRlRGVzY3JpcHRpb247XG4gIH1cblxuICBnZXQgY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKTtcbiAgfVxuXG4gIHNldCBjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5jaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKTtcbiAgfVxuXG4gIHNldCBkYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5kYXRlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnJlbnRXZWF0aGVyVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGN1cnJlbnRXZWF0aGVyTW9kZWwpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMubW9kZWwgPSBjdXJyZW50V2VhdGhlck1vZGVsO1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZyA9IGN1cnJlbnRXZWF0aGVyTW9kZWwud2VhdGhlckNvbmRpdGlvbkltZztcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC50ZW1wZXJhdHVyZTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uRGVzYztcbiAgICB0aGlzLmZlZWxzTGlrZVRlbXAgPSBjdXJyZW50V2VhdGhlck1vZGVsLmZlZWxzTGlrZVRlbXA7XG4gICAgdGhpcy5zdW5yaXNlID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5yaXNlO1xuICAgIHRoaXMuc3Vuc2V0ID0gY3VycmVudFdlYXRoZXJNb2RlbC5zdW5zZXQ7XG4gICAgdGhpcy5odW1pZGl0eSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwuaHVtaWRpdHk7XG4gICAgdGhpcy53aW5kU3BlZWQgPSBjdXJyZW50V2VhdGhlck1vZGVsLndpbmRTcGVlZDtcbiAgICB0aGlzLnByZXNzdXJlID0gY3VycmVudFdlYXRoZXJNb2RlbC5wcmVzc3VyZTtcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24gPSBjdXJyZW50V2VhdGhlck1vZGVsLndlYXRoZXJDb25kaXRpb25JbWc7XG4gICAgdGhpcy5ub3dUZW1wZXJhdHVyZSA9IGN1cnJlbnRXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmU7XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkltZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkltZyh2YWx1ZSkge1xuICAgIHRoaXMud2VhdGhlckNvbmRpdGlvbkltZy5zcmMgPSBgaW1hZ2VzLyR7dmFsdWV9LnBuZ2A7XG4gIH1cblxuICBnZXQgdGVtcGVyYXR1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gIH1cblxuICBzZXQgdGVtcGVyYXR1cmUodmFsdWUpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2VhdGhlckNvbmRpdGlvbkRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XG4gIH1cblxuICBzZXQgd2VhdGhlckNvbmRpdGlvbkRlc2ModmFsdWUpIHtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZmVlbHNMaWtlVGVtcCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcbiAgfVxuXG4gIHNldCBmZWVsc0xpa2VUZW1wKHZhbHVlKSB7XG4gICAgdGhpcy5mZWVsc0xpa2VUZW1wLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3VucmlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VucmlzZVwiKTtcbiAgfVxuXG4gIHNldCBzdW5yaXNlKHZhbHVlKSB7XG4gICAgdGhpcy5zdW5yaXNlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3Vuc2V0KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdW5zZXRcIik7XG4gIH1cblxuICBzZXQgc3Vuc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5zdW5zZXQudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBodW1pZGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaHVtaWRpdHlcIik7XG4gIH1cblxuICBzZXQgaHVtaWRpdHkodmFsdWUpIHtcbiAgICB0aGlzLmh1bWlkaXR5LnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgd2luZFNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kLXNwZWVkXCIpO1xuICB9XG5cbiAgc2V0IHdpbmRTcGVlZCh2YWx1ZSkge1xuICAgIHRoaXMud2luZFNwZWVkLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJlc3N1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnByZXNzdXJlXCIpO1xuICB9XG5cbiAgc2V0IHByZXNzdXJlKHZhbHVlKSB7XG4gICAgdGhpcy5wcmVzc3VyZS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG5vd1dlYXRoZXJDb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9yZWNhc3RfX2l0ZW1fX2N1cnJlbnQtY29uZGl0aW9uXCIpO1xuICB9XG5cbiAgc2V0IG5vd1dlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcbiAgICB0aGlzLm5vd1dlYXRoZXJDb25kaXRpb24uc3JjID0gYGltYWdlcy8ke3ZhbHVlfS5wbmdgO1xuICB9XG5cbiAgZ2V0IG5vd1RlbXBlcmF0dXJlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcmVjYXN0X19pdGVtX19jdXJlbnQtdGVtcFwiKTtcbiAgfVxuXG4gIHNldCBub3dUZW1wZXJhdHVyZSh2YWx1ZSkge1xuICAgIHRoaXMubm93VGVtcGVyYXR1cmUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgZm9yZWNhc3RXZWF0aGVyVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGZvcmVjYXN0V2VhdGhlck1vZGVsKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm1vZGVsID0gZm9yZWNhc3RXZWF0aGVyTW9kZWw7XG4gICAgdGhpcy50aW1lID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwudGltZTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSBmb3JlY2FzdFdlYXRoZXJNb2RlbC53ZWF0aGVyQ29uZGl0aW9uO1xuICAgIHRoaXMudGVtcGVyYXR1cmVzID0gZm9yZWNhc3RXZWF0aGVyTW9kZWwudGVtcGVyYXR1cmVzO1xuICB9XG5cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZvcmVjYXN0X19pdGVtX190aW1lXCIpO1xuICB9XG5cbiAgc2V0IHRpbWUodmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGltZS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy50aW1lW2ldLnRleHRDb250ZW50ID0gdmFsdWVbaV07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHdlYXRoZXJDb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xuICB9XG5cbiAgc2V0IHdlYXRoZXJDb25kaXRpb24odmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMud2VhdGhlckNvbmRpdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uW2ldLnNyYyA9IGBpbWFnZXMvJHt2YWx1ZVtpIC0gMV19LnBuZ2A7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHRlbXBlcmF0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZm9yZWNhc3RfX2l0ZW1fX3RlbXBlcmF0dXJlXCIpO1xuICB9XG5cbiAgc2V0IHRlbXBlcmF0dXJlcyh2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50aW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnRlbXBlcmF0dXJlc1tpXS50ZXh0Q29udGVudCA9IHZhbHVlW2ldO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IENpdHlJbmZvVmlldyBmcm9tIFwiLi9jaXR5SW5mb1ZpZXdcIjtcbmltcG9ydCBDdXJyZW50V2VhdGhlclZpZXcgZnJvbSBcIi4vY3VycmVudFdlYXRoZXJWaWV3XCI7XG5pbXBvcnQgRm9yZWNhc3RXZWF0aGVyVmlldyBmcm9tIFwiLi9mb3JlY2FzdFdlYXRoZXJWaWV3XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5WaWV3IHtcbiAgYXBwZW5kQ2l0eUluZm8oY2l0eUluZm8pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5LWluZm9cIik7XG4gICAgbmV3IENpdHlJbmZvVmlldyhlbGVtZW50LCBjaXR5SW5mbyk7XG4gIH1cblxuICBhcHBlbmRDdXJyZW50V2VhdGhlcihjdXJyZW50V2VhdGhlcikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtd2VhdGhlclwiKTtcbiAgICBuZXcgQ3VycmVudFdlYXRoZXJWaWV3KGVsZW1lbnQsIGN1cnJlbnRXZWF0aGVyKTtcbiAgfVxuXG4gIGFwcGVuZEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXIpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JlY2FzdFwiKTtcbiAgICBuZXcgRm9yZWNhc3RXZWF0aGVyVmlldyhlbGVtZW50LCBmb3JlY2FzdFdlYXRoZXIpO1xuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18gZnJvbSBcIi0hLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltYWdlcy9tYWduaWZ5LnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMTIsIDIwNywgMjA3KTtcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcXG4gIGNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbCk7XFxufVxcblxcbm1haW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogNHJlbSAycmVtO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcbiAgd2lkdGg6IDQwJTtcXG4gIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogY2FsYygxcmVtICsgMC41dncpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxufVxcblxcbi5jaXR5LWluZm8gaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNjAwKTtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG5oMiB7XFxuICBmb250LXNpemU6IDEuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy0zMDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMTByZW0gKyAxMHZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGgxIHtcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxuICBmb250LXNpemU6IDRyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctNDAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl90ZW1wIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxuICBoZWlnaHQ6IG1heC1jb250ZW50O1xcbiAgcGFkZGluZzogMnJlbSA0cmVtO1xcbiAgZ2FwOiA0cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMC41cmVtO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIGltZyB7XFxuICB3aWR0aDogY2FsYygxcmVtICsgMXZ3KTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlsc19fY29sdW1uIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uZm9yZWNhc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiAxcmVtIDJyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uZm9yZWNhc3RfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDJyZW0gKyAzdncpO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL21haW4uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLGdEQUFnRDtFQUNoRCxtQ0FBbUM7RUFDbkMsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7QUFDZjs7QUFFQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLG9DQUFvQztFQUNwQyw4QkFBOEI7RUFDOUIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0IsWUFBWTtFQUNaLGlCQUFpQjtFQUNqQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsYUFBYTtFQUNiLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLFVBQVU7RUFDViw0QkFBNEI7RUFDNUIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWix5REFBNEM7RUFDNUMsNEJBQTRCO0VBQzVCLGdDQUFnQztFQUNoQyxtQ0FBbUM7RUFDbkMsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QiwwQkFBMEI7RUFDMUIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QscUJBQXFCO0VBQ3JCLDJDQUEyQztBQUM3Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsMkNBQTJDO0FBQzdDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoLi9ub3JtYWxpemUuY3NzKTtcXG5cXG46cm9vdCB7XFxuICAtLWNsci1uZXV0cmFsOiBoc2woMCwgMCUsIDEwMCUpO1xcbiAgLS1jbHItbmV1dHJhbC10cmFuc3A6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNzEpO1xcbiAgLS1mZi1wcmltYXJ5OiBcXFwiUG9wcGluc1xcXCIsIHNhbnMtc2VyaWY7XFxuICAtLWZ3LTMwMDogMzAwO1xcbiAgLS1mdy00MDA6IDQwMDtcXG4gIC0tZnctNTAwOiA1MDA7XFxuICAtLWZ3LTYwMDogNjAwO1xcbiAgLS1mdy03MDA6IDcwMDtcXG59XFxuXFxuKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbmJvZHkge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjEyLCAyMDcsIDIwNyk7XFxuICBmb250LWZhbWlseTogdmFyKC0tZmYtcHJpbWFyeSk7XFxuICBjb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwpO1xcbn1cXG5cXG5tYWluIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIHBhZGRpbmc6IDRyZW0gMnJlbTtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnNlYXJjaC13cmFwcGVyIGlucHV0IHtcXG4gIHdpZHRoOiA0MCU7XFxuICBwYWRkaW5nOiAxMHB4IDEwcHggMTBweCA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWFnZXMvbWFnbmlmeS5wbmcpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbmgyIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICBnYXA6IDRyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbiBodG1sIHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFNlY3Rpb25zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAgICovXFxuICBcXG4gIG1haW4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxuICB9XFxuICBcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAgICovXFxuICBcXG4gIGhyIHtcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBwcmUge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGEge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBhYmJyW3RpdGxlXSB7XFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBiLFxcbiAgc3Ryb25nIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGNvZGUsXFxuICBrYmQsXFxuICBzYW1wIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc21hbGwge1xcbiAgICBmb250LXNpemU6IDgwJTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gICAqIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdWIsXFxuICBzdXAge1xcbiAgICBmb250LXNpemU6IDc1JTtcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICBzdWIge1xcbiAgICBib3R0b206IC0wLjI1ZW07XFxuICB9XFxuICBcXG4gIHN1cCB7XFxuICAgIHRvcDogLTAuNWVtO1xcbiAgfVxcbiAgXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKiBGb3Jtc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCxcXG4gIG9wdGdyb3VwLFxcbiAgc2VsZWN0LFxcbiAgdGV4dGFyZWEge1xcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgbWFyZ2luOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0IHsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBzZWxlY3QgeyAvKiAxICovXFxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b246LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZmllbGRzZXQge1xcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gICAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGxlZ2VuZCB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gICAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gICAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICAgKi9cXG4gIFxcbiAgcHJvZ3Jlc3Mge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG4gIFt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIGhlaWdodDogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgICBmb250OiBpbmhlcml0OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIEludGVyYWN0aXZlXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBkZXRhaWxzIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3VtbWFyeSB7XFxuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG4gIH1cXG4gIFxcbiAgLyogTWlzY1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGVtcGxhdGUge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFtoaWRkZW5dIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL25vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOztBQUUzRTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7Q0FFRDtJQUNHLGlCQUFpQixFQUFFLE1BQU07SUFDekIsOEJBQThCLEVBQUUsTUFBTTtFQUN4Qzs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsU0FBUztFQUNYOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSxjQUFjO0lBQ2QsZ0JBQWdCO0VBQ2xCOztFQUVBO2lGQUMrRTs7RUFFL0U7OztJQUdFOztFQUVGO0lBQ0UsdUJBQXVCLEVBQUUsTUFBTTtJQUMvQixTQUFTLEVBQUUsTUFBTTtJQUNqQixpQkFBaUIsRUFBRSxNQUFNO0VBQzNCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsY0FBYyxFQUFFLE1BQU07RUFDeEI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLDZCQUE2QjtFQUMvQjs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSxtQkFBbUIsRUFBRSxNQUFNO0lBQzNCLDBCQUEwQixFQUFFLE1BQU07SUFDbEMsaUNBQWlDLEVBQUUsTUFBTTtFQUMzQzs7RUFFQTs7SUFFRTs7RUFFRjs7SUFFRSxtQkFBbUI7RUFDckI7O0VBRUE7OztJQUdFOztFQUVGOzs7SUFHRSxpQ0FBaUMsRUFBRSxNQUFNO0lBQ3pDLGNBQWMsRUFBRSxNQUFNO0VBQ3hCOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7O0lBRUUsY0FBYztJQUNkLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsd0JBQXdCO0VBQzFCOztFQUVBO0lBQ0UsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0Usa0JBQWtCO0VBQ3BCOztFQUVBO2lGQUMrRTs7RUFFL0U7OztJQUdFOztFQUVGOzs7OztJQUtFLG9CQUFvQixFQUFFLE1BQU07SUFDNUIsZUFBZSxFQUFFLE1BQU07SUFDdkIsaUJBQWlCLEVBQUUsTUFBTTtJQUN6QixTQUFTLEVBQUUsTUFBTTtFQUNuQjs7RUFFQTs7O0lBR0U7O0VBRUY7VUFDUSxNQUFNO0lBQ1osaUJBQWlCO0VBQ25COztFQUVBOzs7SUFHRTs7RUFFRjtXQUNTLE1BQU07SUFDYixvQkFBb0I7RUFDdEI7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSwwQkFBMEI7RUFDNUI7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSxrQkFBa0I7SUFDbEIsVUFBVTtFQUNaOztFQUVBOztJQUVFOztFQUVGOzs7O0lBSUUsOEJBQThCO0VBQ2hDOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsOEJBQThCO0VBQ2hDOztFQUVBOzs7OztJQUtFOztFQUVGO0lBQ0Usc0JBQXNCLEVBQUUsTUFBTTtJQUM5QixjQUFjLEVBQUUsTUFBTTtJQUN0QixjQUFjLEVBQUUsTUFBTTtJQUN0QixlQUFlLEVBQUUsTUFBTTtJQUN2QixVQUFVLEVBQUUsTUFBTTtJQUNsQixtQkFBbUIsRUFBRSxNQUFNO0VBQzdCOztFQUVBOztJQUVFOztFQUVGO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7O0lBR0U7O0VBRUY7O0lBRUUsc0JBQXNCLEVBQUUsTUFBTTtJQUM5QixVQUFVLEVBQUUsTUFBTTtFQUNwQjs7RUFFQTs7SUFFRTs7RUFFRjs7SUFFRSxZQUFZO0VBQ2Q7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsNkJBQTZCLEVBQUUsTUFBTTtJQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0VBQzlCOztFQUVBOztJQUVFOztFQUVGO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLDBCQUEwQixFQUFFLE1BQU07SUFDbEMsYUFBYSxFQUFFLE1BQU07RUFDdkI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7aUZBQytFOztFQUUvRTs7SUFFRTs7RUFFRjtJQUNFLGFBQWE7RUFDZjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGFBQWE7RUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG4gaHRtbCB7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBTZWN0aW9uc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgYm9keSB7XFxuICAgIG1hcmdpbjogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gICAqL1xcbiAgXFxuICBtYWluIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAgICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBoMSB7XFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcbiAgICBtYXJnaW46IDAuNjdlbSAwO1xcbiAgfVxcbiAgXFxuICAvKiBHcm91cGluZyBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICAgKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqL1xcbiAgXFxuICBociB7XFxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICAgIGhlaWdodDogMDsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgcHJlIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBhIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gICAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYixcXG4gIHN0cm9uZyB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBjb2RlLFxcbiAga2JkLFxcbiAgc2FtcCB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHNtYWxsIHtcXG4gICAgZm9udC1zaXplOiA4MCU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICAgKiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3ViLFxcbiAgc3VwIHtcXG4gICAgZm9udC1zaXplOiA3NSU7XFxuICAgIGxpbmUtaGVpZ2h0OiAwO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgc3ViIHtcXG4gICAgYm90dG9tOiAtMC4yNWVtO1xcbiAgfVxcbiAgXFxuICBzdXAge1xcbiAgICB0b3A6IC0wLjVlbTtcXG4gIH1cXG4gIFxcbiAgLyogRW1iZWRkZWQgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGltZyB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyogRm9ybXNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQsXFxuICBvcHRncm91cCxcXG4gIHNlbGVjdCxcXG4gIHRleHRhcmVhIHtcXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAgIG1hcmdpbjogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAgICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCB7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICAgKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgc2VsZWN0IHsgLyogMSAqL1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gICAgcGFkZGluZzogMDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGZpZWxkc2V0IHtcXG4gICAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICAgKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICAgKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBsZWdlbmQge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICAgIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICAgIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAgICovXFxuICBcXG4gIHByb2dyZXNzIHtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRleHRhcmVhIHtcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICAgKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuICBbdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuICBbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgICBoZWlnaHQ6IGF1dG87XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICA6Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gICAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBJbnRlcmFjdGl2ZVxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZGV0YWlscyB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1bW1hcnkge1xcbiAgICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxuICB9XFxuICBcXG4gIC8qIE1pc2NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAgICovXFxuICBcXG4gIHRlbXBsYXRlIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbaGlkZGVuXSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTsgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG5cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9IC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcblxuXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgXCJcIikuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi4vc3R5bGVzL21haW4uY3NzXCI7XG5cbmltcG9ydCBNYWluTW9kZWwgZnJvbSBcIi4vbW9kZWxzL21haW5Nb2RlbFwiO1xuaW1wb3J0IE1haW5WaWV3IGZyb20gXCIuL3ZpZXdzL21haW5WaWV3XCI7XG5pbXBvcnQgTWFpbkNvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlcnMvbWFpbkNvbnRyb2xsZXJcIjtcblxuY29uc3QgbW9kZWwgPSBuZXcgTWFpbk1vZGVsKCk7XG5jb25zdCB2aWV3ID0gbmV3IE1haW5WaWV3KCk7XG5jb25zdCBjb250cm9sbGVyID0gbmV3IE1haW5Db250cm9sbGVyKG1vZGVsLCB2aWV3KTtcbiJdLCJuYW1lcyI6WyJNYWluQ29udHJvbGxlciIsImNvbnN0cnVjdG9yIiwibW9kZWwiLCJ2aWV3Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhbGxGdW5jIiwiY2l0eUluZm8iLCJnZXRDaXR5SW5mbyIsImN1cnJlbnRXZWF0aGVyIiwiZ2V0Q3VycmVudFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXIiLCJnZXRGb3JlY2FzdFdlYXRoZXIiLCJhcHBlbmRDaXR5SW5mbyIsImFwcGVuZEN1cnJlbnRXZWF0aGVyIiwiYXBwZW5kRm9yZWNhc3RXZWF0aGVyIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwiY2l0eSIsInVybCIsImdlbmVyYXRlR2VvQ29vcmRzVXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1vZGUiLCJnZW9jb2RpbmdEYXRhIiwianNvbiIsImxhdCIsImxvbiIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsInVuaXQiLCJnZW5lcmF0ZUN1cnJlbnRXZWF0aGVyVXJsIiwid2VhdGhlckRhdGEiLCJnZXRGb3JlY2FzdFdlYXRoZXJEYXRhIiwiZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwiLCJmb3JlY2FzdERhdGEiLCJhcHBJZCIsImJhc2VVcmwiLCJDaXR5SW5mbyIsIkFwaURhdGEiLCJjaXR5RGVzY3JpcHRpb24iLCJjcmVhdGVDaXR5RGVzY3JpcHRpb24iLCJkYXRlRGVzY3JpcHRpb24iLCJjcmVhdGVEYXRlRGVzY3JpcHRpb24iLCJuYW1lIiwiY291bnRyeSIsInN5cyIsImRheSIsImdldERheSIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsIndlZWtkYXkiLCJkIiwiRGF0ZSIsIm1vbnRoTmFtZXMiLCJDdXJyZW50V2VhdGhlciIsImN1cnJlbnRXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlIiwiZ2V0VGVtcGVyYXR1cmUiLCJNYXRoIiwicm91bmQiLCJtYWluIiwidGVtcCIsImZlZWxzTGlrZVRlbXAiLCJmZWVsc19saWtlIiwiaHVtaWRpdHkiLCJ3aW5kU3BlZWQiLCJ3aW5kIiwic3BlZWQiLCJwcmVzc3VyZSIsInN1bnJpc2UiLCJjb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lIiwidGltZXpvbmUiLCJzdW5zZXQiLCJ3ZWF0aGVyQ29uZGl0aW9uRGVzYyIsIndlYXRoZXIiLCJkZXNjcmlwdGlvbiIsIndlYXRoZXJDb25kaXRpb25JbWciLCJnZXRXZWF0aGVyQ29uZGl0aW9uSW1nIiwiZGVncmVlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5RGF0ZSIsInVuaXhUaW1lIiwibG9jYWxEYXRlIiwidXRjVW5peFRpbWUiLCJnZXRUaW1lIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ1bml4VGltZUluU2VhcmNoZWRDaXR5IiwiZGF0ZUluU2VhcmNoZWRDaXR5IiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkVGltZSIsInN1YnN0ciIsInZhbHVlIiwic3VucmlzZVVuaXgiLCJzdW5zZXRVbml4IiwibWlzdEVxdWl2YWxlbnRlcyIsImluY2x1ZGVzIiwiY3VycmVudERhdGUiLCJzdW5yaXNlRGF0ZSIsInN1bnNldERhdGUiLCJGb3JlY2FzdFdlYXRoZXIiLCJmb3JlY2FzdFdlYXRoZXJEYXRhIiwidGVtcGVyYXR1cmVzIiwiZ2V0VGVtcGVyYXR1cmVzIiwid2VhdGhlckNvbmRpdGlvbiIsImdldFdlYXRoZXJDb25kaXRpb25zIiwidGltZSIsImdldFRpbWVzIiwibGlzdCIsImZvckVhY2giLCJpdGVtIiwidGVtcFdpdGhVbml0IiwiZ2V0VGVtcGVyYXR1cmVVbml0IiwicHVzaCIsImNvbmQiLCJ0aW1lcyIsImR0IiwiTWFpbk1vZGVsIiwiZGF0YSIsIkNpdHlJbmZvVmlldyIsImVsZW1lbnQiLCJjaXR5SW5mb01vZGVsIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiQ3VycmVudFdlYXRoZXJWaWV3IiwiY3VycmVudFdlYXRoZXJNb2RlbCIsIm5vd1dlYXRoZXJDb25kaXRpb24iLCJub3dUZW1wZXJhdHVyZSIsInNyYyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JlY2FzdFdlYXRoZXJWaWV3IiwiZm9yZWNhc3RXZWF0aGVyTW9kZWwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsIkZvcmVjYXN0V2VhdGhlclZpZXciLCJNYWluVmlldyIsImNvbnRyb2xsZXIiXSwic291cmNlUm9vdCI6IiJ9