const details=document.querySelector(".confirm_trip");
details.addEventListener("click", ()=>{
    let dist_time=document.querySelector(".leaflet-routing-alt").children[1].innerHTML;
    console.log(dist_time);
    let dist=dist_time.substring(0,dist_time.indexOf(','));
    let time=dist_time.substring(dist_time.indexOf(',')+1,dist_time.length);
    console.log(dist,',',time)
    let stops=[]
    let i=0
    while(document.querySelector(".leaflet-routing-geocoders").childNodes[i].value!=''){
        stops.push(document.querySelector(".leaflet-routing-geocoders").childNodes[i].childNodes[0].value)
        console.log(document.querySelector(".leaflet-routing-geocoders").childNodes[i].childNodes[0].value)
        i=i+1;
        if(i>1000){
            break;
        }
    }
    console.log(stops);
})