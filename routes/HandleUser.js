const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  1. ------------
const router = express.Router();
//  2. ----------- Importing DB 
const userData = require("./DBConnection");

// 3. instead of {app.post} when using Exp router use {router.post}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.post("/validateLogin", upload.none(), async (req, res) => {

    let results = await userData.find().and({ username: req.body.username });

    if (results.length > 0) {
        // Hashing 2. Compare method - compares password in DB & tells only if it is right or wrong.
        let isPasswordCorrect = await bcrypt.compare(req.body.password, results[0].password);

        if (isPasswordCorrect == true) {
            // sign()
            let encryptedCredentials = jwt.sign({ username: req.body.username, password: req.body.password }, "secretKey");

            let userDetails = results[0];
            console.log(userDetails);
            res.json({ status: "Success", isLoggedIn: true, details: userDetails, token: encryptedCredentials });
        } else {
            res.json({ status: "Failure", isLoggedIn: false, msg: "Invalid Password" });
        }
    }
    else {
        res.json({ status: "Failure", isLoggedIn: false, msg: "Invalid Email" });
    };
});

router.post("/validateToken", upload.none(), async (req, res) => {
    // verify()
    let decryptedCredentials = jwt.verify(req.body.token, "secretKey");
    console.log(decryptedCredentials);

    let results = await userData.find().and({ username: decryptedCredentials.username });

    if (results.length > 0) {

        let isPasswordCorrect = await bcrypt.compare(decryptedCredentials.password, results[0].password);

        if (isPasswordCorrect == true) {
            let encryptedCredentials = jwt.sign({ username: req.body.username, password: req.body.password }, "secretKey");

            let userDetails = results[0];
            res.json({ status: "Success", isLoggedIn: true, details: userDetails, token: encryptedCredentials });
        } else {
            res.json({ status: "Failure", isLoggedIn: false, msg: "Invalid Password" });
        }
    }
    else {
        res.json({ status: "Failure", isLoggedIn: false, msg: "Invalid Email" });
    };
});

router.post("/signup", upload.single("profilePic"), async (req, res) => {

    // Hashing 1. giving hash password to req.body.password, which is storing in alphaNumeric value in DB
    // salt - no of rounds it has to salt, 10 is recommended.   
    let hashPassword = await bcrypt.hash(req.body.password, 10);

    let dataEntered = new userData({
        username: req.body.username,
        password: hashPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        contactNo: req.body.contactNo,
        profilePic: req.file.path,

    });
    await dataEntered.save();
    res.json(["Account Created Succesfully"]);
    console.log("Received singup data");
});

router.put("/edit", upload.single("profilePic"), async (req, res) => {
    try {
        await userData.updateMany({ _id: req.body.id },
            {
                // username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                email: req.body.email,
                contactNo: req.body.contactNo,
                profilePic: req.file.path,
            });
        res.n;
        res.json({ status: "Success", msg: "Account Updated Succesfully" });
    }
    catch (err) {
        res.json(err);
        console.log("Error Uploading");
    }
    console.log(req.body);
    console.log("Received singup data");
});

router.delete("/deleteUser", async (req, res) => {

    try {
        await userData.deleteMany({ _id: req.query.id });
        res.json({ status: "Success", msg: "Account Deleted Succesfully" });
    }
    catch (err) {
        res.json(err);
    }
});

//  4. ---------------
module.exports = router;
