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
    await this.model.getCityInfo("Regina", "metric");
    await this.model.getCurrentWeather("Regina", "metric");
    await this.model.getForecastWeather("Regina", "metric");
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
    return `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.appId}&units=${unit}`;
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
  constructor(currentWeatherData) {
    this.temperature = Math.round(currentWeatherData.main.temp);
    this.weatherConditionDesc = currentWeatherData.weather[0].description;
    this.weatherConditionImg = currentWeatherData.weather[0].main;
    this.feelsLikeTemp = Math.round(currentWeatherData.main.feels_like);
    this.humidity = `${currentWeatherData.main.humidity}%`;
    this.windSpeed = `${currentWeatherData.wind.speed} m/s`;
    this.pressure = `${currentWeatherData.main.pressure} hPa`;
    this.sunrise = this.convertToSearchedCityTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    this.sunset = this.convertToSearchedCityTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
  }

  convertToSearchedCityTime(unixTime, timezone) {
    const localDate = new Date(unixTime * 1000);
    const utcUnixTime = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    const unixTimeInSearchedCity = utcUnixTime + timezone * 1000;
    const dateInSearchedCity = new Date(unixTimeInSearchedCity);
    const hours = dateInSearchedCity.getHours();
    const minutes = `0${dateInSearchedCity.getMinutes()}`;
    const formattedTime = `${hours}:${minutes.substr(-2)}`;
    return formattedTime;
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
  constructor(forecastWeatherData) {
    this.temperatures = this.getTemperatures(forecastWeatherData);
    this.weatherCondition = this.getWeatherConditions(forecastWeatherData);
    this.time = this.getTimes(forecastWeatherData);
  }

  getTemperatures(forecastWeatherData) {
    const temperatures = [];
    forecastWeatherData.list.forEach(item => {
      const temp = Math.round(item.main.temp);
      temperatures.push(temp);
    });
    return temperatures;
  }

  getWeatherConditions(forecastWeatherData) {
    const weatherCondition = [];
    forecastWeatherData.list.forEach(item => {
      const cond = item.weather[0].main;
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
    console.log(cityInfo);
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new _currentWeather__WEBPACK_IMPORTED_MODULE_0__["default"](currentWeatherData);
    console.log(currentWeather);
  }

  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new _forecastWeather__WEBPACK_IMPORTED_MODULE_1__["default"](forecastWeatherData);
    console.log(forecastWeather);
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
class MainView {
  constructor() {}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Li9zcmMvc2NyaXB0cy9jb250cm9sbGVycy9tYWluQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvQVBJcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2l0eUluZm8uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2N1cnJlbnRXZWF0aGVyLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zY3JpcHRzL21vZGVscy9mb3JlY2FzdFdlYXRoZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3NjcmlwdHMvbW9kZWxzL21haW5Nb2RlbC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy92aWV3cy9tYWluVmlldy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc3R5bGVzL21haW4uY3NzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vc3JjL3N0eWxlcy9tYWluLmNzcz9lODBhIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlcmFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXJhcHAvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKG1vZGVsLCB2aWV3KSB7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gdGhpcy5jYWxsRnVuYygpKTtcbiAgfVxuXG4gIGFzeW5jIGNhbGxGdW5jKCkge1xuICAgIGF3YWl0IHRoaXMubW9kZWwuZ2V0Q2l0eUluZm8oXCJSZWdpbmFcIiwgXCJtZXRyaWNcIik7XG4gICAgYXdhaXQgdGhpcy5tb2RlbC5nZXRDdXJyZW50V2VhdGhlcihcIlJlZ2luYVwiLCBcIm1ldHJpY1wiKTtcbiAgICBhd2FpdCB0aGlzLm1vZGVsLmdldEZvcmVjYXN0V2VhdGhlcihcIlJlZ2luYVwiLCBcIm1ldHJpY1wiKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudXJsR2VuZXJhdG9yID0gbmV3IFVybEdlbmVyYXRvcihcImU1MjMyMGI5ODQwNDAxODVlNjA0MGExZTY3ZjI1NGUwXCIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0R2VvQ29vcmRpbmF0ZXMoY2l0eSkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlR2VvQ29vcmRzVXJsKGNpdHkpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuICAgIGNvbnN0IGdlb2NvZGluZ0RhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBnZW9jb2RpbmdEYXRhWzBdO1xuXG4gICAgcmV0dXJuIHsgbGF0LCBsb24gfTtcbiAgfVxuXG4gIGFzeW5jIGdldEN1cnJlbnRXZWF0aGVyRGF0YShjaXR5LCB1bml0KSB7XG4gICAgY29uc3QgeyBsYXQsIGxvbiB9ID0gYXdhaXQgdGhpcy5nZXRHZW9Db29yZGluYXRlcyhjaXR5KTtcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybEdlbmVyYXRvci5nZW5lcmF0ZUN1cnJlbnRXZWF0aGVyVXJsKGxhdCwgbG9uLCB1bml0KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcbiAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gd2VhdGhlckRhdGE7XG4gIH1cblxuICBhc3luYyBnZXRGb3JlY2FzdFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpIHtcbiAgICBjb25zdCB7IGxhdCwgbG9uIH0gPSBhd2FpdCB0aGlzLmdldEdlb0Nvb3JkaW5hdGVzKGNpdHkpO1xuICAgIGNvbnN0IHVybCA9IHRoaXMudXJsR2VuZXJhdG9yLmdlbmVyYXRlRm9yZWNhc3RXZWF0aGVyVXJsKGxhdCwgbG9uLCB1bml0KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcbiAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGZvcmVjYXN0RGF0YTtcbiAgfVxufVxuXG5jbGFzcyBVcmxHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihhcHBJZCkge1xuICAgIHRoaXMuYmFzZVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnXCI7XG4gICAgdGhpcy5hcHBJZCA9IGFwcElkO1xuICB9XG5cbiAgZ2VuZXJhdGVHZW9Db29yZHNVcmwoY2l0eSkge1xuICAgIHJldHVybiBgJHt0aGlzLmJhc2VVcmx9L2dlby8xLjAvZGlyZWN0P3E9JHtjaXR5fSZhcHBpZD0ke3RoaXMuYXBwSWR9YDtcbiAgfVxuXG4gIGdlbmVyYXRlQ3VycmVudFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZhcHBpZD0ke3RoaXMuYXBwSWR9JnVuaXRzPSR7dW5pdH1gO1xuICB9XG5cbiAgZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwobGF0LCBsb24sIHVuaXQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsfS9kYXRhLzIuNS9mb3JlY2FzdD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9JHt0aGlzLmFwcElkfSZ1bml0cz0ke3VuaXR9YDtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0eUluZm8ge1xuICBjb25zdHJ1Y3RvcihBcGlEYXRhKSB7XG4gICAgdGhpcy5jaXR5RGVzY3JpcHRpb24gPSB0aGlzLmNyZWF0ZUNpdHlEZXNjcmlwdGlvbihBcGlEYXRhKTtcbiAgICB0aGlzLmRhdGVEZXNjcmlwdGlvbiA9IHRoaXMuY3JlYXRlRGF0ZURlc2NyaXB0aW9uKEFwaURhdGEpO1xuICB9XG5cbiAgY3JlYXRlQ2l0eURlc2NyaXB0aW9uKEFwaURhdGEpIHtcbiAgICBjb25zdCBjaXR5ID0gQXBpRGF0YS5uYW1lO1xuICAgIGNvbnN0IHsgY291bnRyeSB9ID0gQXBpRGF0YS5zeXM7XG4gICAgcmV0dXJuIGAke2NpdHl9LCAke2NvdW50cnl9YDtcbiAgfVxuXG4gIGNyZWF0ZURhdGVEZXNjcmlwdGlvbihBcGlEYXRhKSB7XG4gICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXkoKTtcbiAgICBjb25zdCBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBkYXRlID0gdGhpcy5nZXREYXRlKCk7XG4gICAgcmV0dXJuIGAke2RheX0sICR7bW9udGh9ICR7ZGF0ZX1gO1xuICB9XG5cbiAgZ2V0RGF5KCkge1xuICAgIGNvbnN0IHdlZWtkYXkgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXTtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBkYXkgPSB3ZWVrZGF5W2QuZ2V0RGF5KCldO1xuICAgIHJldHVybiBkYXk7XG4gIH1cblxuICBnZXRNb250aCgpIHtcbiAgICBjb25zdCBtb250aE5hbWVzID0gW1xuICAgICAgXCJKYW51YXJ5XCIsXG4gICAgICBcIkZlYnJ1YXJ5XCIsXG4gICAgICBcIk1hcmNoXCIsXG4gICAgICBcIkFwcmlsXCIsXG4gICAgICBcIk1heVwiLFxuICAgICAgXCJKdW5lXCIsXG4gICAgICBcIkp1bHlcIixcbiAgICAgIFwiQXVndXN0XCIsXG4gICAgICBcIlNlcHRlbWJlclwiLFxuICAgICAgXCJPY3RvYmVyXCIsXG4gICAgICBcIk5vdmVtYmVyXCIsXG4gICAgICBcIkRlY2VtYmVyXCIsXG4gICAgXTtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBtb250aCA9IG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXTtcbiAgICByZXR1cm4gbW9udGg7XG4gIH1cblxuICBnZXREYXRlKCkge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRhdGUgPSBkLmdldERhdGUoKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VycmVudFdlYXRoZXIge1xuICBjb25zdHJ1Y3RvcihjdXJyZW50V2VhdGhlckRhdGEpIHtcbiAgICB0aGlzLnRlbXBlcmF0dXJlID0gTWF0aC5yb3VuZChjdXJyZW50V2VhdGhlckRhdGEubWFpbi50ZW1wKTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb25EZXNjID0gY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG4gICAgdGhpcy53ZWF0aGVyQ29uZGl0aW9uSW1nID0gY3VycmVudFdlYXRoZXJEYXRhLndlYXRoZXJbMF0ubWFpbjtcbiAgICB0aGlzLmZlZWxzTGlrZVRlbXAgPSBNYXRoLnJvdW5kKGN1cnJlbnRXZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2UpO1xuICAgIHRoaXMuaHVtaWRpdHkgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEubWFpbi5odW1pZGl0eX0lYDtcbiAgICB0aGlzLndpbmRTcGVlZCA9IGAke2N1cnJlbnRXZWF0aGVyRGF0YS53aW5kLnNwZWVkfSBtL3NgO1xuICAgIHRoaXMucHJlc3N1cmUgPSBgJHtjdXJyZW50V2VhdGhlckRhdGEubWFpbi5wcmVzc3VyZX0gaFBhYDtcbiAgICB0aGlzLnN1bnJpc2UgPSB0aGlzLmNvbnZlcnRUb1NlYXJjaGVkQ2l0eVRpbWUoY3VycmVudFdlYXRoZXJEYXRhLnN5cy5zdW5yaXNlLCBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmUpO1xuICAgIHRoaXMuc3Vuc2V0ID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGN1cnJlbnRXZWF0aGVyRGF0YS5zeXMuc3Vuc2V0LCBjdXJyZW50V2VhdGhlckRhdGEudGltZXpvbmUpO1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBsb2NhbERhdGUgPSBuZXcgRGF0ZSh1bml4VGltZSAqIDEwMDApO1xuICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XG4gICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lICsgdGltZXpvbmUgKiAxMDAwO1xuICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IG5ldyBEYXRlKHVuaXhUaW1lSW5TZWFyY2hlZENpdHkpO1xuICAgIGNvbnN0IGhvdXJzID0gZGF0ZUluU2VhcmNoZWRDaXR5LmdldEhvdXJzKCk7XG4gICAgY29uc3QgbWludXRlcyA9IGAwJHtkYXRlSW5TZWFyY2hlZENpdHkuZ2V0TWludXRlcygpfWA7XG4gICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IGAke2hvdXJzfToke21pbnV0ZXMuc3Vic3RyKC0yKX1gO1xuICAgIHJldHVybiBmb3JtYXR0ZWRUaW1lO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JlY2FzdFdlYXRoZXIge1xuICBjb25zdHJ1Y3Rvcihmb3JlY2FzdFdlYXRoZXJEYXRhKSB7XG4gICAgdGhpcy50ZW1wZXJhdHVyZXMgPSB0aGlzLmdldFRlbXBlcmF0dXJlcyhmb3JlY2FzdFdlYXRoZXJEYXRhKTtcbiAgICB0aGlzLndlYXRoZXJDb25kaXRpb24gPSB0aGlzLmdldFdlYXRoZXJDb25kaXRpb25zKGZvcmVjYXN0V2VhdGhlckRhdGEpO1xuICAgIHRoaXMudGltZSA9IHRoaXMuZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSk7XG4gIH1cblxuICBnZXRUZW1wZXJhdHVyZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IFtdO1xuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wID0gTWF0aC5yb3VuZChpdGVtLm1haW4udGVtcCk7XG4gICAgICB0ZW1wZXJhdHVyZXMucHVzaCh0ZW1wKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGVtcGVyYXR1cmVzO1xuICB9XG5cbiAgZ2V0V2VhdGhlckNvbmRpdGlvbnMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IHdlYXRoZXJDb25kaXRpb24gPSBbXTtcbiAgICBmb3JlY2FzdFdlYXRoZXJEYXRhLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgY29uZCA9IGl0ZW0ud2VhdGhlclswXS5tYWluO1xuICAgICAgd2VhdGhlckNvbmRpdGlvbi5wdXNoKGNvbmQpO1xuICAgIH0pO1xuICAgIHJldHVybiB3ZWF0aGVyQ29uZGl0aW9uO1xuICB9XG5cbiAgZ2V0VGltZXMoZm9yZWNhc3RXZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IHRpbWVzID0gW107XG4gICAgY29uc3QgeyB0aW1lem9uZSB9ID0gZm9yZWNhc3RXZWF0aGVyRGF0YS5jaXR5O1xuICAgIGZvcmVjYXN0V2VhdGhlckRhdGEubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5jb252ZXJ0VG9TZWFyY2hlZENpdHlUaW1lKGl0ZW0sIHRpbWV6b25lKTtcbiAgICAgIHRpbWVzLnB1c2godGltZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRpbWVzO1xuICB9XG5cbiAgY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSh1bml4VGltZSwgdGltZXpvbmUpIHtcbiAgICBjb25zdCBsb2NhbERhdGUgPSBuZXcgRGF0ZSh1bml4VGltZS5kdCAqIDEwMDApO1xuICAgIGNvbnN0IHV0Y1VuaXhUaW1lID0gbG9jYWxEYXRlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XG4gICAgY29uc3QgdW5peFRpbWVJblNlYXJjaGVkQ2l0eSA9IHV0Y1VuaXhUaW1lICsgdGltZXpvbmUgKiAxMDAwO1xuICAgIGNvbnN0IGRhdGVJblNlYXJjaGVkQ2l0eSA9IG5ldyBEYXRlKHVuaXhUaW1lSW5TZWFyY2hlZENpdHkpO1xuICAgIGNvbnN0IGhvdXJzID0gZGF0ZUluU2VhcmNoZWRDaXR5LmdldEhvdXJzKCk7XG4gICAgY29uc3QgdGltZSA9IGAke2hvdXJzfTowMGA7XG4gICAgcmV0dXJuIHRpbWU7XG4gIH1cbn1cbiIsImltcG9ydCBDdXJyZW50V2VhdGhlciBmcm9tIFwiLi9jdXJyZW50V2VhdGhlclwiO1xuaW1wb3J0IEZvcmVjYXN0V2VhdGhlciBmcm9tIFwiLi9mb3JlY2FzdFdlYXRoZXJcIjtcbmltcG9ydCBDaXR5SW5mbyBmcm9tIFwiLi9jaXR5SW5mb1wiO1xuaW1wb3J0IEFQSXMgZnJvbSBcIi4vQVBJc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB0aGlzLkFQSXMgPSBuZXcgQVBJcygpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2l0eUluZm8oY2l0eSwgdW5pdCkge1xuICAgIGNvbnN0IEFwaURhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgIGNvbnN0IGNpdHlJbmZvID0gbmV3IENpdHlJbmZvKEFwaURhdGEpO1xuICAgIGNvbnNvbGUubG9nKGNpdHlJbmZvKTtcbiAgfVxuXG4gIGFzeW5jIGdldEN1cnJlbnRXZWF0aGVyKGNpdHksIHVuaXQpIHtcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlckRhdGEgPSBhd2FpdCB0aGlzLkFQSXMuZ2V0Q3VycmVudFdlYXRoZXJEYXRhKGNpdHksIHVuaXQpO1xuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyID0gbmV3IEN1cnJlbnRXZWF0aGVyKGN1cnJlbnRXZWF0aGVyRGF0YSk7XG4gICAgY29uc29sZS5sb2coY3VycmVudFdlYXRoZXIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Rm9yZWNhc3RXZWF0aGVyKGNpdHksIHVuaXQpIHtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXJEYXRhID0gYXdhaXQgdGhpcy5BUElzLmdldEZvcmVjYXN0V2VhdGhlckRhdGEoY2l0eSwgdW5pdCk7XG4gICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyID0gbmV3IEZvcmVjYXN0V2VhdGhlcihmb3JlY2FzdFdlYXRoZXJEYXRhKTtcbiAgICBjb25zb2xlLmxvZyhmb3JlY2FzdFdlYXRoZXIpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlld1xue1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgfVxufSIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyBmcm9tIFwiLSEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vaW1hZ2VzL21hZ25pZnkucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiOnJvb3Qge1xcbiAgLS1jbHItbmV1dHJhbDogaHNsKDAsIDAlLCAxMDAlKTtcXG4gIC0tY2xyLW5ldXRyYWwtdHJhbnNwOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTcxKTtcXG4gIC0tZmYtcHJpbWFyeTogXFxcIlBvcHBpbnNcXFwiLCBzYW5zLXNlcmlmO1xcbiAgLS1mdy0zMDA6IDMwMDtcXG4gIC0tZnctNDAwOiA0MDA7XFxuICAtLWZ3LTUwMDogNTAwO1xcbiAgLS1mdy02MDA6IDYwMDtcXG4gIC0tZnctNzAwOiA3MDA7XFxufVxcblxcbiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5ib2R5IHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxMiwgMjA3LCAyMDcpO1xcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZmLXByaW1hcnkpO1xcbiAgY29sb3I6IHZhcigtLWNsci1uZXV0cmFsKTtcXG59XFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBwYWRkaW5nOiA0cmVtIDJyZW07XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5zZWFyY2gtd3JhcHBlciBpbnB1dCB7XFxuICB3aWR0aDogNDAlO1xcbiAgcGFkZGluZzogMTBweCAxMHB4IDEwcHggNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICBib3JkZXI6IG5vbmU7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjYWxjKDFyZW0gKyAwLjV2dyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmNpdHktaW5mbyBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy02MDApO1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbmgyIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTMwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9jb2ludGFpbmVyIGltZyB7XFxuICB3aWR0aDogY2FsYygxMHJlbSArIDEwdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaDEge1xcbiAgbWFyZ2luOiAwLjNyZW0gMDtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiB2YXIoLS1mdy00MDApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX3RlbXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9fZGV0YWlscyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XFxuICBwYWRkaW5nOiAycmVtIDRyZW07XFxuICBnYXA6IDRyZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbC10cmFuc3ApO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAwLjVyZW07XFxuICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0gaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDFyZW0gKyAxdncpO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzX19jb2x1bW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5mb3JlY2FzdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDFyZW0gMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mb3JlY2FzdF9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMnJlbSArIDN2dyk7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSwrQkFBK0I7RUFDL0IsZ0RBQWdEO0VBQ2hELG1DQUFtQztFQUNuQyxhQUFhO0VBQ2IsYUFBYTtFQUNiLGFBQWE7RUFDYixhQUFhO0VBQ2IsYUFBYTtBQUNmOztBQUVBOzs7RUFHRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsb0NBQW9DO0VBQ3BDLDhCQUE4QjtFQUM5Qix5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLDZCQUE2QjtFQUM3QixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLDRCQUE0QjtFQUM1QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLHlEQUE0QztFQUM1Qyw0QkFBNEI7RUFDNUIsZ0NBQWdDO0VBQ2hDLG1DQUFtQztFQUNuQyx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxxQkFBcUI7RUFDckIsMkNBQTJDO0FBQzdDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtFQUM3QixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQiwyQ0FBMkM7QUFDN0M7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybCguL25vcm1hbGl6ZS5jc3MpO1xcblxcbjpyb290IHtcXG4gIC0tY2xyLW5ldXRyYWw6IGhzbCgwLCAwJSwgMTAwJSk7XFxuICAtLWNsci1uZXV0cmFsLXRyYW5zcDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE3MSk7XFxuICAtLWZmLXByaW1hcnk6IFxcXCJQb3BwaW5zXFxcIiwgc2Fucy1zZXJpZjtcXG4gIC0tZnctMzAwOiAzMDA7XFxuICAtLWZ3LTQwMDogNDAwO1xcbiAgLS1mdy01MDA6IDUwMDtcXG4gIC0tZnctNjAwOiA2MDA7XFxuICAtLWZ3LTcwMDogNzAwO1xcbn1cXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMTIsIDIwNywgMjA3KTtcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mZi1wcmltYXJ5KTtcXG4gIGNvbG9yOiB2YXIoLS1jbHItbmV1dHJhbCk7XFxufVxcblxcbm1haW4ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogNHJlbSAycmVtO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uc2VhcmNoLXdyYXBwZXIgaW5wdXQge1xcbiAgd2lkdGg6IDQwJTtcXG4gIHBhZGRpbmc6IDEwcHggMTBweCAxMHB4IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiAycmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uL2ltYWdlcy9tYWduaWZ5LnBuZyk7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNhbGMoMXJlbSArIDAuNXZ3KTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY2l0eS1pbmZvIGgxIHtcXG4gIG1hcmdpbjogMC4zcmVtIDA7XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTYwMCk7XFxuICBmb250LXNpemU6IDIuNXJlbTtcXG59XFxuXFxuaDIge1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICBmb250LXdlaWdodDogdmFyKC0tZnctMzAwKTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX2NvaW50YWluZXIgaW1nIHtcXG4gIHdpZHRoOiBjYWxjKDEwcmVtICsgMTB2dyk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfY29pbnRhaW5lciBoMSB7XFxuICBtYXJnaW46IDAuM3JlbSAwO1xcbiAgZm9udC1zaXplOiA0cmVtO1xcbiAgZm9udC13ZWlnaHQ6IHZhcigtLWZ3LTQwMCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfdGVtcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY3VycmVudC13ZWF0aGVyX19kZXRhaWxzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgaGVpZ2h0OiBtYXgtY29udGVudDtcXG4gIHBhZGRpbmc6IDJyZW0gNHJlbTtcXG4gIGdhcDogNHJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNsci1uZXV0cmFsLXRyYW5zcCk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2l0ZW0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDAuNXJlbTtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxuLmN1cnJlbnQtd2VhdGhlcl9faXRlbSBpbWcge1xcbiAgd2lkdGg6IGNhbGMoMXJlbSArIDF2dyk7XFxufVxcblxcbi5jdXJyZW50LXdlYXRoZXJfX2RldGFpbHNfX2NvbHVtbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLmZvcmVjYXN0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZzogMXJlbSAycmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2xyLW5ldXRyYWwtdHJhbnNwKTtcXG59XFxuXFxuLmZvcmVjYXN0X19pdGVtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLmZvcmVjYXN0X19pdGVtIGltZyB7XFxuICB3aWR0aDogY2FsYygycmVtICsgM3Z3KTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuIGh0bWwge1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogU2VjdGlvbnNcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGJvZHkge1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICAgKi9cXG4gIFxcbiAgbWFpbiB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gICAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgaDEge1xcbiAgICBmb250LXNpemU6IDJlbTtcXG4gICAgbWFyZ2luOiAwLjY3ZW0gMDtcXG4gIH1cXG4gIFxcbiAgLyogR3JvdXBpbmcgY29udGVudFxcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAgICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICAgKi9cXG4gIFxcbiAgaHIge1xcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHByZSB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbiAgfVxcbiAgXFxuICAvKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgYSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICAgKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGFiYnJbdGl0bGVdIHtcXG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGIsXFxuICBzdHJvbmcge1xcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgY29kZSxcXG4gIGtiZCxcXG4gIHNhbXAge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzbWFsbCB7XFxuICAgIGZvbnQtc2l6ZTogODAlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAgICogYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIHN1YixcXG4gIHN1cCB7XFxuICAgIGZvbnQtc2l6ZTogNzUlO1xcbiAgICBsaW5lLWhlaWdodDogMDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIHN1YiB7XFxuICAgIGJvdHRvbTogLTAuMjVlbTtcXG4gIH1cXG4gIFxcbiAgc3VwIHtcXG4gICAgdG9wOiAtMC41ZW07XFxuICB9XFxuICBcXG4gIC8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBpbWcge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qIEZvcm1zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0LFxcbiAgb3B0Z3JvdXAsXFxuICBzZWxlY3QsXFxuICB0ZXh0YXJlYSB7XFxuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgICBtYXJnaW46IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gICAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgaW5wdXQgeyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAgICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIHNlbGVjdCB7IC8qIDEgKi9cXG4gICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXSxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gICAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBmaWVsZHNldCB7XFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAgICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAgICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgbGVnZW5kIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gICAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gICAqL1xcbiAgXFxuICBwcm9ncmVzcyB7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZXh0YXJlYSB7XFxuICAgIG92ZXJmbG93OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAgICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcbiAgW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbiAgW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gICAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICAgKi9cXG4gIFxcbiAgW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICAgIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogSW50ZXJhY3RpdmVcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGRldGFpbHMge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLypcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdW1tYXJ5IHtcXG4gICAgZGlzcGxheTogbGlzdC1pdGVtO1xcbiAgfVxcbiAgXFxuICAvKiBNaXNjXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gICAqL1xcbiAgXFxuICB0ZW1wbGF0ZSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgW2hpZGRlbl0ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztDQUVEO0lBQ0csaUJBQWlCLEVBQUUsTUFBTTtJQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0VBQ3hDOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxTQUFTO0VBQ1g7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLGNBQWM7SUFDZCxnQkFBZ0I7RUFDbEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7SUFDRSx1QkFBdUIsRUFBRSxNQUFNO0lBQy9CLFNBQVMsRUFBRSxNQUFNO0lBQ2pCLGlCQUFpQixFQUFFLE1BQU07RUFDM0I7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsaUNBQWlDLEVBQUUsTUFBTTtJQUN6QyxjQUFjLEVBQUUsTUFBTTtFQUN4Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsNkJBQTZCO0VBQy9COztFQUVBOzs7SUFHRTs7RUFFRjtJQUNFLG1CQUFtQixFQUFFLE1BQU07SUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0VBQzNDOztFQUVBOztJQUVFOztFQUVGOztJQUVFLG1CQUFtQjtFQUNyQjs7RUFFQTs7O0lBR0U7O0VBRUY7OztJQUdFLGlDQUFpQyxFQUFFLE1BQU07SUFDekMsY0FBYyxFQUFFLE1BQU07RUFDeEI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxjQUFjO0lBQ2QsY0FBYztJQUNkLGtCQUFrQjtJQUNsQix3QkFBd0I7RUFDMUI7O0VBRUE7SUFDRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO2lGQUMrRTs7RUFFL0U7O0lBRUU7O0VBRUY7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7aUZBQytFOztFQUUvRTs7O0lBR0U7O0VBRUY7Ozs7O0lBS0Usb0JBQW9CLEVBQUUsTUFBTTtJQUM1QixlQUFlLEVBQUUsTUFBTTtJQUN2QixpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLFNBQVMsRUFBRSxNQUFNO0VBQ25COztFQUVBOzs7SUFHRTs7RUFFRjtVQUNRLE1BQU07SUFDWixpQkFBaUI7RUFDbkI7O0VBRUE7OztJQUdFOztFQUVGO1dBQ1MsTUFBTTtJQUNiLG9CQUFvQjtFQUN0Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLDBCQUEwQjtFQUM1Qjs7RUFFQTs7SUFFRTs7RUFFRjs7OztJQUlFLGtCQUFrQjtJQUNsQixVQUFVO0VBQ1o7O0VBRUE7O0lBRUU7O0VBRUY7Ozs7SUFJRSw4QkFBOEI7RUFDaEM7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSw4QkFBOEI7RUFDaEM7O0VBRUE7Ozs7O0lBS0U7O0VBRUY7SUFDRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLGVBQWUsRUFBRSxNQUFNO0lBQ3ZCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLG1CQUFtQixFQUFFLE1BQU07RUFDN0I7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSxjQUFjO0VBQ2hCOztFQUVBOzs7SUFHRTs7RUFFRjs7SUFFRSxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLFVBQVUsRUFBRSxNQUFNO0VBQ3BCOztFQUVBOztJQUVFOztFQUVGOztJQUVFLFlBQVk7RUFDZDs7RUFFQTs7O0lBR0U7O0VBRUY7SUFDRSw2QkFBNkIsRUFBRSxNQUFNO0lBQ3JDLG9CQUFvQixFQUFFLE1BQU07RUFDOUI7O0VBRUE7O0lBRUU7O0VBRUY7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7OztJQUdFOztFQUVGO0lBQ0UsMEJBQTBCLEVBQUUsTUFBTTtJQUNsQyxhQUFhLEVBQUUsTUFBTTtFQUN2Qjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsY0FBYztFQUNoQjs7RUFFQTs7SUFFRTs7RUFFRjtJQUNFLGtCQUFrQjtFQUNwQjs7RUFFQTtpRkFDK0U7O0VBRS9FOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmOztFQUVBOztJQUVFOztFQUVGO0lBQ0UsYUFBYTtFQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbiBodG1sIHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIFNlY3Rpb25zXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBib2R5IHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAgICovXFxuICBcXG4gIG1haW4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICAgKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIGgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxuICB9XFxuICBcXG4gIC8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gICAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAgICovXFxuICBcXG4gIGhyIHtcXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gICAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICAgIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBwcmUge1xcbiAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gICAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG4gIH1cXG4gIFxcbiAgLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIGEge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAgICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBhYmJyW3RpdGxlXSB7XFxuICAgIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBiLFxcbiAgc3Ryb25nIHtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGNvZGUsXFxuICBrYmQsXFxuICBzYW1wIHtcXG4gICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICAgIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc21hbGwge1xcbiAgICBmb250LXNpemU6IDgwJTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gICAqIGFsbCBicm93c2Vycy5cXG4gICAqL1xcbiAgXFxuICBzdWIsXFxuICBzdXAge1xcbiAgICBmb250LXNpemU6IDc1JTtcXG4gICAgbGluZS1oZWlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbiAgfVxcbiAgXFxuICBzdWIge1xcbiAgICBib3R0b206IC0wLjI1ZW07XFxuICB9XFxuICBcXG4gIHN1cCB7XFxuICAgIHRvcDogLTAuNWVtO1xcbiAgfVxcbiAgXFxuICAvKiBFbWJlZGRlZCBjb250ZW50XFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKipcXG4gICAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICAgKi9cXG4gIFxcbiAgaW1nIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKiBGb3Jtc1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gICAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBpbnB1dCxcXG4gIG9wdGdyb3VwLFxcbiAgc2VsZWN0LFxcbiAgdGV4dGFyZWEge1xcbiAgICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gICAgbWFyZ2luOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICAgKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbixcXG4gIGlucHV0IHsgLyogMSAqL1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gICAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBidXR0b24sXFxuICBzZWxlY3QgeyAvKiAxICovXFxuICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICAgKi9cXG4gIFxcbiAgYnV0dG9uLFxcbiAgW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcbiAgW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuICBbdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAgICovXFxuICBcXG4gIGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG4gIFt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcbiAgW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gICAqL1xcbiAgXFxuICBidXR0b246LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuICBbdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG4gIFt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICAgIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICAgKi9cXG4gIFxcbiAgZmllbGRzZXQge1xcbiAgICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gICAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gICAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAgICovXFxuICBcXG4gIGxlZ2VuZCB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gICAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gICAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gICAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICAgKi9cXG4gIFxcbiAgcHJvZ3Jlc3Mge1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gICAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gICAqL1xcbiAgXFxuICBbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG4gIFt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwOyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG4gIFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIGhlaWdodDogYXV0bztcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gICAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICAgIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qKlxcbiAgICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAgICovXFxuICBcXG4gIFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIH1cXG4gIFxcbiAgLyoqXFxuICAgKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAgICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAgICovXFxuICBcXG4gIDo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgICBmb250OiBpbmhlcml0OyAvKiAyICovXFxuICB9XFxuICBcXG4gIC8qIEludGVyYWN0aXZlXFxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcbiAgXFxuICAvKlxcbiAgICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gICAqL1xcbiAgXFxuICBkZXRhaWxzIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuICBcXG4gIC8qXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICAgKi9cXG4gIFxcbiAgc3VtbWFyeSB7XFxuICAgIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG4gIH1cXG4gIFxcbiAgLyogTWlzY1xcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG4gIFxcbiAgLyoqXFxuICAgKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICAgKi9cXG4gIFxcbiAgdGVtcGxhdGUge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbiAgXFxuICAvKipcXG4gICAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAgICovXFxuICBcXG4gIFtoaWRkZW5dIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpOyAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cblxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH0gLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuXG5cbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuLi9zdHlsZXMvbWFpbi5jc3NcIjtcblxuaW1wb3J0IE1haW5Nb2RlbCBmcm9tIFwiLi9tb2RlbHMvbWFpbk1vZGVsXCI7XG5pbXBvcnQgTWFpblZpZXcgZnJvbSBcIi4vdmlld3MvbWFpblZpZXdcIjtcbmltcG9ydCBNYWluQ29udHJvbGxlciBmcm9tIFwiLi9jb250cm9sbGVycy9tYWluQ29udHJvbGxlclwiO1xuXG5jb25zdCBtb2RlbCA9IG5ldyBNYWluTW9kZWwoKTtcbmNvbnN0IHZpZXcgPSBuZXcgTWFpblZpZXcoKTtcbmNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgTWFpbkNvbnRyb2xsZXIobW9kZWwsIHZpZXcpO1xuIl0sIm5hbWVzIjpbIk1haW5Db250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsInZpZXciLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiY2FsbEZ1bmMiLCJnZXRDaXR5SW5mbyIsImdldEN1cnJlbnRXZWF0aGVyIiwiZ2V0Rm9yZWNhc3RXZWF0aGVyIiwiQVBJcyIsInVybEdlbmVyYXRvciIsIlVybEdlbmVyYXRvciIsImdldEdlb0Nvb3JkaW5hdGVzIiwiY2l0eSIsInVybCIsImdlbmVyYXRlR2VvQ29vcmRzVXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1vZGUiLCJnZW9jb2RpbmdEYXRhIiwianNvbiIsImxhdCIsImxvbiIsImdldEN1cnJlbnRXZWF0aGVyRGF0YSIsInVuaXQiLCJnZW5lcmF0ZUN1cnJlbnRXZWF0aGVyVXJsIiwid2VhdGhlckRhdGEiLCJnZXRGb3JlY2FzdFdlYXRoZXJEYXRhIiwiZ2VuZXJhdGVGb3JlY2FzdFdlYXRoZXJVcmwiLCJmb3JlY2FzdERhdGEiLCJhcHBJZCIsImJhc2VVcmwiLCJDaXR5SW5mbyIsIkFwaURhdGEiLCJjaXR5RGVzY3JpcHRpb24iLCJjcmVhdGVDaXR5RGVzY3JpcHRpb24iLCJkYXRlRGVzY3JpcHRpb24iLCJjcmVhdGVEYXRlRGVzY3JpcHRpb24iLCJuYW1lIiwiY291bnRyeSIsInN5cyIsImRheSIsImdldERheSIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsIndlZWtkYXkiLCJkIiwiRGF0ZSIsIm1vbnRoTmFtZXMiLCJDdXJyZW50V2VhdGhlciIsImN1cnJlbnRXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlIiwiTWF0aCIsInJvdW5kIiwibWFpbiIsInRlbXAiLCJ3ZWF0aGVyQ29uZGl0aW9uRGVzYyIsIndlYXRoZXIiLCJkZXNjcmlwdGlvbiIsIndlYXRoZXJDb25kaXRpb25JbWciLCJmZWVsc0xpa2VUZW1wIiwiZmVlbHNfbGlrZSIsImh1bWlkaXR5Iiwid2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwicHJlc3N1cmUiLCJzdW5yaXNlIiwiY29udmVydFRvU2VhcmNoZWRDaXR5VGltZSIsInRpbWV6b25lIiwic3Vuc2V0IiwidW5peFRpbWUiLCJsb2NhbERhdGUiLCJ1dGNVbml4VGltZSIsImdldFRpbWUiLCJnZXRUaW1lem9uZU9mZnNldCIsInVuaXhUaW1lSW5TZWFyY2hlZENpdHkiLCJkYXRlSW5TZWFyY2hlZENpdHkiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJmb3JtYXR0ZWRUaW1lIiwic3Vic3RyIiwiRm9yZWNhc3RXZWF0aGVyIiwiZm9yZWNhc3RXZWF0aGVyRGF0YSIsInRlbXBlcmF0dXJlcyIsImdldFRlbXBlcmF0dXJlcyIsIndlYXRoZXJDb25kaXRpb24iLCJnZXRXZWF0aGVyQ29uZGl0aW9ucyIsInRpbWUiLCJnZXRUaW1lcyIsImxpc3QiLCJmb3JFYWNoIiwiaXRlbSIsInB1c2giLCJjb25kIiwidGltZXMiLCJkdCIsIk1haW5Nb2RlbCIsImRhdGEiLCJjaXR5SW5mbyIsImNvbnNvbGUiLCJsb2ciLCJjdXJyZW50V2VhdGhlciIsImZvcmVjYXN0V2VhdGhlciIsIk1haW5WaWV3IiwiY29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiIn0=