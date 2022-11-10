let userData;
const name_ = document.getElementById("name");
// const name2_ = document.getElementById("name2");
const name3_ = document.getElementById("name3");
const name4_ = document.getElementById("name4");
const cid_ = document.getElementById("cid");
const rating = document.getElementById("rating");
const contact_ = document.getElementById("contact");
const address_ = document.getElementById("address");
const vehicle_ = document.getElementById("vehicle");
const gender_ = document.getElementById("gender");
const dob_ = document.getElementById("dob");
const img1 = document.getElementById('img1');
// const img2 = document.getElementById('img2');
// console.log(name_);
axios.get("http://localhost:3000/get_curr_d")
.then(response=>{
    console.log(response.data);
    userData = response.data;
    name_.innerText = userData.name_;
    // name2_.innerText = userData.name_;
    name3_.innerText = userData.name_;
    name4_.innerText = userData.name_;
    cid_.innerText = userData.driver_id;
    rating.innerText = userData.rating;
    contact_.innerText = userData.contact_no;
    address_.innerText = userData.address_;
    vehicle_.innerText = userData.vehicle_id;
    gender_.innerText = userData.gender;
    dob_.innerText = userData.dob;
    img1.setAttribute('src', userData.photo);
    // img2.setAttribute('src', userData.photo);
})


// .then((data)=>console.log(data))