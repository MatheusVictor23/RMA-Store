// Função para recuperar o ID do usuário atual da sessão
function getCurrentUserId() {
    // Na prática, você usaria alguma forma de armazenamento de sessão
    // Este é apenas um exemplo
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
        
        // Preencher os dados na página
        document.getElementById('user_name').textContent = userData.nome;
        document.getElementById('user_email').textContent = userData.email;
        
        // Preencher o formulário
        document.getElementById('edit_name').value = userData.nome;
        document.getElementById('edit_email').value = userData.email;
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os dados do usuário. Tente novamente mais tarde.');
    }
}

// Função para atualizar os dados do usuário
async function updateUserData(userData) {
    const userId = getCurrentUserId();
    
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
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

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    
    // Adicionar evento para o formulário
    document.getElementById('perfil_form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.getElementById('edit_name').value.trim();
        const email = document.getElementById('edit_email').value.trim();
        const password = document.getElementById('edit_password').value.trim();
        const confirmPassword = document.getElementById('confirm_password').value.trim();
        
        // Validações básicas
        if (!name || name.length < 3) {
            alert('Por favor, insira um nome válido com pelo menos 3 caracteres.');
            return;
        }
        
        if (!email || !email.includes('@')) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        // Se o usuário quiser alterar a senha
        if (password) {
            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
        }
        
        // Preparar dados para atualização
        const userData = {
            nome: name,
            email: email
        };
        
        // Adicionar senha apenas se for fornecida
        if (password) {
            userData.senha = password;
        }
        
        try {
            await updateUserData(userData);
            alert('Perfil atualizado com sucesso!');
            loadUserData(); // Recarregar dados
        } catch (error) {
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    });
});