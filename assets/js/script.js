$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
  const uvIndex = 0;
  var found = 0;

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
      if (storedCity.name[i] != "" && storedCity.name[i] != "No data") {
        var cityList = $("<li>").addClass("list-group-item");
        cityList.text(storedCity.name[i]);
        $("#search-history").append(cityList);
      }
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
      var cityList = $("<li>").addClass("list-group-item");
      cityList.text(city);
      $("#search-history").append(cityList);
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
          $("#results").empty();

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

          var imageIcon = $("<img>");
          $(imageIcon).attr("src", iconurl);

          var displayDate = response.list[0].dt_txt;
          var getDate = "";
          var year = "";
          var month = "";
          for (var i = 0; i < 10; i++) {
            if (i < 4) year += displayDate[i];
            if (i > 4 && i < 7) month += displayDate[i];
            if (i > 7 && i < 10) getDate += displayDate[i];
          }
          var changeDateformat = getDate + "/" + month + "/" + year;
          $("#setName").text("");
          $("#setDate").text("");
          $("#setIcon").text("");

          $("#setName").append("<h3>" + response.city.name);
          $("#setDate").append("<h3>(" + changeDateformat + ")");
          $("#setIcon").append(imageIcon);

          $("#results").append(
            "Weather Description: " +
              response.list[0].weather[0].description +
              "<br>"
          );

          var highTemp = 0;
          highTemp = response.list[0].main.temp;

          var checkTemp = 0;
          var checkHumi = 0;

          var currentTime = response.list[0].dt_txt;
          var checkTime = currentTime[11] + currentTime[12];
          var loopTime = 0;
          if (checkTime === "00") {
            loopTime = 8;
          } else if (checkTime === "03") {
            loopTime = 7;
          } else if (checkTime === "06") {
            loopTime = 6;
          } else if (checkTime === "09") {
            loopTime = 5;
          } else if (checkTime === "12") {
            loopTime = 4;
          } else if (checkTime === "15") {
            loopTime = 3;
          } else if (checkTime === "18") {
            loopTime = 2;
          } else if (checkTime === "21") {
            loopTime = 1;
          }

          iconcode = response.list[0].weather[0].icon;
          iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var highHumi = 0;
          highHumi = response.list[0].main.humidity;
          var looped = 0;
          for (var i = 0; i < loopTime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTemp < checkTemp) {
              highTemp = checkTemp;
            }
            if (highHumi < checkHumi) {
              highHumi = checkHumi;
            }
            looped++;
          }

          iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          day1Looptime = loopTime + 8;
          day2Looptime = day1Looptime + 8;
          day3Looptime = day2Looptime + 8;
          day4Looptime = day3Looptime + 8;
          day5Looptime = 40;

          var highTempday1 = 0;
          var humidityDay1 = 0;
          for (var i = looped; i < day1Looptime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTempday1 < checkTemp) {
              highTempday1 = checkTemp;
            }
            if (humidityDay1 < checkHumi) {
              humidityDay1 = checkHumi;
            }
            looped++;
          }

          var iconurl1 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var highTempday2 = 0;
          var humidityDay2 = 0;
          for (var i = looped; i < day2Looptime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTempday2 < checkTemp) {
              highTempday2 = checkTemp;
            }
            if (humidityDay2 < checkHumi) {
              humidityDay2 = checkHumi;
            }
            looped++;
          }

          var iconurl2 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var highTempday3 = 0;
          var humidityDay3 = 0;
          for (var i = looped; i < day3Looptime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTempday3 < checkTemp) {
              highTempday3 = checkTemp;
            }
            if (humidityDay3 < checkHumi) {
              humidityDay3 = checkHumi;
            }
            looped++;
          }

          var iconurl3 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var highTempday4 = 0;
          var humidityDay4 = 0;
          for (var i = looped; i < day4Looptime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTempday4 < checkTemp) {
              highTempday4 = checkTemp;
            }
            if (humidityDay4 < checkHumi) {
              humidityDay4 = checkHumi;
            }
            looped++;
          }

          var iconurl4 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var highTempday5 = 0;
          var humidityDay5 = 0;
          for (var i = looped; i < day5Looptime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            if (highTempday5 < checkTemp) {
              highTempday5 = checkTemp;
            }
            if (humidityDay5 < checkHumi) {
              humidityDay5 = checkHumi;
            }
            looped++;
          }
          var iconurl5 = "http://openweathermap.org/img/w/" + iconcode + ".png";

          var fahrenheit = (highTemp - 273.15) * 1.8 + 32;
          $("#results").append(
            "Temperature: " + fahrenheit.toFixed(2) + " &#8457;" + "<br>"
          );
          $("#results").append("Humidity: " + highHumi + "%" + "<br>");
          $("#results").append(
            "Wind Speed: " + response.list[0].wind.speed + " MPH" + "<br>"
          );
          $("#icon1").text("");
          $("#temp1").text("");
          $("#icon2").text("");
          $("#temp2").text("");
          $("#icon3").text("");
          $("#temp3").text("");
          $("#icon4").text("");
          $("#temp4").text("");
          $("#icon5").text("");
          $("#temp5").text("");

          fahrenheit = (highTempday1 - 273.15) * 1.8 + 32;
          var today = moment();
          var day1 = today.add("days", 1);
          $("#day1").text(moment(day1).format("DD/MM/YYYY"));
          var imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl1);
          $("#icon1").append(imageIcon1);
          $("#temp1").append("Temp: " + fahrenheit.toFixed(2) + " &#8457;");
          $("#hum1").text("Humidity: " + humidityDay1 + "%");

          fahrenheit = (highTempday2 - 273.15) * 1.8 + 32;
          var day2 = day1.add("days", 1);
          $("#day2").text(moment(day2).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl2);
          $("#temp2").append("Temp: " + fahrenheit.toFixed(2) + " &#8457;");
          $("#hum2").text("Humidity: " + humidityDay2 + "%");
          $("#icon2").append(imageIcon1);

          fahrenheit = (highTempday3 - 273.15) * 1.8 + 32;
          var day3 = day2.add("days", 1);
          $("#day3").text(moment(day3).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl3);
          $("#icon3").append(imageIcon1);
          $("#temp3").append("Temp: " + fahrenheit.toFixed(2) + " &#8457;");
          $("#hum3").text("Humidity: " + humidityDay3 + "%");

          fahrenheit = (highTempday4 - 273.15) * 1.8 + 32;
          var day4 = day3.add("days", 1);
          $("#day4").text(moment(day4).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl4);
          $("#icon4").append(imageIcon1);
          $("#temp4").append("Temp: " + fahrenheit.toFixed(2) + " &#8457;");
          $("#hum4").text("Humidity: " + humidityDay4 + "%");

          fahrenheit = (highTempday5 - 273.15) * 1.8 + 32;
          var day5 = day4.add("days", 1);
          $("#day5").text(moment(day5).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl5);
          $("#icon5").append(imageIcon1);
          $("#temp5").append("Temp: " + fahrenheit.toFixed(2) + " &#8457;");
          $("#hum5").text("Humidity: " + humidityDay5 + "%");
        }
      })
      .fail(function(response) {
        $("#results").append("<h1>No data found.<br>");
        $("#setName").text("");
        $("#setDate").text("");
        $("#setIcon").text("");
        $("#icon1").text("");
        $("#temp1").text("");
        $("#day1").text("No Data");
        $("#hum1").text("");
        $("#icon2").text("");
        $("#temp2").text("");
        $("#day2").text("No Data");
        $("#hum2").text("");
        $("#icon3").text("");
        $("#temp3").text("");
        $("#day3").text("No Data");
        $("#hum3").text("");
        $("#icon4").text("");
        $("#temp4").text("");
        $("#day4").text("No Data");
        $("#hum4").text("");
        $("#icon5").text("");
        $("#temp5").text("");
        $("#day5").text("No Data");
        $("#hum5").text("");
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
