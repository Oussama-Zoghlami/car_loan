const express =require('express');

const carRoute =require('./routes/car');
const userRoute=require('./routes/user');

require('./config/connect');


const app = express();
app.use(express.json());


//http://127.0.0.1:3000/car/

app.use('/car', carRoute);
app.use('/user', userRoute);


app.listen( 3000, ()=>{
    console.log('server work!!');
});