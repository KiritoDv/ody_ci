const path = require("path");
const exec = require('child_process').exec;
const fs = require('fs');
var gh = require('parse-github-url');

const { spawn } = require('child_process');

class Mirror{

    constructor(url, mirror, branch){
        this.url = url;
        this.mirror = mirror;
        this.repo = gh(url).name;
        this.branch = branch;
        this.path = path.join(__dirname, "..", "..", "mirrors", this.repo, this.branch);
    }

    async initRepo(){

        if(!fs.existsSync(this.path)){
            console.log(`[Mirror] Working on: ${this.repo}`)

            this.cmdExec(['clone', "-b", this.branch, this.url, this.path]).then(() => {
                console.log(`[Mirror] Adding mirror remote: ${this.mirror}`)
                this.cmdExec(['-C', this.path, "remote", "add", "mirror", this.mirror]).then(() => {
                    console.log(`[Mirror] Pushing to Mirror`)
                    this.cmdExec(['-C', this.path, 'pull', 'origin', this.branch]).then(() => {
                        this.cmdExec(['-C', this.path, 'push', '-u', 'mirror', this.branch]).then(() => {
                            console.log(`[Mirror] Success`)
                        });
                    });
                });
            });
        }else{
            console.log(`[Mirror] Working on: ${this.repo}`)

            this.cmdExec(['-C', this.path, 'fetch', 'origin', this.branch]).then(() => {
                this.cmdExec(['-C', this.path, 'pull', 'origin', this.branch]).then(() => {
                    this.cmdExec(['-C', this.path, 'push', '-u', 'mirror', this.branch]).then(() => {
                        console.log(`[Mirror] Success`)
                    });
                });
            });
        }
    }

    handlePush(json){
        if(gh(json.repository.git_http_url).name == this.repo){
            console.log(`[Mirror] Detected changes on: ${this.repo}`);
            console.log(`[Mirror] Pushing to mirror`);
            this.cmdExec(['-C', this.path, 'fetch', 'origin', this.branch]).then(() => {
                this.cmdExec(['-C', this.path, 'pull', 'origin', this.branch]).then(() => {
                    this.cmdExec(['-C', this.path, 'push', '-u', 'mirror', this.branch]).then(() => {
                        console.log(`[Mirror] Success`)
                    });
                });
            });
        }
    }

    cmdExec(args){
        return new Promise((resolve) => {

            const ls = spawn('git', args);

            ls.stdout.on('data', (data) => {
                if(data != ""){
                    console.error(`[Mirror] ${data}`);
                }
            });

            ls.stderr.on('data', (data) => {
                if(data != ""){
                    console.error(`[Mirror] ${data}`);
                }
            });

            ls.on('close', (code) => {
                resolve()
            });
        });
    }

}

module.exports = Mirror;