var apiKey = "4989a668363ee1641a25c82bbed4d190";
//https://api.openweathermap.org/data/2.5/forecast?q=Austin&appid=4989a668363ee1641a25c82bbed4d190
var term = "austin";
var queryURL =
  "https://api.openweathermap.org/data/2.5/forecast?q=" +
  term +
  "&appid=" +
  apiKey;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  // .btn.preventDefault();
  // $(".btn").on("click", displayResult);
  document.querySelector(".btn").addEventListener("click", function(event) {
    event.preventDefault();

    displayResult();
  });

  function displayResult() {
    var iconcode = response.list[0].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    $("#results").append("City: " + response.city.name + "<br>");
    $("#results").append("Date: " + response.list[0].dt_txt + "<br>");
    $("#results").append(
      "Weather Description: " + response.list[0].weather[0].description + "<br>"
    );
    $("#results").append("Icon: " + response.list[0].weather[0].icon + "<br>");
    $("#results").append("Temprature: " + response.list[0].main.temp + "<br>");
    $("#results").append(
      "Humidity: " + response.list[0].main.humidity + "<br>"
    );
    $("#results").append("Wind Speed: " + response.list[0].wind.speed + "<br>");

    var imageIcon = $("<img>");
    $(imageIcon).attr("src", iconurl);

    $("#results").append(imageIcon);
  }
});
