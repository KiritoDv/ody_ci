const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Main = require('../main')

app.use(bodyParser.json());

app.post("/gl", (req, res)=> {
    Main.mirror.handleHook(req.body);
    res.sendStatus(200)
})

app.get("/", (req, res) => {
    res.send("Go fuck u r self");
})

app.listen(3452);

module.exports = app;