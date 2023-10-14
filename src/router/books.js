const express = require('express');
var router = express.Router();
const bookservice = require('../service/bookService');
const userService = require('../service/userService')


router.post('/post', async (req, res) => {
    await bookservice.postbook(req, res)
})
router.get('/get/:id', async (req, res) => {
    bookservice.getById(req, res);
})
router.get('/getAllById', async (req, res) => {
    bookservice.getAllBooksById(req, res);
})
router.put('/update/:id', async (req, res) => {
    bookservice.updateById(req, res);
})
router.delete('/delete/:id', async (req, res) => {
    bookservice.DeleteById(req, res);
})
router.get('/getall', async (req, res) => {
    bookservice.getAllBooks(req, res);
})

router.get('/getById', async (req, res) => {
    await userService.getById(req, res)
})
router.put('/updateById', async (req, res) => {
    await userService.updateById(req, res)
})

router.get('/getAllUser', async (req, res) => {
    userService.getAllUser(req, res);
})
router.delete('/deleteUser/:id', async (req, res) => {
    userService.deleteUserById(req, res);
})

module.exports = router;
