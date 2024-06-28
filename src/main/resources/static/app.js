function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

window.onload = function() {
    document.getElementById('userId').value = generateUserId();
};

const userId = document.getElementById('userId');
const contactNumber = document.getElementById('contactNumber');
const message = document.getElementById('message');
const dateTime = document.getElementById('dateTime');
const userIdFeedback = document.getElementById('userIdFeedback');
const contactNumberFeedback = document.getElementById('contactNumberFeedback');
const messageFeedback = document.getElementById('messageFeedback');
const dateTimeFeedback = document.getElementById('dateTimeFeedback');
const loginButton = document.getElementById('loginButton');
const statusBox = document.getElementById('status-box');
const qrCodeImage = document.getElementById('qrcode-image');

let intervalId;
let apiKey = env.X_API_KEY;

function updateStatus(state) {
    statusBox.textContent = state;
    if (state === 'CONECTADO') {
        statusBox.classList.remove('bg-gray-300', 'text-gray-700');
        statusBox.classList.add('bg-green-500', 'text-white');
    } else {
        statusBox.classList.remove('bg-green-500', 'text-white');
        statusBox.classList.add('bg-gray-300', 'text-gray-700');
    }
}

function checkSessionStatus(userId) {
    fetch(`http://localhost:8080/session/status/${userId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success && data.state === 'CONNECTED') {
            updateStatus('CONECTADO');
            clearInterval(intervalId);
        } else if (data.message === 'session_not_connected') {
            updateStatus('DESCONECTADO');
            generatingQrCode(userId);
        } else {
            updateStatus('AGUARDE...');
        }
    })
    .catch(error => {
        console.log('Erro ao verificar o status da sessão:', error);
        updateStatus('DESCONECTADO');
    });
}

function generatingQrCode(userIdValue) {
    console.log('Gerando QR Code...');
    fetch(`http://localhost:8080/qr-code`, {
        method: 'GET'
    })
    .then(response => response.blob())
    .then(blob => {
        const qrCodeImageUrl = URL.createObjectURL(blob);
        qrCodeImage.src = qrCodeImageUrl;
        console.log(qrCodeImage.src);
        console.log(qrCodeImageUrl);
    })
    .catch(error => console.log('Erro ao obter o QR Code: ', error));
}

loginButton.addEventListener('click', async function() {
    const userIdValue = userId.value.trim();
    console.log('ID do usuário:', userIdValue);
    if (userIdValue !== '') {
        console.log('Iniciando fetch...');
        try {
            const response = await fetch(`http://localhost:8080/login`, {
                method: 'GET'
            });
            console.log('Resposta recebida:', response);
            const data = await response.json();
            console.log('Dados recebidos:', data);
            if (data.success) {
                console.log('Sessão iniciada com sucesso.');
                updateStatus('AGUARDE...');
                setTimeout(async function(){
                    console.log("Executado após 8 segundos");
                    console.log('Verificando status da sessão...');
                    await checkSessionStatus(userIdValue);
                }, 8000);
            } else {
                console.log('Erro ao iniciar sessão:', data.message);
                updateStatus('DESCONECTADO');
            }
        } catch (error) {
            console.log('Erro ao iniciar sessão:', error);
            updateStatus('DESCONECTADO');
        }
    } else {
        console.log('O ID de usuário é obrigatório.');
    }
});



userId.addEventListener('input', () => {
    if (userId.value.trim() !== '') {
        userIdFeedback.innerHTML = '<span class="text-green-500"><i class="fas fa-check"></i> ID de usuário válido</span>';
    } else {
        userIdFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O ID de usuário é obrigatório.</span>';
    }
});

userId.addEventListener('blur', () => {
    if (userId.value.trim() === '') {
        userIdFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O ID de usuário é obrigatório.</span>';
    } else {
        userIdFeedback.innerHTML = '';
    }
});

contactNumber.addEventListener('input', () => {
    if (contactNumber.value.length === 11 && /^\d+$/.test(contactNumber.value)) {
        contactNumberFeedback.innerHTML = '<span class="text-green-500"><i class="fas fa-check"></i> Número de contato válido</span>';
    } else {
        contactNumberFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O número do contato deve ter exatamente 11 dígitos.</span>';
    }
});

contactNumber.addEventListener('blur', () => {
    if (contactNumber.value.length !== 11 || !/^\d+$/.test(contactNumber.value)) {
        contactNumberFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O número do contato deve ter exatamente 11 dígitos.</span>';
    } else {
        contactNumberFeedback.innerHTML = '';
    }
});

message.addEventListener('input', () => {
    if (message.value.trim() === '') {
        messageFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O campo mensagem é obrigatório.</span>';
    } else {
        messageFeedback.innerHTML = '<span class="text-green-500"><i class="fas fa-check"></i> Mensagem válida</span>';
    }
});

message.addEventListener('blur', () => {
    if (message.value.trim() === '') {
        messageFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O campo mensagem é obrigatório.</span>';
    } else {
        messageFeedback.innerHTML = '';
    }
});

dateTime.addEventListener('blur', () => {
    if (dateTime.value.trim() === '') {
        dateTimeFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O campo dia e hora é obrigatório.</span>';
    } else {
        dateTimeFeedback.innerHTML = '';
    }
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let valid = true;

    if (userId.value.trim() === '') {
        userIdFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O ID de usuário é obrigatório.</span>';
        valid = false;
    }

    if (contactNumber.value.length !== 11 || !/^\d+$/.test(contactNumber.value)) {
        contactNumberFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O número do contato deve ter exatamente 11 dígitos.</span>';
        valid = false;
    }

    if (message.value.trim() === '') {
        messageFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O campo mensagem é obrigatório.</span>';
        valid = false;
    }

    if (dateTime.value.trim() === '') {
        dateTimeFeedback.innerHTML = '<span class="text-red-500"><i class="fas fa-times"></i> O campo dia e hora é obrigatório.</span>';
        valid = false;
    }

    if (valid) {
        const data = {
            userId: userId.value,
            contactNumber: contactNumber.value,
            message: message.value,
            dateTime: dateTime.value
        };

        fetch('http://localhost:3000/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert('Mensagem enviada com sucesso!');
            })
            .catch(error => {
                console.log('Erro:', error);
                alert('Ocorreu um erro ao enviar a mensagem.');
            });
    }
});
