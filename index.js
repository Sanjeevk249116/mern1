const express = require("express");
require("dotenv").config();

const { connection } = require("./config/connection");
const { Router } = require("./routers/route");


const app = express();
app.use(express.json());

app.use("/", Router)

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("connect");
    } catch (err) {
        console.log("not connected");
    }
    console.log("Port 8090 are connected");
})



