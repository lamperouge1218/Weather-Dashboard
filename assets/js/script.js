var APIkey = "22699aa722b7a79950a6f5dfaa6a318e";
var inputField = $("#inputfield");
var searchButton = $(".searchBtn");
var ulEl = $(".ul");
var form = $(".input-group");

function getAPI(event) {
    event.preventDefault();
    var city = $(inputField).val();
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    var cityName = $("#cityName");
    var today = moment().format("MMM/D/YYYY");
    // console.log(today);
    $(cityName).text(city + ", " + today);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;

            $("#temp").text("Temp: " + temp + "°");
            $("#wind").text("Wind Speed: " + wind + " MPH");
            $("#humidity").text("Humidity: " + humidity + "%");

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            var requestUrlUv = "https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

            fetch(requestUrlUv)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // console.log(data);
                    $("#uvIndex").text("UV Index: " + data.current.uvi);
                    var uvColor = data.current.uvi;

                    // console.log(uvColor);
                    if (uvColor < 3) {
                        $("#uvIndex").attr("class", "bg-success text-white");
                    } else if (uvColor >= 3 && uvColor < 6) {
                        $("#uvIndex").attr("class", "bg-warning text-white");
                    } else if (uvColor >= 6 && uvColor < 8) {
                        $("#uvIndex").attr("class", "bg-orange text-white");
                    } else if (uvColor >= 8 && uvColor < 11) {
                        $("#uvIndex").attr("class", "bg-danger text-white");
                    } else if (uvColor >= 11) {
                        $("#uvIndex").attr("class", "bg-violet text-white");
                    }

                    var wf = ""; // start here for refactoring
                    wf += "<b>" + city + "</b>"; // City (displays once)
                    $.each(data.daily, function (index, val) {
                        if (index < 5) {
                            wf += "<p>"; // Opening paragraph tag
                            wf += "<b>Day " + (index + 1) + "</b>: "; // Day
                            wf += "Temp: " + val.temp.day + "&degF | ";
                            wf += "Wind: " + val.wind_speed + " MPH | ";
                            wf += "Humidity: " + val.humidity + "%";
                            wf +=
                                '<img src= "https://openweathermap.org/img/wn/' + //good link format
                                val.weather[0].icon +
                                '@2x.png">'; // Icon
                            wf += "<span>" + val.weather[0].description + "</span>"; // Description
                            wf += "</p>"; // Closing paragraph tag
                        }
                    });
                    $("#forecast").html(wf); // equivalent to .innerHTML from vanilla
                    cityHistory();
                });
        });
};


var cityHistoryArr = [];

function cityHistory() {
    var historyCity = $(inputField).val();
    cityHistoryArr.push("<button class = 'historyBtn' value ='" + historyCity + "'>" + historyCity + "</button>");
    localStorage.setItem("historyArr", JSON.stringify(cityHistoryArr));
    console.log(cityHistoryArr);
    $("#history").html(cityHistoryArr);
    var historyBtn = $(".historyBtn").val();
    $(".historyBtn").on("click", historySearch);

    function historySearch(event) {
        event.preventDefault();
        var historyButton = $(event.target);
        console.log(historyButton);
        getAPI(event, historyButton.val());
    };
};

searchButton.on("click", getAPI);





// GIVEN a weather dashboard with form inputs

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city





// $("#history").on("click", historySearch);

// function historySearch(event) {
//     event.preventDefault();
//     var historyButton = $(event.target);
//     console.log(historyButton);
//     getAPI(historyButton.text());
// };