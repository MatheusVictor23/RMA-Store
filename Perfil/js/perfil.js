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
        
        // Preencher os dados na página
        document.getElementById('user_name').textContent = userData.nome || 'Usuário';
        document.getElementById('user_email').textContent = userData.email || 'email@exemplo.com';
        
    } catch (error) {
        console.error('Erro:', error);
        // Exibir dados de fallback em caso de erro
        document.getElementById('user_name').textContent = 'Usuário';
        document.getElementById('user_email').textContent = 'email@exemplo.com';
    }
}

// Função para carregar pedidos recentes
async function loadRecentOrders() {
    const userId = getCurrentUserId();
    const noOrdersMessage = document.getElementById('no_orders_message');
    const recentOrdersList = document.getElementById('recent_orders_list');
    
    try {
        // Na prática, você faria uma requisição para obter os pedidos do usuário
        // Simulando resposta para exemplo
        const mockOrders = [
            {
                id: 1001,
                date: '2025-03-15',
                status: 'delivered',
                total: 149.90
            },
            {
                id: 1002,
                date: '2025-04-28',
                status: 'processing',
                total: 89.90
            }
        ];
        
        if (mockOrders.length > 0) {
            noOrdersMessage.style.display = 'none';
            
            // Limpar o container
            recentOrdersList.innerHTML = '';
            
            // Mostrar apenas os 3 mais recentes
            const recentOrders = mockOrders.slice(0, 3);
            
            recentOrders.forEach(order => {
                const orderDate = new Date(order.date).toLocaleDateString('pt-BR');
                const orderTotal = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                let statusText = '';
                let statusClass = '';
                
                switch(order.status) {
                    case 'processing':
                        statusText = 'Em andamento';
                        statusClass = 'status_processing';
                        break;
                    case 'delivered':
                        statusText = 'Entregue';
                        statusClass = 'status_delivered';
                        break;
                    case 'canceled':
                        statusText = 'Cancelado';
                        statusClass = 'status_canceled';
                        break;
                    default:
                        statusText = 'Processando';
                        statusClass = 'status_processing';
                }
                
                const orderElement = document.createElement('div');
                orderElement.classList.add('order_item_small');
                orderElement.innerHTML = `
                    <div class="order_basic_info">
                        <span class="order_number">Pedido #${order.id}</span>
                        <span class="order_date">${orderDate}</span>
                    </div>
                    <span class="order_value">${orderTotal}</span>
                    <span class="order_status_badge ${statusClass}">${statusText}</span>
                `;
                
                recentOrdersList.appendChild(orderElement);
            });
        } else {
            noOrdersMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        noOrdersMessage.style.display = 'block';
    }
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadRecentOrders();
});