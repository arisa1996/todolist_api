const headers = require('./baseHeader');
function errorHandle(res){
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': 'fail',
        'message': '欄位填寫錯誤或無此 ID'
    }));
    res.end();
}

module.exports = errorHandle;