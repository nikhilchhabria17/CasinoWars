const express=require("express");
const app=express();
const jwt=require('jsonwebtoken');
const env=require("dotenv");
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
const {requireAuth}=require("./middleware/authmiddleware")
const {checkUser}=require("./middleware/authmiddleware")
const User=require("./user");
const authRoutes=require("./routes/authRoutes");
app.use(express.urlencoded({extended:true}));

var parser = require('body-parser');
var path = require('path');
env.config({path:"config.env"});

app.use(express.static('public'));
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.set('view engine','ejs');
app.use(express.json());
app.use("/css",express.static(__dirname+'/css'));
app.use("/js",express.static(__dirname+'/js'));
app.use("/img",express.static(__dirname+'/img'));


app.use(cookieParser());

const DB=process.env.DATABASE;
console.log(DB);
mongoose.connect(DB,{}).then(()=>{
 
}).catch((err)=>console.log(err));


app.post("/update",async(req,res)=>
{
    const token=req.cookies.jwt;
    const decoded = jwt.verify(token, "Casino War Secret");    
    var userId = decoded.id;    
    await User.updateOne({_id:userId},{$set:{user_balance:req.body.balance}});
    let data=await User.findOne({_id:userId});
    console.log(data);
    req.body.flag=0;
    res.status(200).json({data:req.body.balance});      

})
app.get("/",checkUser,requireAuth,async (req,res)=>
{  
    const token=req.cookies.jwt;
    const decoded = jwt.verify(token, "Casino War Secret");    
    var userId = decoded.id;
    
    let data=await User.findOne({_id:userId});    
    res.render('game',{balance:data.user_balance});
});
app.use(authRoutes);

// app.listen(3000,"192.168.203.139"||"localhost",(err)=>
// {
// })
app.listen(process.env.PORT||3000,(err)=>
{
})