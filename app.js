//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose";)
const date = require(__dirname + "/date.js");


const app = express();
const items = [];
const leftoversItems = [];

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/bewaarappDB", {useNewUrlParser: true});




app.get("/", function (req, res) {
  const day = date.getDate();

  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Leftovers") {
    leftoversItems.push(item);

    res.redirect("/leftovers");
  } else {
    items.push(item);

    res.redirect("/");
  }
});

app.post("/leftovers", function (req, res) {
  const item = req.body.newItem;
  leftoversItems.push(item);
  res.redirect("/leftovers");
});

app.get("/leftovers", function (req, res) {
  res.render("list", {
    listTitle: "Leftovers List",
    newListItems: leftoversItems,
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
