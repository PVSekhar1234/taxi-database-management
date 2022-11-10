
const inp=document.querySelector("#photo");
const uploadBtn = document.querySelector("#upload-btn");
let image;
// const username = document.querySelector("#username");
// const phone = document.querySelector("#phone");
// const address = document.querySelector("#address");
// const age = document.querySelector("#age");
// const DOB = document.querySelector("#DOB");
// const gender = document.querySelector("#gender");
// const email = document.querySelector("#email");
// const password = document.querySelector("#password");
// let image, user,email_id,contact,address_,dob,age_,gender_,pass;
// username.addEventListener("change", (e)=>{
//   user = e.target.value;
// })
// phone.addEventListener("change", (e)=>{
//   contact = e.target.value;
// })
// email.addEventListener("change", (e)=>{
//   email_id = e.target.value;
// })
// address.addEventListener("change", (e)=>{
//   address_ = e.target.value;
// })
// DOB.addEventListener("change", (e)=>{
//   dob = e.target.value;
// })
// age.addEventListener("change", (e)=>{
//   age_ = e.target.value;
// })
// gender.addEventListener("change", (e)=>{
//   gender_ = e.target.value;
// })
// password.addEventListener("change", (e)=>{
//   pass = e.target.value;
// })
inp.addEventListener("change", async (e)=>{
  image = e.target.files[0];
})
uploadBtn.addEventListener("click", async (e)=>{
  e.preventDefault();
  const formdata = new FormData();
  formdata.append("file", image);
  formdata.append("upload_preset", "waky6hpg");
  formdata.append("cloud_name", "dnqtftiwh");
  await fetch("https://api.cloudinary.com/v1_1/dnqtftiwh/image/upload", {
    method: "post",
    body: formdata,
  })
  .then((response)=>response.json())
  .then(async (data)=>{
    image = data.secure_url;
    console.log(data.secure_url)
  });

  document.querySelector("#submit-btn").classList.remove("hidden");
  document.querySelector("#photo-url").value = image;
})