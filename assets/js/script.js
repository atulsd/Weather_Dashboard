$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
  //https://api.openweathermap.org/data/2.5/forecast?q=Austin&appid=4989a668363ee1641a25c82bbed4d190
  //var term = document.querySelector(".form-control.text");
  var storedCity = localStorage.getItem("searchedCity");
  term = storedCity;
  alert("stored City is:" + storedCity);
  if (term === null) {
    alert("Inside null:" + term);
    term = "";
  } else {
    term = localStorage.getItem("searchedCity");
    alert("From local storage " + term);
  }

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    term +
    "&appid=" +
    apiKey;

  var buttonValue = document.querySelector(".btn");
  buttonValue.addEventListener("click", function(event) {
    event.preventDefault();
    $("#results").empty();
    term = $(".form-control").val();
    alert("Valu is" + term);
    queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      term +
      "&appid=" +
      apiKey;
    callAjax();
  });

  callAjax();
  function callAjax() {
    alert("Inside Ajax function.");
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        // .btn.preventDefault();
        // $(".btn").on("click", displayResult);
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
