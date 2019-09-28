const results = document.querySelector('ul');
async function getLocation(city){
    var res = await fetch("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=IY4tAlXIi6d2cf9fUAFdbQAtMPSc8aXS&q="+city);
    var data = await res.json();
    results.innerHTML = '';
    for(let i=0;i<5;i++){
        results.innerHTML += `<li data-key="${data[i].Key}">${data[i].LocalizedName}, ${data[i].AdministrativeArea.LocalizedName}</li>`;
    }
}

async function getWeather(key,city){
    var res = await fetch("https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com//forecasts/v1/daily/1day/"+key+"?apikey=IY4tAlXIi6d2cf9fUAFdbQAtMPSc8aXS");
    var data = await res.json();
    data = data.DailyForecasts[0];
    document.querySelector('.location').textContent = city;
    avgTemp = (data.Temperature.Minimum.Value+data.Temperature.Maximum.Value)/2;
    cel = Math.round(( avgTemp- 32) * 5/9);
    document.querySelector('.temp').textContent = cel;
    document.querySelector('.status').textContent = data.Day.PrecipitationType;
    var date  = Date();
    date = date.split(' ');
    document.querySelector('.date').textContent = date[1]+ ' '+ date[2]+ ', ' + date[0];    
    console.log(date);
}

document.querySelector('input').addEventListener('input',function(){
    if(this.value.length<3){
        results.innerHTML = '';
        return;
    }
    getLocation(this.value);
})


    results.addEventListener('click',function(e){
        const city = e.target.textContent.split(',')[0];
        const key = e.target.dataset.key
        if(key != undefined){
            getWeather(key,city);
            results.value = '';
            results.innerHTML = '';
        }
    })