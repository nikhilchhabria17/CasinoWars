const jwt =require('jsonwebtoken');
const { decode } = require('punycode');
const User=require('../user');

const requireAuth=(req,res,next)=>
{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,"Casino War Secret",(err,decodedToken)=>
        {
            if(err)
            {
            console.log(err);
            res.redirect("/login");
            }
            else
            {
                next();
            }
        });
    }
    else
    {
        res.redirect("/login");
    }
}
const checkUser=(req,res,next)=>
{        
    const token=req.cookies.jwt;            
    if(token)
    {
        jwt.verify(token,"Casino War Secret",async (err,decodedToken)=>
        {
            if(err)
            {            
            res.locals.data=null;            
            next();
            }
            else
            {
             
                let user=await User.findById(decodedToken.id);
                res.locals.data=user;                    
                next();                
            }
        });
    }
    else
    {        
        res.locals.data=null;
        next();
    }    
}    
module.exports={requireAuth,checkUser};