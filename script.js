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
            var card = $("<div>").addClass("card");
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
              
            
        })
    }

    searchButton.on("click", function(){
        var userInput = $("#search-input").val().trim();
        currentWeather.empty();
        return getCurrentWeather(userInput);

       
        
    })
    