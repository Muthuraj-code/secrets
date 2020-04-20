//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const userSchema =new mongoose.Schema({
  email: String,
  password:String
});

// console.log(process.env.API_KEY);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:['password'] });

const User= new  mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  let email=req.body.username;
  let password=req.body.password;
  const user =new User({
    email:email,
    password:password
  });
  user.save(function(err){
    if(err){console.log(err);}
    else {
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  let userName=req.body.username;
  let userPassword= req.body.password;
  User.findOne({email:userName},function(err,userData){
    // console.log(userData);
    if(!err){
      if(userData.password===userPassword){
        res.render("secrets");
      }
      else { res.send("User Name or password is incorrect");}
    }
    else {
      console.log(err);
    }
  });
});



app.listen(3000,function(){
  console.log("Server started at port 3000");
});
