class Main{

    constructor(){
        this.mirror = require("./mirror/git.mirror");
        this.mirror.loadMirrors();
    }
}

var instance = new Main();

module.exports = instance;

require("./express/express")
//require("./telegram/telegram.bot")