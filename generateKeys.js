const fs = require('fs');
const NodeRSA = require('node-rsa');

path = "keys"
keyName = ["clientProxy", "serverProxy"]

for (const name of keyName) {
    let key = new NodeRSA({b: 512});

    const public = key.exportKey('pkcs1-public-pem');
    fs.writeFile(path+"/"+name+".public", public, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(path+"/"+name+".public was saved!");
    }); 
    
    const private = key.exportKey('pkcs1-private-pem');
    fs.writeFile(path+"/"+name+".private", private, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(path+"/"+name+".private was saved!");
    }); 
}