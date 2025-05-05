// Função para recuperar o ID do usuário atual da sessão
function getCurrentUserId() {
    return localStorage.getItem('userId') || 2; // Default para teste
}

// Função para carregar os dados do usuário
async function loadUserData() {
    const userId = getCurrentUserId();
    
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do usuário');
        }
        
        const userData = await response.json();
        
        // Preencher o formulário de dados pessoais
        document.getElementById('edit_name').value = userData.nome || '';
        document.getElementById('edit_email').value = userData.email || '';
        
        // Se houver dados adicionais no banco, preencher também
        if (userData.cpf) document.getElementById('edit_cpf').value = userData.cpf;
        if (userData.telefone) document.getElementById('edit_phone').value = userData.telefone;
        if (userData.dataNascimento) document.getElementById('edit_birth').value = userData.dataNascimento;
        if (userData.genero) document.getElementById('edit_gender').value = userData.genero;
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os dados do usuário. Tente novamente mais tarde.');
    }
}

// Função para atualizar os dados pessoais do usuário
async function updatePersonalData(formData) {
    const userId = getCurrentUserId();
    
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar dados do usuário');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Função para atualizar a senha do usuário
async function updatePassword(passwordData) {
    const userId = getCurrentUserId();
    
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senha: passwordData.newPassword })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar senha');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Função para configurar as abas
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab_content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe active de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active na aba clicada
            this.classList.add('active');
            
            // Mostrar o conteúdo correspondente
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}_tab`).classList.add('active');
        });
    });
}

// Função para formatar inputs
function setupInputMasks() {
    const cpfInput = document.getElementById('edit_cpf');
    const phoneInput = document.getElementById('edit_phone');
    const cepInput = document.getElementById('address_cep');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            
            this.value = value;
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            
            this.value = value;
        });
    }
    
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
            }
            
            this.value = value;
        });
        
        // Consulta de CEP
        cepInput.addEventListener('blur', async function() {
            const cep = this.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        document.getElementById('address_street').value = data.logradouro;
                        document.getElementById('address_district').value = data.bairro;
                        document.getElementById('address_city').value = data.localidade;
                        document.getElementById('address_state').value = data.uf;
                    }
                } catch (error) {
                    console.error('Erro ao consultar CEP:', error);
                }
            }
        });
    }
}

// Função para configurar o formulário de endereço
function setupAddressForm() {
    const addAddressBtn = document.getElementById('add_address_btn');
    const addressFormContainer = document.getElementById('address_form_container');
    const cancelAddressBtn = document.getElementById('cancel_address_btn');
    
    addAddressBtn.addEventListener('click', function() {
        addressFormContainer.classList.remove('hidden');
        this.style.display = 'none';
    });
    
    cancelAddressBtn.addEventListener('click', function() {
        addressFormContainer.classList.add('hidden');
        addAddressBtn.style.display = 'block';
        document.getElementById('address_form').reset();
    });
    
    // Lidar com o envio do formulário de endereço
    document.getElementById('address_form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Coletar dados do formulário
        const addressData = {
            title: document.getElementById('address_title').value,
            cep: document.getElementById('address_cep').value,
            street: document.getElementById('address_street').value,
            number: document.getElementById('address_number').value,
            complement: document.getElementById('address_complement').value,
            district: document.getElementById('address_district').value,
            city: document.getElementById('address_city').value,
            state: document.getElementById('address_state').value
        };
        
        // Aqui você enviaria os dados para o servidor
        // Para este exemplo, apenas simularemos o sucesso
        
        // Criar elemento de endereço e adicionar à lista
        const addressList = document.getElementById('address_list');
        const noAddressMessage = document.getElementById('no_address_message');
        
        // Esconder mensagem de "sem endereços"
        noAddressMessage.style.display = 'none';
        
        const addressElement = document.createElement('div');
        addressElement.classList.add('address_item');
        addressElement.innerHTML = `
            <div class="address_header">
                <h4>${addressData.title}</h4>
                <div class="address_actions">
                    <button class="edit_address_btn">Editar</button>
                    <button class="delete_address_btn">Excluir</button>
                </div>
            </div>
            <div class="address_details">
                <p>${addressData.street}, ${addressData.number} ${addressData.complement ? '- ' + addressData.complement : ''}</p>
                <p>${addressData.district}, ${addressData.city} - ${addressData.state}</p>
                <p>CEP: ${addressData.cep}</p>
            </div>
        `;
        
        addressList.appendChild(addressElement);
        
        // Resetar formulário e escondê-lo
        this.reset();
        addressFormContainer.classList.add('hidden');
        addAddressBtn.style.display = 'block';
        
        // Adicionar eventos aos botões
        addressElement.querySelector('.edit_address_btn').addEventListener('click', function() {
            alert('Funcionalidade de edição seria implementada aqui');
        });
        
        addressElement.querySelector('.delete_address_btn').addEventListener('click', function() {
            if (confirm('Deseja realmente excluir este endereço?')) {
                addressElement.remove();
                
                // Verificar se a lista está vazia
                if (addressList.children.length === 1) { // Considerando o elemento de mensagem
                    noAddressMessage.style.display = 'block';
                }
            }
        });
        
        alert('Endereço adicionado com sucesso!');
    });
}

// Configurar validação de senha
function setupPasswordValidation() {
    const newPasswordInput = document.getElementById('new_password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    function validatePassword() {
        const password = newPasswordInput.value;
        
        // Validar tamanho
        const reqLength = document.getElementById('req_length');
        if (password.length >= 8) {
            reqLength.classList.add('valid');
        } else {
            reqLength.classList.remove('valid');
        }
        
        // Validar letra maiúscula
        const reqUppercase = document.getElementById('req_uppercase');
        if (/[A-Z]/.test(password)) {
            reqUppercase.classList.add('valid');
        } else {
            reqUppercase.classList.remove('valid');
        }
        
        // Validar número
        const reqNumber = document.getElementById('req_number');
        if (/[0-9]/.test(password)) {
            reqNumber.classList.add('valid');
        } else {
            reqNumber.classList.remove('valid');
        }
        
        // Validar caractere especial
        const reqSpecial = document.getElementById('req_special');
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            reqSpecial.classList.add('valid');
        } else {
            reqSpecial.classList.remove('valid');
        }
    }
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', validatePassword);
    }
    
    // Verificar se as senhas são iguais
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value === newPasswordInput.value) {
                this.setCustomValidity('');
            } else {
                this.setCustomValidity('As senhas não coincidem');
            }
        });
    }
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupTabs();
    setupInputMasks();
    setupAddressForm();
    setupPasswordValidation();
    
    // Lidar com o envio do formulário de dados pessoais
    document.getElementById('personal_form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userData = {
            nome: document.getElementById('edit_name').value.trim(),
            email: document.getElementById('edit_email').value.trim(),
            cpf: document.getElementById('edit_cpf').value.trim(),
            telefone: document.getElementById('edit_phone').value.trim(),
            dataNascimento: document.getElementById('edit_birth').value,
            genero: document.getElementById('edit_gender').value
        };
        
        try {
            await updatePersonalData(userData);
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar dados. Tente novamente.');
        }
    });
    
    // Lidar com o envio do formulário de segurança
    document.getElementById('security_form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }
        
        try {
            // Aqui você verificaria a senha atual antes de permitir a alteração
            // Para este exemplo, vamos apenas atualizar
            await updatePassword({ 
                currentPassword,
                newPassword
            });
            
            alert('Senha atualizada com sucesso!');
            this.reset();
        } catch (error) {
            alert('Erro ao atualizar senha. Tente novamente.');
        }
    });
});