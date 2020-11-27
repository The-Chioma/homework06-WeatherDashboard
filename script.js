 //assigning my variables
 var citiesSearched = $("#cities-searched");
 var listOfCities = $(".history");
 var currentWeather = $("#today-weather");
 var futureWeather = $("#forecast");
 var searchButton = $("#search-button");

 

 function getForecast(userInput){
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=886705b4c1182eb1c69f28eb8c520e20&units=metric"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response)

        {   var cityName = response.name;
            var temp = response.main.temp + " ºC";
            var humidity = response.main.humidity + "%";
            var windSpeed = response.wind.speed + " MPH";
            var longitude = response.coord.lon;
            var latitude = response.coord.lat;

            function getUVindex() {
                var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude+ "&appid=886705b4c1182eb1c69f28eb8c520e20&units=metric"
                $.ajax({
                    url: uvURL,
                    method: "GET"
                }).then(function(response){
                    var uvIndex = getUVindex();
                    //console.log(uvIndex);
                })
            }

            

            //http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
           
            console.log(cityName);
            console.log(temp);
            console.log(humidity);
            console.log(windSpeed);
            console.log(longitude);
            console.log(latitude);
           
            var newDiv = $("<div>");
            newDiv.text(cityName)
            citiesSearched.append(newDiv);
            
        })
    }

    searchButton.on("click", function(){
        var userInput = $("#search-input").val().trim();
        alert ("The user typed " + userInput);
        return getForecast(userInput);

       
        
    })
    
    
 
  //&appid=a8a6cbd561df9120a6feee123727868c
