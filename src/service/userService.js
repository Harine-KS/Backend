const { User } = require('../modals/userSchema');
const jwt = require('jsonwebtoken');
const authorization = require('../config/authorization.json');
const { Book } = require('../modals/booksSchema');
const secretKey = 'access';

async function postuser(req, res) {
    try {
        const { name, email, userId, role, password } = req.body;
        const addUser = new User({ name, email, userId, role, password });
        const savedUser = await addUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error.message)
    }
}
async function loginService(req, res) {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.userId, role: user.role }, secretKey, { expiresIn: '1h' });
        const decoded = decode(token);
        res.status(200).json({ userId: decoded.userId, role: decoded.role, token: token, });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
function decode(token) {
    return jwt.decode(token);
}
async function verifyToken(req, res, next) {
    let mobileToken = req.headers["authorization"];
    let token;
    if (!mobileToken) {
        return res.set("Connection", "close").status(401).json()
    } else {
        let accessToken = mobileToken.split(" ")[1];
        token = accessToken;
    }
    jwt.verify(token, secretKey, function (err) {
        if (!err) {
            req.token = decode(token);
            next();
        }
        else {
            return res.set("Connection", "close").status(401).json()
        }
    })
}
function verifyRole(req, res, next) {
    let routeURL;
    const queryURL = req.url?.split('?')[0]
    if (queryURL) {
        routeURL = queryURL.split('/')
    } else {
        routeURL = req.url.split('/');
    }
    const url = `${routeURL[1]}/${routeURL[2]}`;
    const role = req.token?.role;
    if (role && authorization?.[role]?.includes(url)) {
        next();
    } else {
        res.json({ error: 'Role Mismatched' });
    }
}



async function getById(req, res) {
    try {
        let userData = await User.findOne({ userId: req.token.userId })
        if (userData) {
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getAllUser(req, res) {
    try {
        let getAllUser = await User.find({ role: 'User' });
        if (getAllUser) {
            res.status(200).json(getAllUser);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function updateById(req, res) {
    try {
        let userData = await User.findOne({ userId: req.token.userId })
        if (userData) {
            const { name, email } = req.body;
            await User.findOneAndUpdate({ userId: req.token.userId }, { name, email }, { new: true })
            res.status(200).json("updated Succesfully");
        }
    } catch (error) {

        return res.status(404).send('access denied');
    }
}
async function deleteUserById(req, res) {
    try {

        let deleteBook = await User.findById(req.params.id)
        if (deleteBook) {
            let deleteBooks = await Book.deleteMany({ userId: deleteBook.userId });
            let deleteUser = await User.findByIdAndRemove(req.params.id)
            if (deleteUser && deleteBooks) {
                res.status(200).json("Deleted Successfully");
            }
        }
    } catch (error) {
        res.status(201).json(error.message);
    }
}

module.exports = { postuser, loginService, verifyToken, verifyRole, getById, updateById, getAllUser, deleteUserById }