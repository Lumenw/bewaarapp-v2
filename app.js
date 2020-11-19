//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];
let leftoversItems = [];

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Leftovers") {
    leftoversItems.push(item);

    res.redirect("/leftovers");
  } else {
    items.push(item);

    res.redirect("/");
  }
});

app.get("/leftovers", function (req, res) {
  res.render("list", {
    listTitle: "Leftovers List",
    newListItems: leftoversItems,
  });
});

app.post("/leftovers", function (req, res) {
  let item = req.body.newItem;
  leftoversItems.push(item);
  res.redirect("/leftovers");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
