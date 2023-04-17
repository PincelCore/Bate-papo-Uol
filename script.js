axios.defaults.headers.common['Authorization'] = 'r8kBMRD2eHzX3IlcxbmI31BL';
const urlParticipants = 'https://mock-api.driven.com.br/api/vm/uol/participants';
const urlStatus = 'https://mock-api.driven.com.br/api/vm/uol/status';
const urlMessage = 'https://mock-api.driven.com.br/api/vm/uol/messages';

const user = {
    name: ''
};

function enterRoom() {
    function nameCheck(check) {
        console.log(check);
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

function getMessages() {
    axios.get(urlMessage)
      .then(response => {
        const messages = response.data;
        const messagesList = document.querySelector('.messages');
  
        messagesList.innerHTML = '';
  
        messages.forEach(message => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          const strong = document.createElement('strong');
          const messageText = document.createTextNode(message.text);
  
          span.appendChild(document.createTextNode(`(${message.time})`));
          strong.appendChild(document.createTextNode(message.from));
          li.appendChild(span);
          li.appendChild(document.createTextNode(' '));
          li.appendChild(strong);
          li.appendChild(document.createTextNode(': '));
          li.appendChild(messageText);
  
          messagesList.appendChild(li);
        });
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

sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    messageInput.value = "";

    const data = {
        from: user.name,
        to: "Todos",
        text: message,
        type: "message",
    };

    axios.post(urlMessage, data)
        .then(() => {
            getMessages();
        })
        .catch(() => {
            window.location.reload();
        });
});





