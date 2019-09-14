const express = require("express");
const app = express();

app.post("/gl", (req, res)=> {
    console.log("POST: "+req.body)
})

app.get("/gli", (req, res)=> {
    console.log("GET: "+req.body)
})

app.get("/", (req, res) => {
    res.send("awa");
})

app.listen(9991);