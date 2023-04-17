axios.defaults.headers.common['Authorization'] = 'r8kBMRD2eHzX3IlcxbmI31BL';
const urlParticipants = 'https://mock-api.driven.com.br/api/vm/uol/participants';
const urlStatus = 'https://mock-api.driven.com.br/api/vm/uol/status';
const urlMessage = 'https://mock-api.driven.com.br/api/vm/uol/messages';

let loggedIn = false;

const user = {
    name: ''
};

function enterRoom() {
    function nameCheck(check) {
        console.log(check);
        loggedIn = true;
        keepAlive(); 
    }    

    function nameError(error) {
        console.log(error);
        enterRoom();
    }

    user.name = prompt('Escolha um nome de usuário:');

    axios.post(urlParticipants, user)
        .then(nameCheck)
        .catch(error => {
            if (error.response.status === 400) {
                alert('Nome de usuário já existe. Por favor, escolha outro nome.');
                enterRoom();
            } else {
                nameError(error);
            }
        });
}

function keepAlive() {
    if (!loggedIn) return;
    setInterval(() => {
        axios.post(urlStatus, user)
            .then(response => {
                console.log('Usuário ainda está na sala.');
            })
            .catch(error => {
                console.log('Erro ao enviar keep alive:', error);
            });
    }, 5000);
}

enterRoom();

const MAX_MESSAGES = 100;

function getMessages() {
   if (!loggedIn) return;

  axios.get(urlMessage)
    .then(response => {
      const messages = response.data.slice(-MAX_MESSAGES);
      const messagesList = document.querySelector('.messages');

      messagesList.innerHTML = '';

      messages.forEach(message => {
        let messageHTML;
        
        if (message.type === 'status') {
          messageHTML = `<li data-test="message" class="message-item status"><span>(${message.time})</span> <strong>${message.from}</strong> ${message.text}</li>`;
        } else if (message.type === 'message') {
          messageHTML = `<li data-test="message" class="message-item public"><span>(${message.time})</span> <strong>${message.from}</strong> para <strong>Todos</strong>: ${message.text}</li>`;
        } else if (message.type === 'private_message') {
          if (message.from === user.name || message.to === user.name) {
            messageHTML = `<li data-test="message" class="message-item private"><span>(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}</li>`;
          } else {
            messageHTML = `<li data-test="message" class="message-item private hidden"><span>(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${message.text}</li>`;
          }
        }
        
        messagesList.innerHTML += messageHTML;
      });
      messagesList.scrollTop = messagesList.scrollHeight;
    })
    .catch(error => {
      console.error(error);
    });
}

setInterval(() => {
  getMessages();
}, 3000);

const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const messagesList = document.querySelector('.messages');
let messages = [];



sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  messageInput.value = "";

  const data = {
    from: user.name,
    to: "Todos",
    text: message,
    type: "message",
  };

  const messageHTML = `<li class="message-item"><span>(${new Date().toLocaleTimeString()})</span> <strong>${data.from}</strong> para <strong>Todos</strong>: ${data.text}</li>`;
  messagesList.innerHTML += messageHTML;
  messagesList.scrollTop = messagesList.scrollHeight;
  messages.push(data);

  axios.post(urlMessage, data)
    .then(() => {
      messageInput.value = ""; 
      getMessages();
    })
    .catch(() => {
      window.location.reload();
    });
});






