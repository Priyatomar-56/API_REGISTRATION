const express= require("express"); 
const router = express.Router(); 
const bcrypt= require("bcryptjs");
const User = require('../model/userSchema');
const jwt=require("jsonwebtoken");
const nodemailer= require("nodemailer"); 
const randomstring= require("randomstring");
const config=require("../Config/congif.js")

const sendResetPasswordMail=async(Name,email,token)=>{
  console.log(Name,email,token);
  try{
   const transporter= nodemailer.createTransport({
      host:'sandbox.smtp.mailtrap.io',
      port:25,
      auth:{
        user:config.user,
        pass:config.password
      }
    });
    const mailOptios={
      from: config.email,
      to:email,
      subject:"For reset Password",
      html:'<p> Hii '+Name+' , Please copy the link <a href="https://localhost:3000/reset?token='+token+'">and reste your password</a>'
    }
    transporter.sendMail(mailOptios,function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log("Mail has sent", info.response);
      }
    })
  }
  catch(err){
    console.log(err);
  }
}

router.get('/', (req, res)=>{
  res.send("hello welcome to the router world");
})
// to get the data store in the postman or the form.
// Using PRomises
// router.post('/register',(req,res) => {
  
// const {Name, email, password}= req.body;
// if(!Name || !email || !password){
// return res.status(200).json({error: " The cridentials are not filled"})
// }
// // email alreday exist
// User.findOne({ email : email })
// .then((userExist)=>{
//   if(userExist){
//     return res.status(422).json({error: "User already Exist"});
//   }
//   const user= new User({Name, email, password});

//   user.save().then(() => {
//     res.status(201).json({ message: "Succesfully registered" });
//   }).catch((err)=>res.status(500).json({status: "failed to Register"}));
// }).catch(err=>{console.log(err);});
// });
// Using async try without promises
router.post('/register', async (req,res) => {
  
  const {Name, email, password,cpassword} = req.body;

  if(!Name || !email || !password || !cpassword){
  return res.status(200).json({error: " The cridentials are not filled"})
  }
  // email already exist
    try{
      const userExist= await User.findOne({ email : email });
      
        if(userExist){
          return res.status(422).json({error: "User already Exist"});
        } else if(password!=cpassword){
          return res.status(422).json({error: "Wrong Credentials"});
        }else{
          const user= new User({Name, email, password,cpassword});
         
          const userRegister =await user.save();
        console.log(`${user} registered succesfully`);
        console.log(userRegister);
        // message: "Succesfully registered"
       if(userRegister){
          res.status(201).json({message: req.body });
        }
        else{
        res.status(500).json({erroe: "Failed to register"});
  }}
        }catch(err){
    console.log(err);
  }
});
// SIGN IN PAGE
router.post('/signin', async (req,res)=>{
  // console.log(req.body);
  // res.status(598).json({message: "you are great"});

  try{
    const {email, password} = req.body;

  if( !email || !password){
  return res.status(200).json({error: " Fill the data "})
  }
  const userLogin= await User.findOne({email:email}); 
   console.log(userLogin);

   if(userLogin)
   { 
    const isMatch= await bcrypt.compare(password,userLogin.password);
     
    const token = await userLogin.generateAuthToken();
     console.log(token);
    //  to add cookie
res.cookie("jwttoken",token,{
  expires:new Date(Date.now()+ 25892000000),
  httpOnly:true
});
    if(!isMatch)
    res.json({message: "wrong creadentials"})
    else
    res.json({message:" user signin successfully" });
   }
   else{
    res.json({message: "wrong creadentials"})
   }
  }
  catch(err){
  console.log(err);
  }
})
// Forget password
router.post('/forgetpassword', async(req,res)=>{
try{
  const email=req.body.email;
  console.log(req.body);
  const Userdata= await User.findOne({email:email});
   if(Userdata){
   const randomString=randomstring.generate();
   const data=await User.updateOne({email:email},{$set:{token:randomString}});
   sendResetPasswordMail(Userdata.Name, Userdata.email,randomString);
   res.status(300).json({error: "Check your mail and set your password"});
   }else{
    res.status(200).json({error: "This email does not Exit"});
   }
}
catch(err){
console.log(err);
}
})
module.exports=router;
// module.exports=sendResetPasswordMail;