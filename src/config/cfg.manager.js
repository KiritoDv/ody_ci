const path = require("path");
const fs = require('fs');

var p = path.join(__dirname, "..", "..", "data.json");

var config = {
    mirrors: []
};

if(!fs.existsSync(p))
    fs.writeFileSync(p, JSON.stringify(config));
else
    config = JSON.parse(fs.readFileSync(p, "utf-8"));

module.exports = config;