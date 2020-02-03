'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('.js-error').empty();
  $('.results-list').empty();

  for (let i = 0; (i < responseJson.data.length) & (i < maxResults); i++) {
    $('.results-list')
      .append(`<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        <p>
        Address: ${responseJson.data[i].addresses[1].line1}
        </p>
        <p>
        City, state, ZIP Code: ${responseJson.data[i].addresses[1].city} 
        ${responseJson.data[i].addresses[1].stateCode}
        ${responseJson.data[i].addresses[1].postalCode}     
        </p>
        <p>${responseJson.data[i].addresses[1].line2}</p>
        </li>`);
    //         postalCode: "84764"
    // city: "Bryce"
    // stateCode: "UT"
    // line1: "Highway 63"
    // type: "Physical"
    // line3: ""
    // line2: "Bryce Canyon National Park"
  }
  $('.results').removeClass('hidden');
}

function getParks(baseUrl, stateArr, maxResults, apiKey) {
  const params = {
    stateCode: stateArr,
    limit: maxResults
  };

  const queryString = formatQueryParams(params);
  const url =
    baseUrl + queryString + '&fields=addresses' + '&api_key=' + apiKey;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('.js-error').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('.js-form').on('submit', function() {
    event.preventDefault();
    const baseUrl = 'https://api.nps.gov/api/v1/parks?';

    const stateArr = $('.js-state-entered')
      .val()
      .split(',');
    const maxResults = $('.js-result-amt').val();
    const apiKey = 'Fi7Jld1tPRqhnt8xLhHExPHXM7eUDsuXOgLvzILT';
    getParks(baseUrl, stateArr, maxResults, apiKey);
  });
}

$(watchForm);
