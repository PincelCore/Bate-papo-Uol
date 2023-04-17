axios.defaults.headers.common['Authorization'] = 'r8kBMRD2eHzX3IlcxbmI31BL';
const urlParticipants = 'https://mock-api.driven.com.br/api/vm/uol/participants';
const urlStatus = 'https://mock-api.driven.com.br/api/vm/uol/status';

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





