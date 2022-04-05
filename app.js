const express = require("express");
const bodyParser = require('body-parser')
const app = express();

const fs = require("fs");

const Employees = require('./routes/employees')

const PORT = 4000;

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/employees', Employees)


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`This app is running on port ${PORT}`);
});


