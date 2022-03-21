const HEADERS = require('./baseHeader')

function successHandle(res, todos){
    res.writeHead(200, HEADERS)
    res.write(JSON.stringify({
        status: 'success',
        data: todos
      }))
    res.end()
}

function errorHandle(res, statusCode, msg){
    res.writeHead(statusCode, HEADERS);
    res.write(JSON.stringify({
        'status': 'fail',
        'message': msg
    }));
    res.end();
}

module.exports = {
    successHandle,
    errorHandle
};