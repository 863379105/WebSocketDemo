
/* 暗号暗号：实时通信 */
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

/* 通过 io.on() 监听 connection 事件，当客户端建立连接时，进入该函数,
   并提供一个socket对象，该对象可以理解为每一次的连接都会创建一个socket对象，
   双向通信都是通过socket对象来完成的 */
io.on('connection',(socket) => {
    console.log(`${socket.id} connected`);
    
    // 连接成功向前端发送建立连接的客户端id,socket对象中自带客户端id属性
    // 通过socket.emit()发送数据
    // https://socket.io/docs/client-api/#socket-emit-eventName-%E2%80%A6args-ack
    socket.emit('user',socket.id)

    //监听message事件
    socket.on('message',(msg) => {
        let msgData = {
            userId : socket.id,
            message : msg,
            timestamp : getTime()
        }
        //广播message事件下的内容,通过新创建的messageData事件广播
        //socket.broadcast.emit()方法会将数据发送给除自己以外的所有客户端
        //如果同时也需要将数据发送给自己，需要通过socket.emit()发送数据
        socket.broadcast.emit('messageData',msgData)
        socket.emit('messageData',msgData)
    })

})

//监听服务端口
server.listen(8888,() => {
    console.log('success');
})
//获取时间函数
function getTime(){
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let day =  new Date().getDate()
    let hour = new Date().getHours()
    let minute = new Date().getMinutes()
    let second = new Date().getSeconds()
    return `${year}-${month + 1}-${day} ${hour}:${minute}:${second}`
} 