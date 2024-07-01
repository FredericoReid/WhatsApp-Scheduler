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

//WhatsApp session status
async function checkSessionStatus(userIdValue) {
    try {
        const response = await fetch(`http://localhost:8080/status/${userIdValue}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.message === 'session_connected') {
            console.log('Sessão iniciada com sucesso.');
            updateStatus('CONECTADO');
            clearInterval(intervalId);
        } else {
            console.log('Aguardando conexão...');
            updateStatus('AGUARDE...');
            generatingQrCode(userIdValue);
        }
    } catch (error) {
        console.log('Erro ao obter o status da sessão:', error);
        updateStatus('DESCONECTADO');
        clearInterval(intervalId);
    }
}

async function generatingQrCode(userIdValue) {
    console.log('Gerando QR Code...');
    try {
        const response = await fetch(`http://localhost:8080/qr-code/${userIdValue}/image`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('QR Code gerado com sucesso.');
        const blob = await response.blob();
        const qrCodeImageUrl = URL.createObjectURL(blob);
        const qrCodeImage = document.getElementById('qrcode-image');
        if (qrCodeImage) {
            qrCodeImage.src = qrCodeImageUrl;
            console.log(qrCodeImage.src);
            console.log(qrCodeImageUrl);
        } else {
            console.log('Elemento de imagem QR Code não encontrado no DOM.');
        }
    } catch (error) {
        console.log('Erro ao obter o QR Code: ', error);
    }
}

//login
loginButton.addEventListener('click', async function() {
    const userIdValue = userId.value.trim();
    console.log('ID do usuário:', userIdValue);
    if (userIdValue !== '') {
        console.log('Iniciando fetch...');
        try {
            const response = await fetch(`http://localhost:8080/login/${userIdValue}`, {
                method: 'GET'
            });
            console.log('Resposta recebida:', response);
            const data = await response.json();
            console.log('Dados recebidos:', data);
            if (data.success) {
                console.log('Sessão iniciada com sucesso.');
                updateStatus('AGUARDE...');
                setTimeout(async function(){
                    await console.log("Executado após 8 segundos");
                    await console.log('Verificando status da sessão...');
                    intervalId = setInterval(function() { checkSessionStatus(userIdValue); }, 5000);
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
