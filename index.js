import express from "express";
import mysql from "mysql";
import bcrypt from 'bcrypt';
const app = express();
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
// app.get("/signup_page",(req,res)=>{
//     res.render('signup_page')
// })
app.post("/signup_page", async(req, res)=>{
    // console.log(req.body);
    const {email,password}=req.body;
    const hash=await bcrypt.hash(password,12);
    db.query("SELECT customer_id FROM customer",(err,results)=>{
        if(err) console.log(err);
        else{
            let customer_id=results;
            if(customer_id.length>0){
                customer_id.sort((a,b) => (parseInt(b.customer_id.slice(1),10)+1)-(parseInt(a.customer_id.slice(1),10)+1));
                let customerId=inc_id(customer_id[0].customer_id);
                db.query("INSERT INTO customer (customer_id,email_id,password_) VALUES ?",[[[customerId,email,hash]]],function(err){
                    if(err) console.log(err);
                    console.log("Signed Up!!");
                    res.redirect("/");
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