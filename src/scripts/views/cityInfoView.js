export default class CityInfoView {
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
