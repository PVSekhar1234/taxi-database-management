import express from "express";
import mysql from "mysql";
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import sessions from 'express-session';
const oneDay = 100000 * 60 * 60 * 24;
const app = express();
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fw  ir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
//-----------------------------customer---------------------------------------------
app.get("/", async (req, res)=>{
    console.log('You are at homepage!');
    res.render("index.ejs");

})
app.get("/homepage", async (req, res)=>{
    // console.log('You are at homepage!');
    res.render("homepage.ejs");

})
app.get("/profile",(req,res)=>{
    res.render("cust_profile.ejs")
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
                req.session.user = customerId;
                console.log("id",req.session.user);

                db.query("INSERT INTO customer (customer_id,name_,photo,contact,number_of_rides,address,age,DOB,gender,email_id,password_) VALUES ?",[[[customerId,username,photoUrl,phone,1,address,age,DOB,gender,email,hash]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    res.render("homepage.ejs")
                });
            }else{
                console.log("customer_id is empty!");
            }
        }
    })
    
});
app.get("/login_page",(req,res)=>{
    res.render("login.ejs")
})
app.post("/login_action",(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;
    var check=0;
    db.query("SELECT customer_id,password_ FROM customer WHERE email_id=?",[email],(err,res1)=>{
        if(err) console.log(err);
        else{
            console.log(res1[0],password);
            var cid=res1[0].customer_id;
            bcrypt.compare(password, res1[0].password_, function(err, res2) {
                if (err){
                  console.log(err);
                }
                if (res2) {
                    console.log(cid)
                    req.session.user =cid;
                    res.render("homepage.ejs")
                } else {
                  return res.json({success: false, message: 'passwords do not match'});
                }
            });
        }
    })
})
app.post("/trip_details",(req,res)=>{
    const {dist,time,stops,amount}=req.body;
    db.query("SELECT trip_id FROM trip",(err,results)=>{
        if(err) console.log(err);
        else{
            let trip_id=results;
            if(trip_id.length>0){
                trip_id.sort((a,b) => (parseInt(b.trip_id.slice(1),10)+1)-(parseInt(a.trip_id.slice(1),10)+1));
                let tripId=inc_id(trip_id[0].trip_id);
                let user=req.session.user;
                console.log("id",req.session.user);

                db.query("INSERT INTO trip (trip_id,amount,travel_time,distance,start_location,destination,halts,status_of_trip,customer_id) VALUES ?",[[[tripId,amount,time,dist,stops[0],stops[stops.length-1],stops.slice(1,stops.length-1).toString(),"Waiting",user]]],function(err){
                    if(err) console.log(err);
                    console.log("Trip values inserted!!");
                    res.send(tripId);
                });
            }else{
                console.log("trip is empty!");
            }
        }
    })
})
app.get("/get_curr_user", (req, res)=>{
    db.query("SELECT * FROM customer WHERE customer_id = ?", [req.session.user], (err, result)=>{
        if(err) console.log(err);
        else{
            db.query("SELECT * FROM trip WHERE customer_id=?",[req.session.user],(err,result2)=>{
                if(err) console.log(err);
                else{
                    console.log(result[0]);
                    console.log(result2);
                    result[0]['history']=result2;
                    res.send(result[0]);
                }
                // res.append('history',result2[0]);
                // console.log(res);
                // res.send();
            })
        }
        // else res.append('details',result[0]);
        // else res.send(result[0]);
    })
})
app.post("/isConfirmed",(req,res)=>{
    var {tid}=req.body;
    db.query("SELECT * FROM trip WHERE trip_id = ?", [tid], (err, result)=>{
        if(err) console.log(err);
        else{
            console.log(result,"result")
        }
    })
})
//-----------------customer ended----------------------------
//-----------------------------driver---------------------------------------------
app.get("/d", async (req, res)=>{
    console.log('You are at homepage!');
    res.render("d_homepage.ejs");

})
app.get("/d_profile",(req,res)=>{
    res.render("d_profile.ejs")
})
app.get("/d_signup",(req,res)=>{
    res.render("d_signup.ejs")
})
app.post("/d_signup_page", async(req, res)=>{
    // console.log(req.body);
    console.log(req.body);
    const {username,photoUrl,vehicle,phone,address,DOB,age,gender,password,confirm_pass}=req.body;
    const hash=await bcrypt.hash(password,12);
    db.query("SELECT driver_id FROM driver",(err,results)=>{
        if(err) console.log(err);
        else{
            let driver_id=results;
            if(driver_id.length>0){
                driver_id.sort((a,b) => (parseInt(b.driver_id.slice(1),10)+1)-(parseInt(a.driver_id.slice(1),10)+1));
                let driverId=inc_id(driver_id[0].driver_id);
                req.session.user = driverId;
                console.log("id",req.session.user);

                db.query("INSERT INTO driver (driver_id,vehicle_id,name_,rating,photo,contact_no,address_,age,dob,gender,password_) VALUES ?",[[[driverId,vehicle,username,4,photoUrl,phone,address,age,DOB,gender,hash]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    res.render("d_homepage.ejs")
                });
            }else{
                console.log("customer_id is empty!");
            }
        }
    })
    
});
app.get("/d_login_page",(req,res)=>{
    res.render("d_login.ejs")
})
app.post("/d_login_action",(req,res)=>{
    console.log(req.body);
    const {name,password}=req.body;
    db.query("SELECT driver_id,password_ FROM driver WHERE name_=?",[name],(err,res1)=>{
        if(err) console.log(err);
        else{
            console.log(res1[0],password);
            var did=res1[0].driver_id;
            bcrypt.compare(password, res1[0].password_, function(err, res2) {
                if (err){
                  console.log(err);
                }
                if (res2) {
                    console.log(did)
                    req.session.user =did;
                    res.render("d_homepage.ejs")
                } else {
                  return response.json({success: false, message: 'passwords do not match'});
                }
            });
        }
    })
})
app.get("/get_curr_d", (req, res)=>{
    db.query("SELECT * FROM driver WHERE driver_id = ?", [req.session.user], (err, result)=>{
        if(err) console.log(err);
        else res.send(result[0]);
    })
})
//-----------------driver ended----------------------------
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
// app.get("/driver_avail",(req,res)=>{

// })



app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.render("index.ejs");
})
app.listen(3000, ()=>{
    console.log("Listening on port 3000!")
})