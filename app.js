//引入模块
const Koa = require('koa')
const Router = require('@koa/router')
const socketIo = require('socket.io')
const fs = require('fs')

//实例化koa对象
const app = new Koa()
//初始化sokcet
const server = require('http').createServer(app.callback());//因为koa没有暴露server对象，这里很巧妙的运用了server做了一个代理
const io = socketIo(server)
//实例化router对象
const router = new Router()

//配置路由
router.get('/',async ctx => {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = fs.readFileSync('./index.html')
})
app.use(router.routes())

io.on('connection',() => {
    console.log('a user connected');
})

//监听服务端口
server.listen(8888,() => {
    console.log('success');
})