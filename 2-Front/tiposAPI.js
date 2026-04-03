// tiposAPI.js
const TiposAPI = {
    async buscarTiposItem(supabaseClient, itemId) {
        if (!supabaseClient) return { success: false, error: 'Supabase client not initialized.' };
        try {
            // Busca os IDs dos tipos associados ao item
            const { data: itemTipoData, error: itemTipoError } = await supabaseClient
                .from('ItemTipo')
                .select('IdTipo')
                .eq('IdItem', itemId);

            if (itemTipoError) throw itemTipoError;

            const tipoIds = (itemTipoData || []).map(row => row.IdTipo || row.idtipo);

            if (tipoIds.length === 0) {
                return { success: true, typeNames: [] };
            }

            // Busca os nomes dos tipos usando os IDs encontrados
            const { data: tipoData, error: tipoError } = await supabaseClient
                .from('Tipo')
                .select('Name')
                .in('Id', tipoIds);

            if (tipoError) throw tipoError;

            const typeNames = (tipoData || []).map(row => row.Name || row.name);
            return { success: true, typeNames };
        } catch (error) {
            console.error('Erro ao buscar tipos para item:', itemId, error);
            return { success: false, error: error.message };
        }
    },

    async salvarTiposItem(supabaseClient, itemId, typeNames) {
        if (!supabaseClient) return { success: false, error: 'Supabase client not initialized.' };
        try {
            // 1. Buscar IDs dos tipos pelos nomes
            const { data: tipoData, error: tipoError } = await supabaseClient
                .from('Tipo')
                .select('Id, Name')
                .in('Name', typeNames);

            if (tipoError) throw tipoError;

            const typeNameToIdMap = {};
            (tipoData || []).forEach(row => {
                typeNameToIdMap[row.Name || row.name] = row.Id || row.id;
            });

            const typeIdsToSave = typeNames.map(name => typeNameToIdMap[name]).filter(id => id !== undefined);

            // 2. Excluir relacionamentos existentes para o item
            const { error: deleteError } = await supabaseClient
                .from('ItemTipo')
                .delete()
                .eq('IdItem', itemId);

            if (deleteError) throw deleteError;

            // 3. Inserir novos relacionamentos
            const inserts = typeIdsToSave.map(typeId => ({
                IdItem: itemId,
                IdTipo: typeId
            }));

            if (inserts.length > 0) {
                const { error: insertError } = await supabaseClient
                    .from('ItemTipo')
                    .insert(inserts);
                if (insertError) throw insertError;
            }
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar tipos para item:', itemId, error);
            return { success: false, error: error.message };
        }
    },

    async buscarItensComTipos(supabaseClient, itemIds) {
        if (!supabaseClient) return { success: false, error: 'Supabase client not initialized.' };
        try {
            // Busca os relacionamentos ItemTipo
            const { data: itemTipoData, error: itemTipoError } = await supabaseClient
                .from('ItemTipo')
                .select('IdItem, IdTipo')
                .in('IdItem', itemIds);

            if (itemTipoError) throw itemTipoError;

            const itemTipoMap = {};
            (itemTipoData || []).forEach(row => {
                const itemId = row.IdItem || row.iditem;
                const tipoId = row.IdTipo || row.idtipo;
                if (!itemTipoMap[itemId]) {
                    itemTipoMap[itemId] = [];
                }
                itemTipoMap[itemId].push(tipoId);
            });

            // Busca todos os tipos para mapear IDs para nomes
            const { data: allTypesData, error: allTypesError } = await supabaseClient
                .from('Tipo')
                .select('Id, Name');

            if (allTypesError) throw allTypesError;

            const typeIdToNameMap = {};
            (allTypesData || []).forEach(row => {
                typeIdToNameMap[row.Id || row.id] = row.Name || row.name;
            });

            const itemsMap = {};
            for (const itemId in itemTipoMap) {
                itemsMap[itemId] = itemTipoMap[itemId].map(tipoId => typeIdToNameMap[tipoId]).filter(name => name !== undefined);
            }

            return { success: true, itemsMap };
        } catch (error) {
            console.error('Erro ao buscar itens com tipos:', error);
            return { success: false, error: error.message };
        }
    }
};