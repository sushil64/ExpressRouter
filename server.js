const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Modularization Concept:
const userRoute = require("./routes/User");
app.use("/", userRoute);

const handleUser = require("./routes/HandleUser");
app.use("/", handleUser);


app.listen(6677, () => {
    console.log("Listening to port 6677");
});

