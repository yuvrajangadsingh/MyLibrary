const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/library', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

var Schema = mongoose.Schema;

var task = new Schema({
    name: String,
    author: String,
    isbn: String
});

var library = mongoose.model('library', task);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    library.find({}, (err, task) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                task: task,
            });
        }
    });
});

app.post("/removeTask/:id", (req, res) => {
    var id = req.params.id;
    console.log(id);
    library.findByIdAndRemove(id, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Item removed");
        }
    });
    res.redirect("/");
});

app.post("/add", (req, res) => {
    console.log('Add request');
    var task = new library({
        name: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn
    });
    if (req.body.title == "" || req.body.author == "" || req.body.isbn == "") {
        // res.send('Input cannot be empty!', 404);
        res.send("Input cannot be empty!");
    } else {
        library.create(task, (err, library) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Item inserted");
            }
        });
    }
    res.redirect("/");
});

app.listen(5000, () => {
    console.log("Server is up! and running at 5000");
})