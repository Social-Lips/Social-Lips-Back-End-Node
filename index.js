// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const connection = require("./db");
// const userRoutes = require("./app/routes/auth");
//
// // database connection
// connection();
//
// // middlewares
// app.use(express.json());
// app.use(cors());
//
// // routes
// app.use("/api/users", userRoutes);
//
// const port = process.env.PORT || 8800;
// app.listen(port, console.log(`Listening on port ${port}...`));
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./app/routes/auth");
const userRoute = require("./app/routes/users");
const postRoute = require("./app/routes/posts");

dotenv.config();

// create a (.env) file and add mongo url in the form of strings

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


// listening at port no. 8800
app.listen(8800, () => {
    console.log("Backend server is running!");
});
