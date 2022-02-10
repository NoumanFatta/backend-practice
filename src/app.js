const express = require('express');
const app = express();
require('./db/conn');
const User = require('./models/userRegister');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;


const viewsPath = path.join(__dirname, '..', 'templates', 'views');
const partialsPath = path.join(__dirname, '..', 'templates', 'partials');

// ==== Using Body Parser =======
app.use(express.urlencoded({ extended: false }))

// ==== Setting Static Site =======
app.use(express.static(path.join(__dirname, "..", "public")));

// ===== Setting View Engine =======
app.set('view engine', 'hbs')

// ===== Modifying View Path
app.set('views', viewsPath);

// ===== Registering Partials
hbs.registerPartials(partialsPath);

// ==== Get Routes

app.get('', (req, res) => {
    res.render('index')
});
app.get('/signup', (req, res) => {
    res.render('signup')
});
app.get('/login', (req, res) => {
    res.render('login')
});


// ==== Post Routes
app.post('/signup', async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.confirmPassword) {
            const { email, password, confirmPassword } = req.body;
            if (confirmPassword === password) {
                const newUser = new User({ email, password });
                const result = await newUser.save();
                res.status(201).redirect('../');
            } else {
                res.send('password is not matching')
            }
        } else {
            res.send('all fields are mandatory')
        }
    } catch (e) {
        if (e.keyPattern.email === 1) {
            res.status(401).send('User is already registered with that email')
        } else {
            res.send(e)
        }
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.send('all fields are mandatory')
        } else {
            const userFound = await User.findOne({ email });
            if (userFound) {
                const isMatched = await bcrypt.compare(password, userFound.password)
                if (isMatched) {
                    res.redirect('../')
                } else {
                    res.send('Invalid password')
                }
            } else {
                res.send('Invalid Email')
            }
        }
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
});



app.listen(port, () => console.log('server is running on port' + port)) 