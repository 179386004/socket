const http = require('http')
var fs = require('fs');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
const app = http.createServer()
const users = []



app.listen(3011,()=>{
    console.log('服务器启动成功');
});

const io = require('socket.io')(app); 
 io.on('connection', function (socket) {  
    
    socket.on('login',data=>{
     let user =  users.find(item=> item.name === data.name)
     console.log(users);
     if(user){
       console.log('用户存在');
       socket.emit('exist','用户存在')
     }
     else if(users.length<4){

       users.push(data)
      console.log(data);
      io.emit('send',`${data. name}:进入了聊天室`) //触发当前用户的事件
      io.emit('list',users)

      socket.username = data.name
      socket.url = data.url
     }
     else{
     
      socket.emit('overload','当前聊天已经满')
     }
              
    })

    socket.on('chat',data=>{
      io.emit('chated',{name:data.name,text:data.text,url:data.url})
      io.emit('list',users) 
    })

    socket.on('upic',data=>{
      io.emit('list',users) 
      console.log(data);
      io.emit('repic',data)
    })

    
  //断开连接
    socket.on('disconnect',()=>{
      let idx =users.findIndex(item => item.username == socket.username)
      //删除掉断开连接的这个人
      users.splice(idx,1)

      io.emit('leave',{
        name:socket.username,
        avatar:socket.avatar


      })
      
      io.emit('list',users) 
      
     
    })


   


   //用户离开聊天室的功能
  
 
}); 
