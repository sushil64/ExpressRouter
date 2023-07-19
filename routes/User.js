const express = require("express");
// express.Router(); <- method
const router = express.Router();

// Import DB Connection: 
const userData = require("./DBConnection");

router.get("/usersList", async (req, res) => {

    let usersList = await userData.find();

    res.json(usersList);
});


module.exports = router;