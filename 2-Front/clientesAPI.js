// ============================================
// API para gerenciar múltiplos clientes por item
// ============================================

const ClientesAPI = {
    // Salva múltiplos clientes para um item
    async salvarClientesItem(supabaseClient, itemId, clienteIds) {
        try {
            // 1. Remove relacionamentos antigos
            await supabaseClient
                .from('ItemCliente')
                .delete()
                .eq('IdItem', itemId);

            // 2. Insere novos relacionamentos
            if (clienteIds && clienteIds.length > 0) {
                const relacionamentos = clienteIds.map(clienteId => ({
                    IdItem: itemId,
                    IdCliente: clienteId
                }));

                const { error } = await supabaseClient
                    .from('ItemCliente')
                    .insert(relacionamentos);

                if (error) throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar clientes do item:', error);
            return { success: false, error };
        }
    },

    // Busca todos os clientes de um item
    async buscarClientesItem(supabaseClient, itemId) {
        try {
            const { data, error } = await supabaseClient
                .from('ItemCliente')
                .select('IdCliente')
                .eq('IdItem', itemId);

            if (error) throw error;

            return {
                success: true,
                clienteIds: data ? data.map(row => row.IdCliente) : []
            };
        } catch (error) {
            console.error('Erro ao buscar clientes do item:', error);
            return { success: false, error, clienteIds: [] };
        }
    },

    // Busca múltiplos itens com seus clientes
    async buscarItensComClientes(supabaseClient, itemIds) {
        try {
            const { data, error } = await supabaseClient
                .from('ItemCliente')
                .select('IdItem, IdCliente')
                .in('IdItem', itemIds);

            if (error) throw error;

            // Agrupa por item
            const itemsMap = {};
            if (data) {
                data.forEach(row => {
                    if (!itemsMap[row.IdItem]) {
                        itemsMap[row.IdItem] = [];
                    }
                    itemsMap[row.IdItem].push(row.IdCliente);
                });
            }

            return { success: true, itemsMap };
        } catch (error) {
            console.error('Erro ao buscar itens com clientes:', error);
            return { success: false, error, itemsMap: {} };
        }
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.ClientesAPI = ClientesAPI;
}
