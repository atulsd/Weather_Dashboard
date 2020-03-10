$(document).ready(function() {
  var apiKey = "4989a668363ee1641a25c82bbed4d190";
  const uvIndex = 0;
  var found = 0;
  var notFound = 0;
  //https://api.openweathermap.org/data/2.5/forecast?q=Austin&appid=4989a668363ee1641a25c82bbed4d190
  //var city = document.querySelector(".form-control.text");
  //var searchedCitynames = { name: ["Melbourne", "Sydney"] };
  var city = "";
  //alert("Values are:" + searchedCitynames.name[0] + searchedCitynames.name[1]);
  var startWeather = localStorage.getItem("startWeather");

  //alert("Start weather is:" + startWeather);
  var storedCity = JSON.parse(localStorage.getItem("searchedCity"));
  var noofCitiesstored;
  var lastCitysearched;

  var loadingLocal;
  if (storedCity === null && startWeather === null) {
    // lastCitysearched = searchedCitynames.name[1];
    localStorage.setItem("startWeather", "1");
    storedCity = { name: ["No data"] };
    localStorage.setItem("searchedCity", JSON.stringify(storedCity));
    //city = "No Data";
  } else {
    noofCitiesstored = storedCity.name.length - 1;
    alert("Number of cities stored are:" + noofCitiesstored);
    alert("First value in stored CIty object is:" + storedCity.name[0]);

    lastCitysearched = storedCity.name[noofCitiesstored];
    var lastValue = localStorage.getItem("lastValue");
    // for (var i = 0; i < storedCity.name.length; i++) {
    //   if (storedCity.name[i] === city) {
    //     found = 1;
    //     localStorage.setItem("loadingLocal", "2");
    // } else {
    //   localStorage.setItem("loadingLocal", "1");
    //   }
    // }

    if (lastValue === lastCitysearched) {
      //notFound = 1;
      //found = 1;
      localStorage.setItem("loadingLocal", "2");
      alert("Found at top");
    }
    //alert("Final found is:" + found);
    else {
      // if (found === 0 && notFound == 0) {
      localStorage.setItem("loadingLocal", "1");
    }
    localStorage.setItem("lastValue", lastCitysearched);
    alert("Last city searched was:" + lastCitysearched);
    city = lastCitysearched;
  }

  // if (city === null) {
  //   city = "";
  // } else {
  //   city = localStorage.getItem("searchedCity");
  // }
  alert("VAlue of city feeding to URL is:" + city);
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

    //noofCitiesstored = storedCity.name.length - 1;
    // alert("Number of cities stored are:" + noofCitiesstored);
    // alert("First value in stored CIty object is:" + storedCity.name[0]);

    noofCitiesstored = storedCity.name.length - 1;
    lastCitysearched = storedCity.name[noofCitiesstored];
    // alert("last city searched is:" + lastCitysearched);
    // alert("City searched is:" + city);
    // for (var i = 0; i < storedCity.name.length; i++) {
    //   if (storedCity.name[i] === lastCitysearched) {
    //     localStorage.setItem("loadingLocal", "2");
    //     alert("Matched");
    //     found = 1;
    //   }
    // }

    // lastCitysearched = storedCity.name[noofCitiesstored];
    // alert("last city searched is:" + lastCitysearched);
    for (var i = 0; i < storedCity.name.length; i++) {
      if (storedCity.name[i] === city) {
        localStorage.setItem("loadingLocal", "2");
        alert("Inside button click matched");
        found = 1;
      }
    }
    //else if() {
    //localStorage.setItem("loadingLocal", "1");
    //  alert("Inside button click mis-matched");
    //break;
    //}
    //}
    alert("Found is:" + found);
    if (city === lastCitysearched) {
      //notFound = 1;
      localStorage.setItem("loadingLocal", "2");
    }
    //alert("Final found is:" + found);
    else if (found === 0) {
      // if (found === 0 && notFound == 0) {
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
          // var noofCitiesstored = searchedCitynames.name.length;
          // alert(
          //   "Number of cities stored are within displayresult function:" +
          //     noofCitiesstored
          // );
          // searchedCitynames.name[noofCitiesstored] = response.city.name;
          //if (storedCity === null) {
          alert("Pushing data");
          loadingLocal = localStorage.getItem("loadingLocal");
          alert("loading local is:" + loadingLocal);
          if (loadingLocal != 2) {
            storedCity.name.push(city);
            localStorage.setItem("searchedCity", JSON.stringify(storedCity));
          }
          // }
          // for (var i = 0; i < searchedCitynames.name.length; i++) {
          //   alert("Length of object is: " + searchedCitynames.name.length);
          //   alert("i is:" + i);
          //   if (i === searchedCitynames.name.length) {
          //     searchedCitynames.name[i] = response.city.name;
          //     alert(
          //       "Length of object after storing is: " +
          //         searchedCitynames.name.length
          //     );
          //   }
          // }

          alert("City from Ajax is:" + response.city.name);
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
        alert("Getting UV:");
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
