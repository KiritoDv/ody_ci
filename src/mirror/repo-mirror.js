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

            /* TODO: Add auto branch detection

                this.altExec(['-C', this.path, 'branch', '-a']).then((res) => {
                    var branches = [...new Set(res.toString().replace(/\n/g, '').trim().split(" ").filter(a => a != '').filter(a => a != '->').filter(a => !a.includes("mirror")).filter(a => !a.includes("HEAD")))];

                    console.log(branches)
                })
            */;
        }
    }

    handlePush(json){
        var name = json.repository.git_http_url ? gh(json.repository.git_http_url).name : gh(json.repository.clone_url).name;

        if(name && name == this.repo){
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

    altExec(args){
        return new Promise((resolve) => {

            const ls = spawn('git', args);

            ls.stdout.on('data', (data) => {
                if(data != ""){
                    resolve(data);
                }
            });

            ls.stderr.on('data', (data) => {
                if(data != ""){
                    resolve(data);
                }
            });

            ls.on('close', (code) => {
                resolve(null);
            });
        });
    }
}

module.exports = Mirror;