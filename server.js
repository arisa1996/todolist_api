const http = require('http');
const { v4: uuidv4 } = require('uuid');
const HEADERS = require('./baseHeader');
const { successHandle, errorHandle } = require('./responseHandle');
const todos = [];

const requestListener = (req, res)=> {
    let body = '';

    req.on('data', chunk=>{
        body += chunk;
    })

    if(req.url === '/todos' && req.method === 'GET'){
        successHandle(res, todos);
    }else if(req.url === '/todos' && req.method === 'POST'){
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo = {
                        title,
                        'id': uuidv4()
                    }
                    todos.push(todo);
                    successHandle(res, todos);
                }else{
                    errorHandle(res, 400, '資料不齊全');
                }
            }catch(err){
                errorHandle(res, 400, '建立失敗');
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
                    successHandle(res, todos);
                }else{
                    errorHandle(res, 400, '欄位填寫錯誤或無此 ID');
                }
            }catch(err){
                errorHandle(res, 400, '更新失敗');
            }
        });
    }else if(req.url.startsWith('/todos/') && req.method === 'DELETE'){
        // 刪除單筆id
        const id = req.url.split('/').pop();
        const idx = todos.findIndex(e => e.id === id);
        if(idx !== -1){
            todos.splice(idx, 1);
            successHandle(res, todos);
        }else{
            errorHandle(res, 400, '刪除失敗');
        }    
    }else if(req.url === '/todos' && req.method === 'DELETE'){
        // 刪除全部
        todos.length = 0;
        successHandle(res, todos);
    }else if(req.method === 'OPTIONS'){
        res.writeHead(200, HEADERS);
        res.end();
    }else{
        errorHandle(response, 404, 'Not found');
    }
}


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);