import express from "express";
import mysql from "mysql";
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YourRootPassword",
    database: "taxi_dbms"
})
// const cloudinary = require('cloudinary').v2;
import * as cloudinary from 'cloudinary'
// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: "dnqtftiwh",
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
console.log(cloudinary.config());
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
};
/////////////////////////////////////
// Gets details of an uploaded image
/////////////////////////////////////
const getAssetInfo = async (publicId) => {

    // Return colors in the response
    const options = {
      colors: true,
    };

    try {
        // Get details about the asset
        const result = await cloudinary.api.resource(publicId, options);
        console.log(result);
        return result.colors;
        } catch (error) {
        console.error(error);
    }
};
//////////////////////////////////////////////////////////////
// Creates an HTML image tag with a transformation that
// results in a circular thumbnail crop of the image  
// focused on the faces, applying an outline of the  
// first color, and setting a background of the second color.
//////////////////////////////////////////////////////////////
const createImageTag = (publicId, ...colors) => {

    // Set the effect color and background color
    const [effectColor, backgroundColor] = colors;

    // Create an image tag with transformations applied to the src URL
    let imageTag = cloudinary.image(publicId, {
      transformation: [
        { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
        { radius: 'max' },
        { effect: 'outline:10', color: effectColor },
        { background: backgroundColor },
      ],
    });

    return imageTag;
};
//////////////////
//
// Main function
//
//////////////////
const upload_image_func=(async (image_path) => {

    // Set the image to upload
    var imagePath = 'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';
    imagePath=image_path;
    // Upload the image
    const publicId = await uploadImage(imagePath);

    // Get the colors in the image
    var colors = await getAssetInfo(publicId);
    // console.log(typeof(colors));
    if(!colors){
        colors=[["white"],["black"]]
    }
    // Create an image tag, using two of the colors in a transformation
    const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

    // Log the image tag to the console
    console.log(imageTag);

})();
let inc_id=function (a){
    let char=a.substring(0,1);
    let num=parseInt(a.slice(1),10)+1;
    // console.log("func output new int:",num);
    return char+num.toString().padStart(8, '0');
};
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED")
    }
})
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());

app.get("/", async (req, res)=>{
    // db.query("SELECT customer_id FROM customer",(err,results)=>{
    //     if(err) console.log(err);
    //     else{
    //         let customer_id=results;
    //         if(customer_id.length>0){
    //             customer_id.sort((a,b) => (parseInt(a.customer_id.slice(1),10)+1)-(parseInt(b.customer_id.slice(1),10)+1));
    //             let customerId=customer_id[0].customer_id;
    //             res.render("index.ejs", {customerId});
    //         }else{
    //             console.log("customer_id is empty!");
    //             //add C0000001 here -----------------------------
    //         }
    //     }
    // })
    console.log('You are at homepage!');
    res.render("homepage.ejs");

})
app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})
app.post("/signup_page", async(req, res)=>{
    // console.log(req.body);
    console.log(req.files);
    const {username,photo,email,phone,address,DOB,age,gender,password,confirm_pass}=req.body;
    const hash=await bcrypt.hash(password,12);
    db.query("SELECT customer_id FROM customer",(err,results)=>{
        if(err) console.log(err);
        else{
            let customer_id=results;
            if(customer_id.length>0){
                customer_id.sort((a,b) => (parseInt(b.customer_id.slice(1),10)+1)-(parseInt(a.customer_id.slice(1),10)+1));
                let customerId=inc_id(customer_id[0].customer_id);
                db.query("INSERT INTO customer (customer_id,name_,photo,contact,address,age,DOB,gender,email_id,password_) VALUES ?",[[[customerId,username,photo,phone,address,age,DOB,gender,email,hash]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    
                });
            }else{
                console.log("customer_id is empty!");//-----------------------------------if cid is empty start with C0000000000
            }
        }
    })
    
});

app.post("/upload_img", async (req, res)=>{
    // const {username, photo} = req.body;
    // db.query("UPDATE customer SET photo = ? WHERE username = ?", [photo, username], (err, result)=>{
    //     if(err) console.log(err);
    //     else console.log(result)
    // })
    console.log(req.body);
    const {username,photo,email__,phone__,adress__,dob__,age__,gender__,pass__}=req.body;
    const hash=await bcrypt.hash(pass__,12);
    db.query("SELECT customer_id FROM customer",(err,results)=>{
        if(err) console.log(err);
        else{
            console.log("Yo");
            // res.render("homepage.ejs");
            console.log("YOOO");
            let customer_id=results;
            if(customer_id.length>0){
                customer_id.sort((a,b) => (parseInt(b.customer_id.slice(1),10)+1)-(parseInt(a.customer_id.slice(1),10)+1));
                let customerId=inc_id(customer_id[0].customer_id);
                console.log(phone__);
                db.query("INSERT INTO customer (customer_id,name_,photo,password_,contact,address,age,email_id,dob,gender) VALUES ?",[[[customerId,username,photo,hash,phone__,adress__,age__,email__,dob__,gender__]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    res.render("homepage.ejs");
                });
            }else{
                console.log("customer_id is empty!");//-----------------------------------if cid is empty start with C0000000000
            }
        }
    })
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000!")
})