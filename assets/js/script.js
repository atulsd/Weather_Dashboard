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
    $("#container1").empty();
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
          $("#results").append("City: " + response.city.name);

          var imageIcon = $("<img>");
          $(imageIcon).attr("src", iconurl);

          $("#results").append(imageIcon);
          //$(".icon0").append(imageIcon);

          $("#results").append("<br>Date: " + response.list[0].dt_txt + "<br>");
          $("#results").append(
            "Weather Description: " +
              response.list[0].weather[0].description +
              "<br>"
          );
          // $("#results").append(
          //   "Icon: " + response.list[0].weather[0].icon + "<br>"
          // );
          var highTemp = 0;
          highTemp = response.list[0].main.temp;

          var checkTemp = 0;
          var checkHumi = 0;

          var currentTime = response.list[0].dt_txt;
          var checkTime = currentTime[11] + currentTime[12];
          //alert("Check time is:" + checkTime);
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

          //alert(currentTime[11]);
          //alert(currentTime[12]);
          iconcode = response.list[0].weather[0].icon;
          iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

          var highHumi = 0;
          highHumi = response.list[0].main.humidity;

          var looped = 0;
          for (var i = 0; i < loopTime; i++) {
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            alert("Check temp is:" + checkTemp);
            alert("looptime is:" + loopTime);
            if (highTemp < checkTemp) {
              highTemp = checkTemp;
            }
            if (highHumi < checkHumi) {
              highHumi = checkHumi;
            }
            looped++;
          }
          iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          //loopTime = 40 - loopTime;
          day1Looptime = loopTime + 8;
          day2Looptime = day1Looptime + 8;
          day3Looptime = day2Looptime + 8;
          day4Looptime = day3Looptime + 8;
          day5Looptime = 40;

          //alert("Total loop time left:" + loopTime);
          alert("Looped already:" + looped);
          var highTempday1 = 0;
          var humidityDay1 = 0;
          for (var i = looped; i < day1Looptime; i++) {
            //alert("Value of i is:" + i);
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            //alert("Check temp is:" + checkTemp);
            //alert("looptime is:" + loopTime);
            if (highTempday1 < checkTemp) {
              highTempday1 = checkTemp;
            }
            if (humidityDay1 < checkHumi) {
              humidityDay1 = checkHumi;
            }
            looped++;
          }
          var iconurl1 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          alert("Value of looped after day1:" + looped);
          var highTempday2 = 0;
          var humidityDay2 = 0;
          for (var i = looped; i < day2Looptime; i++) {
            //alert("Value of i is:" + i);
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            //alert("Check temp is:" + checkTemp);
            //alert("looptime is:" + loopTime);
            if (highTempday2 < checkTemp) {
              highTempday2 = checkTemp;
            }
            if (humidityDay2 < checkHumi) {
              humidityDay2 = checkHumi;
            }
            looped++;
          }
          var iconurl2 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          alert("Value of looped after day2:" + looped);

          var highTempday3 = 0;
          var humidityDay3 = 0;
          for (var i = looped; i < day3Looptime; i++) {
            //alert("Value of i is:" + i);
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            //alert("Check temp is:" + checkTemp);
            //alert("looptime is:" + loopTime);
            if (highTempday3 < checkTemp) {
              highTempday3 = checkTemp;
            }
            if (humidityDay3 < checkHumi) {
              humidityDay3 = checkHumi;
            }
            looped++;
          }
          var iconurl3 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          alert("Value of looped after day3:" + looped);

          var highTempday4 = 0;
          var humidityDay4 = 0;
          for (var i = looped; i < day4Looptime; i++) {
            //alert("Value of i is:" + i);
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            //alert("Check temp is:" + checkTemp);
            //alert("looptime is:" + loopTime);
            if (highTempday4 < checkTemp) {
              highTempday4 = checkTemp;
            }
            if (humidityDay4 < checkHumi) {
              humidityDay4 = checkHumi;
            }
            looped++;
          }
          var iconurl4 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          alert("Value of looped after day4:" + looped);

          var highTempday5 = 0;
          var humidityDay5 = 0;
          for (var i = looped; i < day5Looptime; i++) {
            //alert("Value of i is:" + i);
            checkTemp = response.list[i].main.temp;
            checkHumi = response.list[i].main.humidity;
            iconcode = response.list[i].weather[0].icon;
            //alert("Check temp is:" + checkTemp);
            //alert("looptime is:" + loopTime);
            if (highTempday5 < checkTemp) {
              highTempday5 = checkTemp;
            }
            if (humidityDay5 < checkHumi) {
              humidityDay5 = checkHumi;
            }
            looped++;
          }
          var iconurl5 = "http://openweathermap.org/img/w/" + iconcode + ".png";
          alert("Value of looped after day5:" + looped);

          $("#results").append("Temperature: " + highTemp + "<br>");
          $("#results").append("Humidity: " + highHumi + "<br>");
          $("#results").append(
            "Wind Speed: " + response.list[0].wind.speed + "<br>"
          );

          var today = moment();
          var day1 = today.add("days", 0);
          $("#day1").append(moment(day1).format("DD/MM/YYYY"));
          var imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl1);
          $("#icon1").append(imageIcon1);
          $("#temp1").append("Temp: " + highTempday1);
          $("#hum1").append("Humidity: " + humidityDay1);

          var day2 = day1.add("days", 1);
          $("#day2").append(moment(day2).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl2);
          $("#icon2").append(imageIcon1);

          $("#temp2").append("Temp: " + highTempday2);
          $("#hum2").append("Humidity: " + humidityDay2);

          //var day2 = moment();
          var day3 = day2.add("days", 1);
          $("#day3").append(moment(day3).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl3);
          $("#icon3").append(imageIcon1);
          $("#temp3").append("Temp: " + highTempday3);
          $("#hum3").append("Humidity: " + humidityDay3);

          var day4 = day3.add("days", 1);
          $("#day4").append(moment(day4).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl4);
          $("#icon4").append(imageIcon1);
          $("#temp4").append("Temp: " + highTempday4);
          $("#hum4").append("Humidity: " + humidityDay4);

          var day5 = day4.add("days", 1);
          $("#day5").append(moment(day5).format("DD/MM/YYYY"));
          imageIcon1 = $("<img>");
          $(imageIcon1).attr("src", iconurl5);
          $("#icon5").append(imageIcon1);
          $("#temp5").append("Temp: " + highTempday5);
          $("#hum5").append("Humidity: " + humidityDay5);
          // iconcode = response.list[].weather[1].icon;
          // iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

          // $("#temp1").append("Temp: " + response.list[0].main.temp);
          // $("#hum1").append("Humidity: " + response.list[0].main.humidity);
          // alert("date is" + response.list[1].dt_txt);
          // var highTemp = 0;
          // highTemp = response.list[0].main.temp;
          // var checkTemp = 0;
          // var currentTime = response.list[0].dt_txt;
          // var checkTime = currentTime[11] + currentTime[12];
          // alert("Check time is:" + checkTime);
          // var loopTime = 0;
          // if (checkTime === "00") {
          //   loopTime = 8;
          // } else if (checkTime === "03") {
          //   loopTime = 7;
          // } else if (checkTime === "06") {
          //   loopTime = 6;
          // } else if (checkTime === "09") {
          //   loopTime = 5;
          // } else if (checkTime === "12") {
          //   loopTime = 4;
          // } else if (checkTime === "15") {
          //   loopTime = 3;
          // } else if (checkTime === "18") {
          //   loopTime = 2;
          // } else if (checkTime === "21") {
          //   loopTime = 1;
          // }

          // alert(currentTime[11]);
          // alert(currentTime[12]);

          // for (var i = 0; i < loopTime; i++) {
          //   checkTemp = response.list[i].main.temp;
          //   alert("Check temp is:" + checkTemp);
          //   alert("looptime is:" + loopTime);
          //   if (highTemp < checkTemp) {
          //     highTemp = checkTemp;
          //   }
          // }
          //alert("Highest temp is:" + highTemp);
          //alert("Temperature is:" + response.list[1].main.temp);
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
