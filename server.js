const express =require('express');

const carRoute =require('./routes/car');
const userRoute=require('./routes/user');

const createAdminUser = require('./utils/createAdminUser');

require('./config/connect');


const app = express();
app.use(express.json());


//http://127.0.0.1:3000/car/

app.use('/car', carRoute);
app.use('/user', userRoute);



//the path for get files and images 
app.use('/getimage' ,express.static('./uploads'));


app.listen(3000, async () => {
    console.log('Server is running on http://127.0.0.1:3000');
    await createAdminUser(); // Ensure an admin user is created
});
