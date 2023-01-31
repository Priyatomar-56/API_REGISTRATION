const mongoose=require("mongoose"); 
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");
const userSchema= new mongoose.Schema({
    Name:{
        type:String, 
        required:true
    },
    email:{
        type:String, 
        required:true
    },
    // Phone:{
    //     type: Number,
    //     required:true
    // },
    // work:{
    //     type:String, 
    //     required:true
    // },
    password:{
        type:String, 
        required:true
    },
    cpassword:{
        type:String, 
        required:true
    },
    tokens: [
        {
          token: {  
            type:String,
            required:true},
        }
    ]

})

// now connect it to the main file
// User ka U should be capital

// we are hashing the password, means before saving the password hash it.
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12);
        this.cpassword= await bcrypt.hash(this.cpassword,12);
    }
    next();
})
// we are genertaing token
userSchema.methods.generateAuthToken= async function(){
    try{
let token =jwt.sign({_id:this._id}, process.env.SECRET_KEY);
this.tokens = this.tokens.concat({token:token});
 await this.save();
 return token;
    }
    catch(err){
console.log(err);
    }
}

const User= mongoose.model('USER', userSchema);
module.exports=User;