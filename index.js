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
    console.log(req.body);
    const {username,photoUrl,email,phone,address,DOB,age,gender,password,confirm_pass}=req.body;
    const hash=await bcrypt.hash(password,12);
    db.query("SELECT customer_id FROM customer",(err,results)=>{
        if(err) console.log(err);
        else{
            let customer_id=results;
            if(customer_id.length>0){
                customer_id.sort((a,b) => (parseInt(b.customer_id.slice(1),10)+1)-(parseInt(a.customer_id.slice(1),10)+1));
                let customerId=inc_id(customer_id[0].customer_id);
                db.query("INSERT INTO customer (customer_id,name_,photo,contact,address,age,DOB,gender,email_id,password_) VALUES ?",[[[customerId,username,photoUrl,phone,address,age,DOB,gender,email,hash]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    res.render("homepage.ejs")
                });
            }else{
                console.log("customer_id is empty!");//-----------------------------------if cid is empty start with C0000000000
            }
        }
    })
    
});

app.post("/upload_img", async (req, res)=>{
    console.log(req.body);
    const {username,photo,email__,phone__,adress__,dob__,age__,gender__,pass__}=req.body;
    const hash=await bcrypt.hash(pass__,12);
    db.query("SELECT customer_id FROM customer",(err,results)=>{
        if(err) console.log(err);
        else{
            let customer_id=results;
            if(customer_id.length>0){
                customer_id.sort((a,b) => (parseInt(b.customer_id.slice(1),10)+1)-(parseInt(a.customer_id.slice(1),10)+1));
                let customerId=inc_id(customer_id[0].customer_id);
                console.log(phone__);
                db.query("INSERT INTO customer (customer_id,name_,photo,password_,contact,address,age,email_id,dob,gender) VALUES ?",[[[customerId,username,photo,hash,phone__,adress__,age__,email__,dob__,gender__]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    // res.render("homepage.ejs");
                });
            }else{
                console.log("customer_id is empty!");//-----------------------------------if cid is empty start with C0000000000
            }
        }
    })
})

app.post("/book_trip", async(req, res)=> {

    // console.log(req.files)
    var { trip_id , amount , travel_time, distance, 
        transaction_id ,  payment_type ,  date_and_time ,  
        start_location , destination , halts ,  
        status_of_trip ,   driver_review  , customer_review , no_of_persons_travelling ,
        driver_id ,  customer_id ,  vehicle_id }  = req.body ;
    
    amount=(distance/(28.40))(110)(1.02);
    console.log("amount",amount);

    var tripdet = document.querySelector(".leaflet-routing-alt").children[1].innerHTML
    console.log(tripdet[0])
        
    db.query("SELECT trip_id FROM trip",(err,results)=>{
        if(err) console.log(err);
        else{
            let trip_id=results;
            if(trip_id.length>0){
                trip_id.sort((a,b) => (parseInt(b.trip_id.slice(1),10)+1)-(parseInt(a.trip_id.slice(1),10)+1));
                let tripId=inc_id(trip_id[0].trip_id);
                db.query("INSERT INTO trip ( trip_id , amount , travel_time, distance, transaction_id ,  payment_type ,  date_and_time ,start_location , destination , halts , status_of_trip ,   driver_review  , customer_review , no_of_persons_travelling , driver_id ,  customer_id ,  vehicle_id) VALUES ?",
                    [ [ [                    tripId,  amount , travel_time, distance,  transaction_id ,  payment_type ,  date_and_time ,start_location , destination , halts , status_of_trip ,   driver_review  , customer_review , no_of_persons_travelling , driver_id ,  customer_id ,  vehicle_id ]]],
                    function(err){
                        if(err) console.log(err);
                        console.log("Booked a Trip!!!");
                });
            }else{
                console.log("trip_id is empty!");//-----------------------------------if cid is empty start with C0000000000
            }
        }
    })
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000!")
})