import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    const inputValue = e.target.value.trim();
    if (!inputValue) {
      return emptyMarkup();
    }
    fetchCountries(inputValue).then(countryMarkup).catch(error);
  }, DEBOUNCE_DELAY)
);

function countryMarkup(data) {
  if (data.length > 10) {
    emptyMarkup();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length >= 2 && data.length < 10) {
    markupFromTwoCountries(data);
  } else {
    markupOneCountry(data);
  }
}

function error(e) {
  emptyMarkup();
  Notify.failure('Oops, there is no country with that name');
}

function emptyMarkup() {
  countryInfo.innerHTML = '';
}

function markupFromTwoCountries(data) {
  const countriesMarkup = data
    .map(value => {
      return `<p style="font-size: 20px"><img src="${value.flags.svg}" alt='flag' width = '40' heigth = '40'/>${value.name.official}</p>`;
    })
    .join('');
  countryInfo.innerHTML = countriesMarkup;
}

function markupOneCountry(data) {
  countryInfo.innerHTML = `
    <p style="font-size: 38px"><img src="${
      data[0].flags.svg
    }" alt='flag' width='40' heigth='40'/>${data[0].name.official}</p>
    <p><b>Capital:</b> ${data[0].capital}</p>
    <p><b>Population:</b> ${data[0].population}</p>
    <p><b>Languages:</b> ${Object.values(data[0].languages)}</p>`;
}
