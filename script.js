$(document).ready(function(){
//assigning my variables brought in from html file
 var citiesSearched = $("#cities-searched");
 var listOfCities = $(".history");
 var currentWeather = $("#today-weather");
 var futureWeather = $("#forecast");
 var searchButton = $("#search-button");

 
 //this function will get the information for the current weather and display it on the page
 function getCurrentWeather(userInput){
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=a8a6cbd561df9120a6feee123727868c&units=metric"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response)

        {   var longitude = response.coord.lon;
            var latitude = response.coord.lat;

            //creating html elements that will appear on the page once search-button is clicked
            var cityName = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ")");
            var card = $("<div>").addClass("card col-12");
            var windSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + " °C");
            var cardBody = $("<div>").addClass("card-body");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

            //obtaining the value of the uv index
            function getUVindex(latitude, longitude) {
                var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=886705b4c1182eb1c69f28eb8c520e20&"
                $.ajax({
                    url: uvURL,
                    method: "GET"
                }).then(function(response){
                    var uvBtn = $("<span>").addClass("btn btn-sm").text(response.value);
                    var uv = $("<p>").text("UV Index: ");
                    
                    // change color of the UV index button depending on uv value
                    if (response.value < 3) {
                      uvBtn.addClass("btn-success");
                    }
                    else if (response.value < 7) {
                      uvBtn.addClass("btn-warning");
                    }
                    else {
                      uvBtn.addClass("btn-danger");
                    }

                    //appending all elements to eachother and then to the page
                    uv.append(uvBtn);
                    cityName.append(img);
                    cardBody.append(cityName, temp, humidity, windSpeed, uv);
                    card.append(cardBody);
                    currentWeather.append(card);   
                })
            } getUVindex(latitude,longitude);   

            function getForecast(userInput) {
                $.ajax({
                  type: "GET",
                  url: "http://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=a8a6cbd561df9120a6feee123727868c&units=metric",
                  dataType: "json",
                  success: function(response) {
                    // overwrite any existing content with title and empty row
                    futureWeather.html("<h4 class=\"mt-3\">5-Day Forecast:</h4>")
                    futureWeather.append("<div class=\"row\">");
            
                    // loop over all forecasts (by 3-hour increments)
                    for (var i = 0; i < response.list.length; i++) {
                      // only look at forecasts around 3:00pm
                      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        // create html elements for a bootstrap card
                        var col = $("<div>").addClass("col-md-2.4 fluid");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-2");
            
                        var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
            
                        var img2 = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
            
                        var p1 = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp_max + " °C");
                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");
            
                        // merge together and put on page
                        col.append(card.append(body.append(title, img2, p1, p2)));
                        $("#forecast .row").append(col);
                      }
                    }
                  }
                });
            }
            getForecast(userInput);
            var cities = $(this).siblings(".history").val();
            console.log(cities);

            var weatherDisplay = $(this).siblings(".col-8").val();
            localStorage.setItem(cities, weatherDisplay);

            $(".history").val(localStorage.getItem(cities));
            $(".col-8").val(localStorage.getItem(weatherDisplay));

        })

        var citiesPreviouslySearched = JSON.parse(localStorage.getItem("cities")) || []; 

        if (citiesPreviouslySearched.indexOf(userInput) === -1){
          citiesPreviouslySearched.push(userInput); 
          localStorage.setItem("cities", JSON.stringify(citiesPreviouslySearched))
        }
        citiesSearched.empty();
        currentWeather.empty();
        for (var i = 0; i < citiesPreviouslySearched.length; i++) {
        var li = $("<li>").addClass("list-group-item list-group-item-action");
        li.text(citiesPreviouslySearched[i]);
        citiesSearched.append(li); 
        }
    }
        citiesSearched.on("click", "li", function() {
        return getCurrentWeather($(this).text());
    });
    

    searchButton.on("click", function(){
        var userInput = $("#search-input").val().trim();
        currentWeather.empty();
        return getCurrentWeather(userInput);
       
       
           
    })
    var citiesPreviouslySearched = JSON.parse(localStorage.getItem("cities")) || []; 
    if (citiesPreviouslySearched.length > 0) {
      var length = citiesPreviouslySearched.length; 
      getCurrentWeather(citiesPreviouslySearched[length - 1])
    }
  });