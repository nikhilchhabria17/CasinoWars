const User=require("../user");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer=require("nodemailer");
const env=require("dotenv");
env.config({path:"config.env"});



const handleErrors = (err) => {    
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'Incorrect Email') {
      errors.email = 'That email is not registered';
    }
    if(err.message==="Invalid Password")
    {
      errors.password="Password Length :8 to 15, one special character, one uppercase and lowercase letters";
    }
    // incorrect password
    if (err.message === 'Incorrect Password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.message ==='Email Already Exists') {
      errors.email = 'that email is already registered';      
    }
    if(err.message==='Password & Confirm Password should Match')
    errors.password="Password doesn't Match";
  
    // validation errors      
    return errors;
  }

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},"Casino War Secret",{expiresIn:maxAge});
}
module.exports.forgot_password_get=(req,res)=>
{
  res.render("forgot_password");
}
module.exports.verify=(req,res)=>
{  
  let email=req.params.email;
  let token=User.generatePasswordReset();    

  User.updateOne({user_email:email},{$set:{resetPasswordToken:token}}).then(User=>
  {
    let link = "https://casinowars.onrender.com/reset_password/"+token;
    var transporter=nodemailer.createTransport({
      host: process.env.HOST,
      port:process.env.PORT1,
      auth:{
        user:process.env.USER,
        pass:process.env.PASS,        
      }
    });
    var mailOptions={
      from:process.env.USER,
      to:email,
      subject:'Casino War Game Reset',
      html:'<h1 style="color:red;">Casino War Game</h1><br><h2 >Hope you get back to the playing table soon and below is your Password Reset Link<br>:'+link+"</h2>",
      // text:'Hey,Your Password Reset Link:'+link      
    };
    transporter.sendMail(mailOptions,function(err,info){
      if(err)
      {
        console.log(err);
      }
      else
      {
          console.log("Email Sent"+info);
      }
    });
  })
  .catch((err)=>console.log(err));
  
  res.render("verify");
}
module.exports.forgot_password_post=async (req,res)=>
{
  const {email}=req.body;
    let data=await User.findOne({user_email:email});    
    console.log(data);
    try
    {
      if(data)
      {        
        res.status(200).json({email:email});      
      }
      else
      {
        throw Error("Incorrect Email");              
      }
    }
    catch(err)
    {
      const errors = handleErrors(err);      
      console.log(errors);              
      return res.status(400).json({ errors });             
    
    }
    
}
module.exports.reset_password_get=async (req,res)=>
{
  let token=req.params.token;
  let user=await User.findOne({resetPasswordToken:token});
  console.log(user);
  if(user)
  {
    console.log("Yeah");
    res.render("reset_password",{tokenId:token});
  }
  else
  {
    res.redirect("/forgot_password");
  }    
}
module.exports.reset_password_post=async (req,res)=>
{
  const{password,cpassword}=req.body;
  
  const token=req.params.token;

  try{
    let user=await User.findOne({resetPasswordToken:token});
    if(user)
    {
      if(password==cpassword)
    {     
      var passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
if(password.match(passformat))
{
}
else
{
	throw Error("Invalid Password");
}

      user.user_password=password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      const u=new User(user);                                
             
                    const token = createToken(u._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });                    
                    u.save().then(()=>
                    {    
                      res.status(201).json({ user:u._id });
                    // res.redirect("/");
                    res.locals.data=u;                                    
                    }).catch((err)=>{
                      const errors = handleErrors(err);                    
                    return res.status(400).json({ errors });             
                    });
    }
    else
    {
      throw Error("Password & Confirm Password should Match");
    }

    }
    else
    {
      throw Error("Invalid Verification Link");
    }
      }
  catch(err)
  {
    const errors = handleErrors(err);                    
    console.log("Y"+errors.password);
    return res.status(400).json({ errors });    
  }
}
module.exports.signup_get=(req,res)=>
{
    res.render("signup")
}
module.exports.update_balance=(req,res)=>
{
  
}

module.exports.signup_post=(req,res)=>
{  
          console.log(req.body);
          const {name,pwd,cpwd,email}=req.body;        
          try{
           
            if(!name&&!pwd&&!email&&!cpwd)
            {
                throw Error("Enter Required Details");
            }
            else if(pwd!=cpwd)
            {
                throw Error("Password & Confirm Password should Match");
            }
            else
            {
                User.findOne({user_email:email}).then((emailExist)=>{
                    if(emailExist)
                    {

                        throw Error("Email Already Exists");
                    }       
                    else{ 
                    const balance=1000;                     
                    const u=new User({user_name:name,user_password:pwd,user_email:email,user_balance:balance});                                
             
                    const token = createToken(u._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });                    
                    u.save().then(()=>
                    {    
                      res.status(201).json({ user:u._id });
                    // res.redirect("/");
                    res.locals.data=u;                                    
                    }).catch((err)=>{
                      const errors = handleErrors(err);                    
                    return res.status(400).json({ errors });             
                    });                         
                }              
            }).catch((err)=>{
              const errors = handleErrors(err);                    
            return res.status(400).json({ errors });             
            });;        
            }
          }
        catch(err)
        {
          console.log(9);
          const errors = handleErrors(err);                    
          return res.status(400).json({ errors });                 
        }
        
}
module.exports.login_get=(req,res)=>
{
    res.render("index")
}
module.exports.login_post = async (req, res) => {
    console.log(req.body);
    const {email, password } = req.body;
    try 
    {      
      const user = await User.login(email, password);            
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({user:user.id});      
    } 
    catch (err) 
    {        
      const errors = handleErrors(err);          
      res.status(400).json({ errors });      
    }
  
  }
module.exports.logout_get=async (req,res)=>
{
  const token=req.cookies.jwt;
  const decoded = jwt.verify(token, "Casino War Secret");    
  var userId = decoded.id;    
  await User.updateOne({_id:userId},{$set:{user_balance:req.body.balance}});
 
    res.cookie('jwt','',{maxAge:1});
    res.redirect("/");    
}
