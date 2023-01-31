const express= require("express"); 
const app=express(); 

const dotenv= require("dotenv"); 

dotenv.config({path: './config.env'});
require('./db/conn.js');
const PORT=process.env.PORT;
// const User = require('./model/userSchema');
// As data is in json format to read data , we use the below code
app.use(express.json());
// link the router file to make ou route easy
app.use(require("./router/auth"));
// mongoose.set('strictQuery', true);
// mongoose.connect(DB).then(()=>{
//     console.log("connection successful to DB");
// }).catch((err)=>{
//     console.log(err);
// });
// app will access all the features of the express
app.get('/', (req, res)=>{
    res.send(`hello priya`);
})

const middleware=(req,res,next)=>{
    console.log(`hii im middleware`);
    next();
}
app.get('/about', middleware,(req, res)=>{
    res.send(`hello priya, tell about youself`);
})

app.get('/contact', (req, res)=>{
    res.send(`hello priya, your contact number`);
})


// Middleware matlab, jab tak login nhi kiya h tab tak about page nhi dikhana h;


// lets see on the server by listen
app.listen(PORT,()=>{
    console.log(`Welcome back to the ${PORT}`);
})