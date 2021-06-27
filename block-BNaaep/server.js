let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let url = require('url');


let server = http.createServer(handleRequest);

function handleRequest(req, res) {

    let parsedUrl = url.parse(req.url, true);
    let store = "";
    req.on('data', (chunk) => {
        store += chunk;
    })

    req.on('end', () => {
        
        // index route (/)

        if(req.url === '/' && req.method === 'GET'){
            res.writeHead(200, {'Content-Type': 'text/html'});
            return fs.createReadStream('./project/index.html').pipe(res);
            
        } else if(req.url.split('.').pop() === 'css' && req.method === 'GET') {
            let cssPath = __dirname + '/project' + req.url;
            res.writeHead(200, {'Content-Type': 'text/css'});
            return fs.createReadStream(cssPath).pipe(res);
        } else if(req.url.split('.').pop() === 'jpeg' && req.method === 'GET') {
            let imgPath = __dirname + '/project' + req.url;
            res.writeHead(200, {'Content-Type': 'image/ jpeg'});
            return fs.createReadStream(imgPath).pipe(res);
        } 

        // about route

        if(req.url === '/about' && req.method === 'GET') {
            let aboutPath = __dirname + '/project' + req.url;
            res.writeHead(200, {'Content-Type': 'text/html'});
            return fs.createReadStream(aboutPath + '.html').pipe(res);
        } else if(req.url.split('.').pop() === 'css' && req.method === 'GET') {
            let imgPath = __dirname + '/project' + req.url;
            res.writeHead(200, {'Content-Type': 'text/css'});
            return fs.createReadStream(imgPath).pipe(res);
        } else if(req.url.split('.').pop() === 'jpeg' && req.method === 'GET') {
            let imgPath = __dirname + '/project' + req.url;
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            return fs.createReadStream(imgPath).pipe(res);
    
        } 

        //contact route

        if(req.url === '/contact' && req.method === 'GET') {
            let formPath = __dirname + '/project/form.html';
            res.writeHead(200, {'Content-Type': 'text/html'});
            return fs.createReadStream(formPath).pipe(res);
        }

        //form route

        if(req.url === '/form' && req.method === 'POST') {
            let parsedData = qs.parse(store);
            let userName = parsedData.username;
            let rootPath = __dirname + '/contacts/';
            fs.open(rootPath + userName + '.json', 'wx', (err, fd) => {
                if(err)  throw new Error(`${userName} already exits`);
                fs.write(fd, JSON.stringify(parsedData), (err) => {
                    if(err) return console.log(err);
                    fs.close(fd, (err) => {
                        if(err) return console.log(err);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        return res.end('<h1>Contact Saved</h1>');
                    })
                })
            })
        }

        //Fetching data 

        if(parsedUrl.pathname === '/users' && req.method === 'GET') {
            let user = parsedUrl.query.username;
            let path = __dirname + '/contacts/' + user + '.json';
            let rootFolder = __dirname + '/contacts';
            if(user) {
               
                
                fs.readFile(path, (err, content) => {
                    if(err) return console.log(err);
                    
                    let data = (JSON.parse(content.toString()));
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(`<h2>${data.name}</h2>`);
                    res.write(`<h2>${data.email}</h2>`);
                    res.write(`<h2>${data.username}</h2>`);
                    res.write(`<h2>${data.age}</h2>`);
                    res.write(`<h2>${data.bio}</h2>`);
                    return res.end();
                });
            
            } else {
                    let files = fs.readdirSync(rootFolder);
                    let contacts = files.map((file) => {
                        return JSON.parse(fs.readFileSync(rootFolder + "/" + file));
                        
                    });

                    let datas = "";

                    contacts.forEach((contact) => {
                        datas += 
                        `<h2>${contact.name}</h2>
                         <h2>${contact.email}</h2>
                        <h2>${contact.username}</h2>
                        <h2>${contact.age}</h2>
                        <h2>${contact.bio}</h2>`;
                    })

                    res.writeHead(200, {'Content-Type': 'text/html'});
                    return res.end(datas);
                    
                }
            
                
            }

            

    
             
        })

       
        
    }

    server.listen(3000, () => {
        console.log('Server is listening on Port 3k');
    })

