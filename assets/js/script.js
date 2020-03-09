$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
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
});
