//引入模块
const Koa = require('koa')
const socketIo = require('socket.io')

//实例化koa对象
const app = new Koa()
//初始化sokcet
const server = require('http').createServer(app.callback());//因为koa没有暴露server对象，这里很巧妙的运用了server做了一个代理
const io = socketIo(server)

io.on('connection',() => {

})

//监听服务端口
server.listen(8888,() => {
    console.log('success');
})