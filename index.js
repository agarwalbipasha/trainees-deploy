require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const morgan = require('morgan');
const fs = require("fs");
const path = require('path');

app.use(express.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
 
app.use(morgan('combined', { stream: accessLogStream }));

const db = require("./src/models");

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the database!");
}).catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});

require("./src/routes/trainee.routes")(app);

app.listen(port, () => {
  console.log("Server connected successfully");
});

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// app.listen(port, () => {
//     console.log(`Server started in port ${port}`);
// });
