const details=document.querySelector(".confirm_trip");
details.addEventListener("click", ()=>{
    let dist_time=document.querySelector(".leaflet-routing-alt").children[1].innerHTML;
    console.log(dist_time);
    let dist=dist_time.substring(0,dist_time.indexOf(','));
    let time=dist_time.substring(dist_time.indexOf(',')+1,dist_time.length);
    console.log(dist,',',time)
    let stops=[]
    let i=0
    let amount=(Number(dist.substring(0,dist_time.indexOf('k')-1))/28.4)*1.02*(108.68)
    console.log(amount,"amt")
    const tid = document.getElementById("tripData");
    while(document.querySelector(".leaflet-routing-geocoders").childNodes[i].value!=''){
        stops.push(document.querySelector(".leaflet-routing-geocoders").childNodes[i].childNodes[0].value)
        console.log(document.querySelector(".leaflet-routing-geocoders").childNodes[i].childNodes[0].value)
        i=i+1;
        if(i>1000){
            break;
        }
    }
    console.log(stops);
    axios.post("http://localhost:3000/trip_details",{
        dist:dist,
        time:time,
        stops:stops,
        amount:amount
    })
    .then((response) => {
        console.log(response.data,"tripId");
        tid.innerText = response.data;
      }, (error) => {
        console.log(error);
      });
})