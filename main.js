const express = require("express");
const app = express();
const bodyParser = require("bodyParser");

app.use(bodyParser.json());

app.post("/gl", (req, res)=> {
    console.log(req)
    res.sendStatus(200)
})

app.get("/", (req, res) => {
    res.send("Go fuck u r self");
})

app.listen(3452);