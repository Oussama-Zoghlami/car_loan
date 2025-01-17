const express =require('express');
const router =express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Car = require('../models/car');


const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



//singup

router.post('/register', async (req ,res)=>{
    data = req.body;
    usr = new User(data);
    salt = bcrypt.genSaltSync(10);
    cryptedPass = await bcrypt.hashSync( data.password , salt);

    usr.password = cryptedPass;

    usr.save()
        .then(
            (saved)=>{
                res.status(200).send(saved)
            }
        )
        .catch(
            (err)=>{
                res.send(err)
            }
        )
})


//signin
router.post('/login' , async (req ,res )=>{
    data =req.body;

    user = await User.findOne({ email : data.email })

    if(!user){
        res.status(404).send('email or password invalid !')

    }else{
        validPass = bcrypt.compareSync(data.password , user.password)

        if(!validPass){
            res.status(401).send('email or password invalid !!')
        }else{
            payload = {
                _id: user._id,
                email: user.email,
                name: user.name
            }
            token = jwt.sign( payload , '1234567')

            res.status(200).send({ mytoken :token})
        }
    }
})



//async
router.post('/create',async (req ,res)=>{

    try{

        data=req.body;
        usr = new User(data);
        savedUser= await usr.save();
        res.send(savedUser);

    }catch(error){
        res.send(error);
    }
})


router.get('/getall',(req ,res)=>{
    User.find()
    .then(
        (users)=>{
            res.send(users);
        }
    ).catch(
        (err)=>{
            res.send(err);
        }
    )
});

//async condition age
router.get('/all',async (req ,res)=>{
    try{
        users = await User.find({age:20});
        res.send(users);
    }catch(error){
        res.send(error);
    }

})

router.get('/getById/:id',(req,res)=>{
    myid = req.params.id;
    User.findOne({_id:myid})
        .then(
            (user)=>{
                res.send(user);
            }
        )
        .catch(
            (err)=>{
                res.send(err);
            }
        )

})

//async getById
router.get('/byId/:id',async(req, res)=>{
    try{
        id=req.params.id;
        user=await User.findById({_id:id});
        res.send(user);
    }
    catch(error){
        res.send(error);
    }
})

router.put('/update/:id',(req ,res)=>{
    id=req.params.id;
    newData=req.body;

    User.findByIdAndUpdate({_id:id},newData)
    .then (
        (updated)=>{
            res.send(updated);
        }
    ).catch(
        (error)=>{
            res.send(error);
        }
    )
    
    
});
//update async
router.put('/upt/:id',async(req,res)=>{
    try{
    id=req.params.id;
    newData=req.body;
    updated= await User.findByIdAndUpdate({_id:id},newData);

    res.send(updated);
    } catch(error){
        res.send(error);
    }
})




router.delete('/delete/:id',(req ,res)=>{
    id=req.params.id;
    User.findOneAndDelete({_id:id})
        .then(
            (deleteUser)=>{
                res.send(deleteUser);
            }
        )
        .catch(
            (err)=>{
                res.send(deleteUser);
            }
        )
});
//delete async
router.delete('/deleteById/:id',async(req,res)=>{
    try{
        id=req.params.id;
        deleteUser= await User.findByIdAndDelete({_id:id});
        res.send(deleteUser);
    }
    catch(error){
        res.send(error);
    }
})

//loan car to user

router.post('/loan-car', async (req, res) => {
    const { userId, carId } = req.body;

    try {
        // Find the user and car by IDs
        const user = await User.findById(userId);
        const car = await Car.findById(carId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!car) {
            return res.status(404).send('Car not found');
        }

        if (car.loanedBy) {
            return res.status(400).send('Car is already loaned');
        }

        // Mark the car as loaned
        car.loanedBy = user._id;
        await car.save();

        // Add the car to the user's loanedCars list
        user.loanedCars.push(car._id);
        await user.save();

        res.status(200).send('Car successfully loaned');
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

router.get('/:id/loaned-cars', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).populate('loanedCars');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.loanedCars);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});



router.delete('/delete-loan-car', async (req, res) => {
    const { userId, carId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).send('Invalid userId or carId');
    }

    try {
        // Find the car to ensure it exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).send('Car not found');
        }

        // Check if the car is actually loaned by the user
        if (!car.loanedBy || car.loanedBy.toString() !== userId) {
            return res.status(400).send('This car is not loaned by the specified user');
        }

        // Remove the car's loanedBy field
        car.loanedBy = undefined;
        await car.save();

        // Find the user and remove the car from their loanedCars array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.loanedCars = user.loanedCars.filter(id => id.toString() !== carId);
        await user.save();

        res.status(200).send('Loan successfully deleted');
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Something went wrong');
    }
});






module.exports = router;