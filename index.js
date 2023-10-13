const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require('express') ;
const aap=express();
const path=require("path");
const methodOverride=require("method-override");

aap.set("view engine","ejs");
aap.set("views",path.join(__dirname,"/views"));

aap.use(methodOverride("_method"));
aap.use(express.urlencoded({extended:true}))

//connection object
//ssid
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'sidq',
    password:'siditer1m$'
});
let getRandomUser=()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
     
    ];
}
//we want 100 users data with faker so
//after running this 1 time comment out
//let q="INSERT INTO user(id,username,email,password) VALUES ?";
// values ? bcz the values are not defined yet
// let data=[];
// for(let i=1;i<=100;i++){
//    data.push( getRandomUser());//100 users data
// }
//try{
//     connection.query(q,[data],(err,result)=>{
//         if(err)throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log(result);
// }


//home route
aap.get("/",(req,res)=>{
let q=`SELECT count(*)FROM user`;
    try{connection.query(q,(err,result)=>{
   
        //the returned query q result will be stored @ result[0]
        if(err) throw err;
        let count = result[0]["count(*)"]//["count(*)"] bcz result is a array of objs and count(*) is our key
        // so value of our key i.e ["count(*)"]=103 will be returned
         //if only result[0],then key value both will be returned
        console.log(result);
        res.render("homepage.ejs",{count});
});
    }
catch(err){
    console.log(err);
    res.send("some error in database");
}
    });

//show route 
//localhost:8080/user
aap.get("/user",(req,res)=>{
    //return all data from user table
    let q= `SELECT * FROM user`;
    try{connection.query(q,(err,users)=>{
   
        if(err) throw err;
         
        //console.log(result);

        //query q will return all data to users object 
        //and we will pass that users object to showusers.ejs
        res.render("showusers.ejs",{users});
});
    }
catch(err){
    console.log(err);
    res.send("some error in database");
}
    });

//edit route
aap.get("/user/:id/edit",(req,res)=>{
    let{id}=req.params;
    //search for that id in db
    //you have to keep id inside '' to send it as a string, else it will be sent by value i.e id
    let q=`SELECT * FROM user WHERE id='${id}'`;
    console.log(id);
    try{
        connection.query(q,(err,result)=>{
           if (err) throw err;
           let user = result[0];
          console.log(result);
          res.render("edit.ejs",{user});
        });
    }
    catch(err){
        res.send("some error in db")
    }
    
    
})

//update route
//req from edit 
aap.patch("/user/:id",(req,res)=>{
    let{id}=req.params;
    //as in password field in edit.ejs u set the name="password"
    //you need to mention password:formpassword same for username
    let{password:formpassword,username:newusername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(formpassword != user.password){
                res.send("wrong password");
            }
            else{
                let q2=`UPDATE user SET username='${newusername}'WHERE id='${id}'`;
            connection.query(q2,(err,result)=>{
                if(err)throw err;
                
                res.redirect("/user");
            });
            
            }
           
        });
    }
    catch(err){
        console.log(err);
        res.send("some err")
    }
})



aap.listen("8080",()=>{
    console.log("listening at 8080")
});

//console.log(getRandomUser());