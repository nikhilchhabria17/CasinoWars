const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const crypto=require("crypto");
const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_password: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  user_balance:
  {
      type:Number,
      required:true,
  },
  resetPasswordToken: {
    type: String,
    required: false
},

resetPasswordExpires: {
    type: Date,
    required: false
}
}, {timestamps: true});


 UserSchema.statics.login = async function(email, password) 
 {      
    const user = await this.findOne({user_email:email });
  if (user) 
  {    
    const auth = await bcrypt.compare(password, user.user_password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect Password');
  }
  console.log("HY");
  throw Error('Incorrect Email');
};

 UserSchema.pre('save',async function(next)
 {
  const salt=await bcrypt.genSalt();
  this.user_password = await bcrypt.hash(this.user_password,salt);
  next();
 })

 UserSchema.statics.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
  return this.resetPasswordToken;
};


module.exports = mongoose.model("User",UserSchema)