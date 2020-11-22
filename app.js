//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

mongoose.connect(
  "mongodb+srv://admin-rosa:antafluisbestwelok@cluster0.d6pkn.mongodb.net/bewaarappDB",
  {
    useNewUrlParser: true,
  }
);

const itemSchema = {
  name: String,
  expirationDate: Date,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welkom bij de Bewaarlijst",
});

const item2 = new Item({
  name: "Klik op de Plus om een nieuw item toe te voegen",
});

const item3 = new Item({
  name: "hiermee kan je een item verwijderen",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("succesfully saved default items to DB");
//   }
// });

app.get("/", function (req, res) {
  Item.find()
    .then((docs) => {
      console.log("docs:", docs);

      let nowDateMs = new Date().getTime();

      res.render("list", {
        listTitle: "Brood",
        newListItems: docs.map((doc) => {
          doc.diffDays = 0;
          if (doc.expirationDate) {
            let diffMs = doc.expirationDate.getTime() - nowDateMs;
            doc.diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24);
          }
          return doc;
        }),
      });
    })
    .catch((err) => {
      res.send({ error: err.message });
    });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  console.log("POST new item:", item);

  const nowDate = new Date();

  const newItem = new Item({
    name: item,
    expirationDate: new Date(nowDate.getTime() + 7776000000), // + 90 days
  });
  newItem
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.redirect("/");
    });

  // if (req.body.list === "Leftovers") {
  //   leftoversItems.push(item);

  //   res.redirect("/leftovers");
  // } else {
  //   items.push(item);

  //   res.redirect("/");
  // }
});

app.post("/leftovers", function (req, res) {
  const item = req.body.newItem;
  leftoversItems.push(item);
  res.redirect("/leftovers");
});

app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  console.log("checkedItemID:", checkedItemID);

  Item.findByIdAndRemove(checkedItemID, function (err) {
    if (err) {
      return res.send({
        error: err.message,
      });
    }
    console.log("item succesfully removed");
    res.redirect("/");
  });
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
