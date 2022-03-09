const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res)=> {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    };
    const successObj = {
        'status': 'success',
        'data': todos
    }
 
    let body = '';

    req.on('data', chunk=>{
        body += chunk;
    })

    if(req.url === '/todos' && req.method === 'GET'){
        res.writeHead(200, headers);
        res.write(JSON.stringify(successObj));
        res.end();
    }else if(req.url === '/todos' && req.method === 'POST'){
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo ={
                        title,
                        'id': uuidv4()
                    }
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(successObj));
                    res.end();
                }else{
                    errorHandle(res);
                }
            }catch(err){
                errorHandle(res);
            }
        });
    }else if(req.url.startsWith('/todos/') && req.method === 'PATCH'){
        req.on('end', ()=>{
            try{
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const idx = todos.findIndex(e => e.id === id);
                if(todo !== undefined && idx !== -1){
                    todos[idx].title = todo;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify(successObj));
                    res.end();
                }else{
                    errorHandle(res);
                }
            }catch(err){
                errorHandle(res);
            }
        });
    }else if(req.url.startsWith('/todos/') && req.method === 'DELETE'){
        // 刪除單筆id
        const id = req.url.split('/').pop();
        const idx = todos.findIndex(e => e.id === id);
        if(idx !== -1){
            todos.splice(idx, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify(successObj));
            res.end();
        }else{
            errorHandle(res);
        }    
    }else if(req.url === '/todos' && req.method === 'DELETE'){
        // 刪除全部
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify(successObj));
        res.end();
    }else if(req.method === 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            'status': 'fail',
            'message': '無此路由'
        }));
        res.end();
    }
}


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);