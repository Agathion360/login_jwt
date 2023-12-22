const message = document.getElementById('message')
const received_messages = document.getElementById('received_messages')
const socket = io() 




socket.on('newMessage', data => {
    received_messages.innerHTML += `<strong style="color:blue" class="chat_name">${data.user} </strong> dice ${data.message}<br />`
});

const sendMessage = () => {
    if (message.value.trim() !== '') {
        const msg = { user: user, message: message.value.trim() };
        socket.emit('message', msg);
        received_messages.innerHTML += `<strong style="color:blue" class="chat_name">${msg.user} </strong> dice ${msg.message}<br />`
        message.value = '';
    }
}

let user
Swal.fire({
    title: 'Login',
    input: 'text',
    text: 'Ingresar usuario:',
    inputValidator: value => {
        return !value && 'Por favor ingresar usuario!'
    },
    allowOutsideClick: false
}).then(res => {
    user = res.value
})

