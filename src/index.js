//Importing Modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();

//convert data to json format
app.use(express.json());

//indicating static files
app.use(express.static("public"));

//URL Encoding
app.use(express.urlencoded({extended: false}));

//EJS
app.set("view engine", "ejs");

//Render
app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/login/index", (req, res) =>{
    res.render("/login/index");
});

app.get("/login/index", (req, res) =>{
    res.render("login/index");
});

//Register user
app.post("/login/index", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    // Check if the email already exists in the database
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
        res.send('User already exists. Please choose a different email.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; // Replace the original password with the hashed one
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});

// Login user 
app.post("/login/index", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.send("Email cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

//port number
const port = 3000;
app.listen(port, () =>{
    console.log(`server is running on:${port}`);
});