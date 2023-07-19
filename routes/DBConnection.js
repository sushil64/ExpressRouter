
const mongoose = require("mongoose");


let connectToMGDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://brnsushil2304:brnsushil2304@cluster0.iec0j9s.mongodb.net/?retryWrites=true&w=majority');
        console.log("Succesfully Connected to DataBase");
    }
    catch (err) {
        console.log("Unsuccesfull Connection to DB");
        console.log(err);
    }
};

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    age: String,
    email: String,
    contactNo: String,
    profilePic: String,
});

let userData = new mongoose.model("jsonWebToken1", userSchema);


connectToMGDB();


module.exports = userData;