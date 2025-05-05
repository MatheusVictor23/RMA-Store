// Função para recuperar o ID do usuário atual da sessão
function getCurrentUserId() {
    return localStorage.getItem('userId') || 2; // Default para teste
}

// Função para carregar os pedidos do usuário
async function loadOrders() {
    const userId = getCurrentUserId();
    const noOrdersMessage = document.getElementById('no_orders_message');
    const orderList = document.getElementById('order_list');
    
    try {
        // Na prática, você faria uma requisição para obter os pedidos do usuário
        // Simulando resposta para exemplo
        const mockOrders = [
            {
                id: 1001,
                date: '2025-03-15',
                status: 'delivered',
                total: 149.90,
                items: [
                    { name: 'Camiseta Básica', quantity: 2, price: 49.95 },
                    { name: 'Calça Jeans', quantity: 1, price: 50.00 }
                ]
            },
            {
                id: 1002,
                date: '2025-04-28',
                status: 'processing',
                total: 89.90,
                items: [
                    { name: 'Tênis Esportivo', quantity: 1, price: 89.90 }
                ]
            },
            {
                id: 1003,
                date: '2025-05-01',
                status: 'canceled',
                total: 129.90,
                items: [
                    { name: 'Casaco de Inverno', quantity: 1, price: 129.90 }
                ]
            }
        ];
        
        if (mockOrders.length > 0) {
            noOrdersMessage.style.display = 'none';
            
            // Limpar o container
            orderList.innerHTML = '';
            
            mockOrders.forEach(order => {
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
                
                let itemsHtml = '';
                order.items.forEach(item => {
                    const itemTotal = (item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    itemsHtml += `
                        <div class="order_item_product">
                            <span class="product_name">${item.name}</span>
                            <span class="product_quantity">Qtd: ${item.quantity}</span>
                            <span class="product_price">${itemTotal}</span>
                        </div>
                    `;
                });
                
                const orderElement = document.createElement('div');
                orderElement.classList.add('order_item');
                orderElement.dataset.status = order.status;
                orderElement.innerHTML = `
                    <div class="order_header">
                        <div class="order_info">
                            <div class="order_id_date">
                                <h4>Pedido #${order.id}</h4>
                                <span class="order_date">Realizado em ${orderDate}</span>
                            </div>
                            <span class="order_status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="order_total">
                            <span>Total:</span>
                            <span class="total_value">${orderTotal}</span>
                        </div>
                    </div>
                    <div class="order_products">
                        ${itemsHtml}
                    </div>
                    <div class="order_actions">
                        <button class="order_details_btn">Ver Detalhes</button>
                        ${order.status === 'processing' ? '<button class="order_cancel_btn">Cancelar Pedido</button>' : ''}
                    </div>
                `;
                
                orderList.appendChild(orderElement);
            });
            
            // Adicionar evento aos botões de detalhes
            document.querySelectorAll('.order_details_btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderItem = this.closest('.order_item');
                    const orderId = orderItem.querySelector('h4').textContent.replace('Pedido #', '');
                    alert(`Detalhes do pedido ${orderId} seriam exibidos aqui.`);
                });
            });
            
            // Adicionar evento aos botões de cancelamento
            document.querySelectorAll('.order_cancel_btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderItem = this.closest('.order_item');
                    const orderId = orderItem.querySelector('h4').textContent.replace('Pedido #', '');
                    if (confirm(`Deseja realmente cancelar o pedido ${orderId}?`)) {
                        alert('Pedido cancelado com sucesso!');
                        // Atualizar a interface
                        orderItem.querySelector('.order_status').textContent = 'Cancelado';
                        orderItem.querySelector('.order_status').className = 'order_status status_canceled';
                        this.remove(); // Remove o botão de cancelar
                    }
                });
            });
            
        } else {
            noOrdersMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        noOrdersMessage.style.display = 'block';
    }
}

// Função para filtrar os pedidos
function setupFilters() {
    const filterOptions = document.querySelectorAll('.filter_option');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Atualizar classes ativas
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const orderItems = document.querySelectorAll('.order_item');
            
            orderItems.forEach(item => {
                if (filter === 'all' || item.dataset.status === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Verificar se há pedidos visíveis
            const visibleOrders = document.querySelectorAll('.order_item[style="display: block"]');
            const noOrdersMessage = document.getElementById('no_orders_message');
            
            if (visibleOrders.length === 0) {
                noOrdersMessage.style.display = 'block';
                noOrdersMessage.textContent = 'Não há pedidos nesta categoria.';
            } else {
                noOrdersMessage.style.display = 'none';
            }
        });
    });
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    setupFilters();
});