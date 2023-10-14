const express = require('express');
var router = express.Router();
const userService =require('../service/userService');

router.post('/register',async(req,res)=>{
    await userService.postuser(req,res)
})
router.post('/login',async(req,res)=>{
    await userService.loginService(req,res)
})


module.exports=router