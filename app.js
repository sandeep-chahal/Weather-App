const results = document.querySelector('ul');
var popup = false;
async function getLocation(city){
    var res = await fetch("https://cors-anywhere.herokuapp.com/https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=AlqIhokU3G30Sm7s7uGyWDUiwBa0u5mx&q="+city);
    var data = await res.json();
    if(data.Code == "ServiceUnavailable"){
        if(popup== false)
            error();
            return;
    }
    results.innerHTML = '';
    for(let i=0;i<5;i++){
        results.innerHTML += `<li data-key="${data[i].Key}">${data[i].LocalizedName}, ${data[i].AdministrativeArea.LocalizedName}</li>`;
    }
}
function error(){
    popup = true;
    Swal.fire({
        title: 'Service Unavailable',
        text: 'Please Try Some Another Time',
        type: 'error',
        confirmButtonText: 'Okay'
    })
    document.querySelector('.swal2-confirm').addEventListener('click',()=>{popup = false})
    document.addEventListener('click',()=>{popup = false})
}

async function getWeather(key,city){
    var res = await fetch("https://cors-anywhere.herokuapp.com/https://dataservice.accuweather.com//forecasts/v1/daily/1day/"+key+"?apikey=AlqIhokU3G30Sm7s7uGyWDUiwBa0u5mx");
    var data = await res.json();
    if(data.Code == "ServiceUnavailable"){
        if(popup== false)
            error();
            return;
    }
    data = data.DailyForecasts[0];
    setLocation(city);
    avgTemp = (data.Temperature.Minimum.Value+data.Temperature.Maximum.Value)/2;
    cel = Math.round(( avgTemp- 32) * 5/9);
    setTempValue(cel);
    document.querySelector('.status').textContent = data.Day.PrecipitationType || data.Day.IconPhrase;
    console.log(data);
    var date  = Date();
    date = date.split(' ');
    document.querySelector('.date').textContent = date[1]+ ' '+ date[2]+ ', ' + date[0];    
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

function setTempValue(newVal){
    const temp = document.querySelector('.temp');
    var prev = parseInt(temp.textContent);
    const gap = Math.abs(prev - newVal);
        setInterval(()=>{

            if(prev < newVal)
                temp.textContent = ++prev;
            else if(newVal< prev)
                temp.textContent = --prev;
            else if(prev == newVal)
                return;
        },50);
}
function setLocation(newVal){
    var location = document.querySelector('.location');
    var oldVal = location.textContent;
    let counter = 0;
    setInterval(function(){
        if(oldVal.length !=0){
        oldVal = oldVal.slice(0,oldVal.length-1);
        location.textContent = oldVal;
        }
        else if(counter < newVal.length){
            location.textContent += newVal[counter];
            counter++;
        }
        else return;
    },50);

}

// init

var date  = Date();
date = date.split(' ');
document.querySelector('.date').textContent = date[1]+ ' '+ date[2]+ ', ' + date[0]; 
getWeather(19003,"Los Angles");