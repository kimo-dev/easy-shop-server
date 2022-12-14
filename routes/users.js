const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.diskStorage({});
const uploads = multer({ storage });

router.get('/', async (req,res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false});
    }
    res.send(userList);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: 'the user with the given id was not found'});
    }
    res.status(200).send(user);
});

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        appartment: req.body.appartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country

    })
    user = await user.save();
    if(!user){
        return res.status(404).send('the user cannot be created!')
    }
    res.send(user);
});

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email });
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send("The user not found")
    }
    if(user  && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(200).send("Password is wrong!");
    }
});

router.delete('/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id).then(user => {
        if(user) { 
            return res.status(200).json({success: true, message: 'the user is deleted'})
        } else {
            return res.status(400).json({success: false, message: 'user not found'});
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});
router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();

    if(!userCount){
        res.status(500).json({success: false});
    }
    res.send({ userCount: userCount});
});

router.put('/upload-profile/:id', uploads.single("avatar"), async(req, res ) => {
    const { id: _id} = req.params;
    const user = req.body;
    if(!mongoose.isValidObjectId(_id)){
        res.status(400).send('Invalid user Id')
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { ...user, _id },
        { new: true }
        );
    res.status(200).send(updatedUser);
    console.log(updatedUser);
})  


module.exports= router;