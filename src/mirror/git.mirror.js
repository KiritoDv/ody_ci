const config = require("../config/cfg.manager");
const Mirror = require("./repo-mirror")

class GitMirror{

    constructor(){
        this.mirrors = [];
        GitMirror.prototype.instance = this;
    }

    initMirror(r){
        return new Promise((resolve) => {
            var repo = new Mirror(r.repo, r.mirror);
            this.mirrors.push(repo)
            repo.initRepo();

            resolve("[Mirror] Adding Mirror");
        })
    }

    loadMirrors(){
        config.mirrors.forEach(r => {
            var repo = new Mirror(r.repo, r.mirror);
            this.mirrors.push(repo)
            repo.initRepo();
        });
    }

    handleHook(json){
        this.mirrors.forEach(m => m.handlePush(json))
    }
}
module.exports = new GitMirror();