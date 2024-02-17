const chat = document.querySelector('.chat__messages')

const fiUri = "wss://socketsbay.com/wss/v2/1/c7a704f42144ac9d0338cc7b42f7065e/";

let chatSocket = new WebSocket(fiUri)

chatSocket.onopen = function (event) {
    chat.innerHTML += showMsg('socket is open', 'open')


}
chatSocket.onclose = function (event) {
    chat.innerHTML += showMsg('socket is closed', 'close')

}
chatSocket.onmessage = function (event) {
    chat.innerHTML += showMsg(event.data, 'inbound')

}
chatSocket.onerror = function (event) {
    chat.innerHTML += showMsg(event.data, 'error')

}

document.querySelector('.chat__exit').onclick = function () {
    chatSocket.close()
}

document.querySelector('.chat__form').onsubmit = function () {
    event.preventDefault()
    let userName = localStorage.getItem('userName')
    if (!userName) {
        userName = prompt('Enter your name')
        if (userName) {
            localStorage.setItem('userName', userName)
        }
    }

    if (userName) {
        chatSocket.send(event.target.elements.msg.value)
        chat.innerHTML += showMsg(event.target.elements.msg.value, 'outcome')
    }

    event.target.reset()
}

function showMsg(msg, type) {

    return `<span class="msg msg--${type}">${msg}</span>`

}



