class ChatEngine
{
    constructor(chatBoxId, userEmail)
    {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://54.172.81.123:5000');

        if(this.userEmail)
        {
            this.connectionHandler();
        }
    }

    connectionHandler()
    {
        let self = this;
        this.socket.on('connect', function()
        {
            console.log('connection stablished using sockets...!');

            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data)
            {
                console.log('a user joined ', data);
            });
        });

        // CHANGE :: send a message on clicking the send message button 
        $('#send-message').click(function()
        {
            // console.log('send message');
            let msg = $('#chat-message-input').val();

            if(msg != '')
            {
                // send_message is a socket property
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        // detect received message  (receive_message is a socket property)
        self.socket.on('receive_message', function(data)
        {
            console.log('message received', data.message);
            
            let newMessage = $('<li>');

            let messageType = 'other-message';

            if(data.user_email == self.userEmail)
            {
                messageType = 'self-message';
            }

            newMessage.append($('<span>',
            {
                'html':data.message
            }));

            newMessage.append($('<sub>',
            {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}