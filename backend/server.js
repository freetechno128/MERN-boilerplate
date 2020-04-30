const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
const helmet = require("helmet");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || "merntest";
const SECRET = process.env.SECRET;


app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

//connect to db
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`,
    { 
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);

// Add JWT protected endpoints
// The decoded JWT payload is available on the 
// request via the req.user property.
app.use("/api", expressJwt({ secret: SECRET }));

// Add endpoints
app.use("/auth", require("./routes/auth"));

// Auth error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ message: err.message });
});

// Run the server
app.listen(PORT, () => {
    console.log(`[+] Starting server on port ${PORT}`);
});