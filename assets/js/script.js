$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
  const uvIndex = 0;
  var found = 0;

  //https://api.openweathermap.org/data/2.5/forecast?q=Austin&appid=4989a668363ee1641a25c82bbed4d190
  var city = "";
  var startWeather = localStorage.getItem("startWeather");
  var storedCity = JSON.parse(localStorage.getItem("searchedCity"));
  var noofCitiesstored;
  var lastCitysearched;

  var loadingLocal;
  if (storedCity === null && startWeather === null) {
    localStorage.setItem("startWeather", "1");
    storedCity = { name: ["No data"] };
    localStorage.setItem("searchedCity", JSON.stringify(storedCity));
  } else {
    for (var i = 0; i < storedCity.name.length; i++) {
      var cityList = $("<li>");
      cityList.append(storedCity.name[i]);
      $(".list-group").append(cityList);
    }

    noofCitiesstored = storedCity.name.length - 1;
    lastCitysearched = storedCity.name[noofCitiesstored];
    var lastValue = localStorage.getItem("lastValue");
    if (lastValue === lastCitysearched) {
      localStorage.setItem("loadingLocal", "2");
    } else {
      localStorage.setItem("loadingLocal", "1");
    }
    localStorage.setItem("lastValue", lastCitysearched);
    city = lastCitysearched;
  }

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey;

  var searchButton = document.querySelector(".btn");

  searchButton.addEventListener("click", function(event) {
    found = 0;
    event.preventDefault();
    $("#results").empty();
    city = $(".form-control").val();
    if (city === "") {
      alert("Please enter a city.");
    } else {
      var cityList = $("<li>");
      cityList.append(city);
      $(".list-group").append(cityList);
      queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=" +
        apiKey;
    }
    noofCitiesstored = storedCity.name.length - 1;
    lastCitysearched = storedCity.name[noofCitiesstored];
    for (var i = 0; i < storedCity.name.length; i++) {
      if (storedCity.name[i] === city) {
        localStorage.setItem("loadingLocal", "2");
        found = 1;
      }
    }
    if (city === lastCitysearched) {
      localStorage.setItem("loadingLocal", "2");
    } else if (found === 0) {
      localStorage.setItem("loadingLocal", "1");
    }
    localStorage.setItem("lastValue", city);
    callAjax();
  });

  callAjax();
  function callAjax() {
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        displayResult();

        function displayResult() {
          var iconcode = response.list[0].weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var longitude = response.city.coord.lon;
          var latitude = response.city.coord.lat;
          var uvIndexurl =
            "https://api.openweathermap.org/data/2.5/uvi/forecast?q=" +
            city +
            "&appid=" +
            apiKey +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;
          getUvindex(uvIndexurl);
          loadingLocal = localStorage.getItem("loadingLocal");
          if (loadingLocal != 2) {
            storedCity.name.push(city);
            localStorage.setItem("searchedCity", JSON.stringify(storedCity));
          }
          $("#results").append("City: " + response.city.name + "<br>");
          $("#results").append("Date: " + response.list[0].dt_txt + "<br>");
          $("#results").append(
            "Weather Description: " +
              response.list[0].weather[0].description +
              "<br>"
          );
          $("#results").append(
            "Icon: " + response.list[0].weather[0].icon + "<br>"
          );
          $("#results").append(
            "Temprature: " + response.list[0].main.temp + "<br>"
          );
          $("#results").append(
            "Humidity: " + response.list[0].main.humidity + "<br>"
          );
          $("#results").append(
            "Wind Speed: " + response.list[0].wind.speed + "<br>"
          );

          var imageIcon = $("<img>");
          $(imageIcon).attr("src", iconurl);

          $("#results").append(imageIcon);
        }
      })
      .fail(function(response) {
        $("#results").append("<h1>No data found.<br>");
        storedCity.name.push(city);
        localStorage.setItem("searchedCity", JSON.stringify(storedCity));
      });
  }

  function getUvindex(uvIndexurl) {
    $.ajax({
      url: uvIndexurl,
      method: "GET"
    })
      .then(function(response) {
        var uvIndex = response[0].value;
        if (uvIndex < 3) {
          //Low green
          var colorUv = $("<label>");
          $(colorUv).css("background-color", "green");
          colorUv.append(uvIndex);

          $("#results").append("UV Index: ", colorUv);
        }
        if (uvIndex > 3 && uvIndex <= 6) {
          //Moderate yellow
          var colorUv = $("<label>");
          $(colorUv).css("background-color", "yellow");
          colorUv.append(uvIndex);
          $("#results").append("UV Index: ", colorUv);
        }
        if (uvIndex > 6 && uvIndex <= 8) {
          //High orange
          var colorUv = $("<label>");
          $(colorUv).css("background-color", "orange");
          colorUv.append(uvIndex);
          $("#results").append("UV Index: ", colorUv);
        }
        if (uvIndex > 8 && uvIndex <= 11) {
          //Very High red
          var colorUv = $("<label>");
          $(colorUv).css("background-color", "red");
          colorUv.append(uvIndex);
          $("#results").append("UV Index: ", colorUv);
        }
        if (uvIndex > 11) {
          //Extreme purple
          var colorUv = $("<label>");
          $(colorUv).css("background-color", "purple");
          colorUv.append(uvIndex);
          $("#results").append("UV Index: ", colorUv);
        }
      })
      .fail(function(response) {
        $("#results").append("<h1>No UV Index found.<br>");
      });
  }
});
