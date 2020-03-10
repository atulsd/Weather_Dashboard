$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
  const uvIndex = 0;
  //https://api.openweathermap.org/data/2.5/forecast?q=Austin&appid=4989a668363ee1641a25c82bbed4d190
  //var city = document.querySelector(".form-control.text");
  var storedCity = localStorage.getItem("searchedCity");
  city = storedCity;

  if (city === null) {
    city = "";
  } else {
    city = localStorage.getItem("searchedCity");
  }

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey;

  var searchButton = document.querySelector(".btn");

  searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    $("#results").empty();
    city = $(".form-control").val();
    if (city === "") {
      alert("Please enter a city.");
    }
    var cityList = $("<li>");
    cityList.append(city);
    $(".list-group").append(cityList);
    queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      apiKey;
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
          localStorage.setItem("searchedCity", response.city.name);
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
