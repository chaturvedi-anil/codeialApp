const { Socket } = require('socket.io');

module.exports.chatSocket = function(socketServer) 
{
    // 
    let io = require('socket.io')(socketServer, {cors:{origin:"*"}});

    console.log('chat socket');

    io.on('connection', function(socket) {
        console.log('new connection received', socket.id);
        
        // on diconnect
        socket.on('disconnect', function() 
        {
            console.log('socket disconnected');
        });

        // receiving the request
        socket.on('join_room', function(data)
        {
            console.log('joining request received',data);

            // user will join the chat room
            socket.join(data.chatroom);

            // sending notification to all the user that new user join the chat room  
            io.in(data.chatroom).emit('user_joined', data);
        });
    });
};
