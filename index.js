require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT;

console.log(port);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});
