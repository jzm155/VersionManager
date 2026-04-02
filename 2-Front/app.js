// Estado da aplicação (Mock Data)
const state = {
    versions: [],
    clients: [],
    items: [],
    isAuthenticated: false,
    currentUser: null
};

// --- Configuração do Supabase ---
const SUPABASE_URL = 'https://hzabyzrzorwqzaticupq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YWJ5enJ6b3J3cXphdGljdXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTcyNzAsImV4cCI6MjA4OTE5MzI3MH0.7LKw3xHi_4Ct4OGBLd1pQqKt8wKPSiDrbrdWuY7k_RY';
let supabaseClient = null;

// Função para carregar e iniciar o Supabase
function loadSupabase() {
    if (typeof supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = initSupabase;
        document.head.appendChild(script);
    } else {
        initSupabase();
    }
}

function initSupabase() {
    // @ts-ignore
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    refreshClientsState();
    refreshVersionsState().then(() => {
        if (document.querySelector('.nav-link[data-route="versions"]').classList.contains('active')) {
            renderVersions();
        }
    });
}

async function refreshClientsState() {
    if (!supabaseClient) return;
    
    // Busca todos os clientes. Tenta 'Cliente' (Maiúsculo) primeiro, fallback para 'cliente'.
    let { data, error } = await supabaseClient.from('Cliente').select('*');

    if (error) {
        console.warn('Erro ao buscar tabela "Cliente", tentando minúsculo "cliente"...', error.message);
        const retry = await supabaseClient.from('cliente').select('*');
        if (!retry.error) {
            data = retry.data;
            error = null;
        }
    }
    
    if (error) {
        console.error('Erro ao buscar clientes do Supabase:', error);
        showModal('Erro no Banco', 'Não foi possível buscar clientes. Detalhe: ' + error.message);
        return;
    }
    
    if (!data || data.length === 0) {
        console.warn('Atenção: Lista vazia. Verifique se a tabela tem dados e se as Políticas RLS estão permitindo SELECT para "anon".');
    }

    // Atualiza o estado local para refletir o banco de dados
    // Mapeia colunas do banco (Id, Nome) para o formato interno da aplicação (id, name)
    // Usa Id ou id para garantir compatibilidade com Postgres (que padroniza minúsculo)
    state.clients = (data || []).map(row => ({
        id: row.Id || row.id || row.ID,
        name: row.Nome || row.nome || row.Name || row.name || row.NOME,
        active: true // Define como true pois a tabela não tem coluna de status
    }));
}

async function refreshVersionsState() {
    if (!supabaseClient) return;
    
    // Busca todas as versões
    let { data, error } = await supabaseClient
        .from('Versao')
        .select('*')
        .order('Id', { ascending: false });

    if (error) {
        const retry = await supabaseClient.from('versao').select('*').order('id', { ascending: false });
        if (!retry.error) {
            data = retry.data;
            error = null;
        }
    }
    
    if (error) {
        console.error('Erro ao buscar versões do Supabase:', error);
        return;
    }
    
    if (!data || data.length === 0) {
        console.warn('ALERTA: A consulta retornou 0 versões. Verifique se o RLS (Policies) está habilitado na tabela Versao.');
    }

    state.versions = (data || []).map(row => ({
        id: row.Id || row.id,
        name: row.Titulo || row.titulo,
        date: (row.DataPublicacao || row.datapublicacao || '').split('T')[0],
        status: row.Status || row.status
    }));
}

function toggleLoading(show) {
    const existingOverlay = document.getElementById('loading-overlay');
    if (show) {
        if (!existingOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(overlay);
        }
    } else {
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }
}

// Referências ao DOM
const appContainer = document.querySelector('.app-container');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const navLinks = document.querySelectorAll('.nav-link');

// --- Funções de Renderização ---

// Helper para obter nome do cliente
function getClientName(clientId) {
    // Usa '==' para garantir compatibilidade entre string (UUID) e int
    const client = state.clients.find(c => c.id == clientId);
    return client ? client.name : 'Desconhecido';
}

// Helper para obter informações do status numérico
function getStatusInfo(statusId) {
    switch(statusId) {
        case 1: return { label: 'Finalizado', className: 'status-finalizado' };
        case 2: return { label: 'Pendente', className: 'status-pendente' };
        case 3: return { label: 'Cancelado', className: 'status-cancelado' };
        default: return { label: 'Desconhecido', className: '' };
    }
}

// Helper para formatar data ISO (yyyy-mm-dd) para BR (dd/MM/yyyy)
function formatDateToBR(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Helper de Modal Customizado (Substitui alert/confirm)
function showModal(title, message, onConfirm = null, type = 'alert') {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    let buttonsHtml = '';
    if (type === 'confirm') {
        buttonsHtml = `
            <button class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
            <button class="btn-primary" id="btn-modal-confirm">Confirmar</button>
        `;
    } else {
        buttonsHtml = `
            <button class="btn-primary" id="btn-modal-ok">OK</button>
        `;
    }

    overlay.innerHTML = `
        <div class="modal-content" style="max-width: 400px; padding: 25px; text-align: center;">
            <h2 style="font-size: 1.3rem; margin-top: 0; margin-bottom: 15px; color: #2c3e50;">${title}</h2>
            <p style="margin-bottom: 25px; color: #555; line-height: 1.5;">${message}</p>
            <div style="display: flex; justify-content: center; gap: 10px;">
                ${buttonsHtml}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    
    const close = () => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    };

    if (type === 'confirm') {
        document.getElementById('btn-modal-cancel').onclick = close;
        document.getElementById('btn-modal-confirm').onclick = () => { close(); if (onConfirm) onConfirm(); };
    } else {
        document.getElementById('btn-modal-ok').onclick = () => { close(); if (onConfirm) onConfirm(); };
    }
}

// Função para verificar sessão persistente no localStorage
function checkSession() {
    const storedUser = localStorage.getItem('version_reporter_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.id && user.name) {
                state.isAuthenticated = true;
                state.currentUser = user;
                return true; // Sessão válida encontrada
            }
        } catch (e) {
            console.error("Erro ao analisar dados do usuário armazenados, limpando sessão.", e);
            localStorage.removeItem('version_reporter_user');
        }
    }
    return false; // Nenhuma sessão válida
}

// Função para atualizar o cabeçalho com o Usuário Logado
function updateUserDisplay() {
    const header = document.querySelector('.header');
    if (!header) return;

    let userDisplay = document.getElementById('header-user-info');
    if (!userDisplay) {
        userDisplay = document.createElement('div');
        userDisplay.id = 'header-user-info';
        userDisplay.style.marginLeft = 'auto'; // Força alinhamento à direita no flexbox
        userDisplay.style.display = 'flex';
        userDisplay.style.alignItems = 'center';
        userDisplay.style.gap = '15px';
        header.appendChild(userDisplay);
    }

    if (state.currentUser) {
        userDisplay.innerHTML = `
            <span style="font-weight: 600; color: #2c3e50;">👤 ${state.currentUser.name}</span>
            <button id="btn-logout" class="btn-secondary btn-sm" style="font-size: 0.8rem;">Sair</button>
        `;
        document.getElementById('btn-logout').onclick = () => {
            localStorage.removeItem('version_reporter_user');
            window.location.reload();
        };
    }
}

// Etapa 2: Renderizar Tela de Versões
async function renderVersions() {
    pageTitle.textContent = 'Versões';
    
    toggleLoading(true);
    try {
        if (supabaseClient) await refreshVersionsState();
    } finally {
        toggleLoading(false);
    }
    
    // Container do cabeçalho da página (Título + Botão)
    const headerContainer = document.createElement('div');
    headerContainer.className = 'header-container';
    
    headerContainer.innerHTML = `
        <h1>📋 Lista de Versões</h1>
        <button class="btn-primary" id="btn-add-version">Adicionar Versão</button>
    `;

    // Grid de versões
    const grid = document.createElement('div');
    grid.className = 'versions-grid';

    state.versions.forEach(version => {
        const card = document.createElement('div');
        card.className = 'version-card';
        // Evento de clique para ir para detalhes
        card.onclick = () => renderVersionDetail(version.id);
        
        const statusInfo = getStatusInfo(version.status);

        card.innerHTML = `
            <h3>${version.name}</h3>
            <span style="display:block; margin-bottom: 10px;">Lançamento: ${formatDateToBR(version.date)}</span>
            <span class="status-badge ${statusInfo.className}">${statusInfo.label}</span>
        `;
        grid.appendChild(card);
    });

    // Limpa e popula a área de conteúdo
    contentArea.innerHTML = '';
    contentArea.appendChild(headerContainer);
    contentArea.appendChild(grid);

    // Ação do botão
    document.getElementById('btn-add-version').onclick = () => navigateTo('version-form');

}

// Etapa 3: Detalhes da Versão
async function renderVersionDetail(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    if (!version) return;

    toggleLoading(true);
    try {
        if (supabaseClient) {
            // Busca itens vinculados a esta versão
            let { data, error } = await supabaseClient.from('Item').select('*').eq('IdVersao', versionId);
            
            if (error) {
                console.warn('Fallback: tentando buscar itens com tabela minúscula');
                const retry = await supabaseClient.from('item').select('*').eq('IdVersao', versionId);
                if (!retry.error) data = retry.data;
            }

            if (data) {
                const mappedItems = data.map(mapDatabaseItemToLocal);
                // Atualiza o estado local: remove itens antigos desta versão e insere os atualizados
                state.items = state.items.filter(i => i.versionId !== versionId).concat(mappedItems);
            }
            // Garante que nomes de clientes estejam disponíveis
            if (state.clients.length === 0) await refreshClientsState();
        }
    } finally {
        toggleLoading(false);
    }

    // Filtrar itens desta versão
    const versionItems = state.items.filter(i => i.versionId === versionId);

    pageTitle.textContent = `Detalhes: ${version.name}`;

    const container = document.createElement('div');
    
    // Cabeçalho dos detalhes com botão voltar
    const statusInfo = getStatusInfo(version.status);
    const isPending = version.status === 2;
    const canReport = version.status !== 3;
    // Permite editar nome da versão mesmo que finalizada, mas outras ações apenas se pendente
    const disabledAttr = !isPending ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const editDisabledAttr = ''; // Sempre permite editar nome

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-secondary" id="btn-back" style="margin-right: 10px;">&larr; Voltar</button>
                <span style="font-size: 1.2rem; font-weight: bold;">${version.name}</span>
                <span style="color: #666; margin-left: 10px;">${version.date}</span>
                <button class="btn-primary btn-sm" id="btn-edit-version-modal" title="Editar Nome da Versão" ${editDisabledAttr}>✏️ Editar Nome</button>
                <span class="status-badge ${statusInfo.className}" style="margin-top:0;">${statusInfo.label}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-primary" id="btn-report-version" style="background-color: #8e44ad; ${!canReport ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${!canReport ? 'disabled' : ''}>Gerar Relato</button>
                <button class="btn-primary" id="btn-link-existing-item" ${disabledAttr}>Vincular Item</button>
                <button class="btn-primary" id="btn-create-new-item" ${disabledAttr} style="background-color: #16a085;">Criar Novo Item</button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Ticket</th>
                        <th>Nome</th>
                        <th style="min-width: 110px;">Data</th>
                        <th>Migration</th>
                        <th>Cliente</th>
                        <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${versionItems.map(item => `
                        <tr>
                            <td><a href="${item.url.startsWith('http') ? item.url : 'https://' + item.url}" target="_blank">${item.ticket || 'Link'}</a></td>
                            <td>${item.name}</td>
                            <td>${formatDateToBR(item.date)}</td>
                            <td>${item.migration ? 'Sim' : 'Não'}</td>
                            <td>${getClientName(item.clientId)}</td>
                            <td style="text-align: right;">
                                <button class="btn-primary btn-sm btn-edit-item" data-id="${item.id}" ${disabledAttr}>Editar</button>
                                <button class="btn-secondary btn-sm btn-del-item" data-id="${item.id}" style="background-color: #e74c3c;" ${disabledAttr}>Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${versionItems.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Nenhum item vinculado.</td></tr>' : ''}
                </tbody>
            </table>
        </div>

        <!-- Footer Actions -->
        <div class="detail-footer-actions">
            <button class="btn-primary btn-success" id="btn-finalize-version" ${disabledAttr}>Finalizar Versão</button>
            <button class="btn-primary btn-danger" id="btn-cancel-version" ${disabledAttr}>Cancelar Versão</button>
        </div>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(container);

    // Ação do botão voltar
    document.getElementById('btn-back').onclick = () => navigateTo('versions');
    
    // Ação do botão Adicionar Item
    document.getElementById('btn-create-new-item').onclick = () => {
        openItemModal(null, version.id, () => renderVersionDetail(version.id));
    };
    document.getElementById('btn-link-existing-item').onclick = () => {
        openLinkExistingItemsModal(version.id, () => renderVersionDetail(version.id));
    };

    // Ação Gerar Relato
    document.getElementById('btn-report-version').onclick = () => renderReportView(version.id);
    
    // Ação Editar Versão (Abrir Modal)
    document.getElementById('btn-edit-version-modal').onclick = (e) => {
        e.stopPropagation();
        openEditVersionModal(version);
    };

    // Ações de Rodapé (Status)
    document.getElementById('btn-finalize-version').onclick = () => {
        if (!version.date) {
            showModal('Atenção', 'A data de lançamento é obrigatória para finalizar a versão.');
            return;
        }
        if (versionItems.length === 0) {
            showModal('Atenção', 'É necessário ter pelo menos 1 item na versão para finalizá-la.');
            return;
        }
        updateVersionStatus(version.id, 1);
    };
    document.getElementById('btn-cancel-version').onclick = () => updateVersionStatus(version.id, 3);
    
    setupItemActions(); // Configura eventos de editar/excluir itens
}

// Função auxiliar para atualizar status
function updateVersionStatus(versionId, newStatus) {
    const version = state.versions.find(v => v.id === versionId);
    if (version) {
        const statusInfo = getStatusInfo(newStatus);
        showModal('Alterar Status', `Deseja alterar o status para ${statusInfo.label}?`, async () => {
            toggleLoading(true);
            try {
                if (supabaseClient) {
                    const { error } = await supabaseClient
                        .from('Versao')
                        .update({ Status: newStatus })
                        .eq('Id', versionId);
                    if (error) throw error;
                }
                // Atualiza estado local e re-renderiza
                version.status = newStatus;
                renderVersionDetail(versionId); 
            } catch (err) {
                console.error(err);
                showModal('Erro', 'Falha ao atualizar status da versão.');
            } finally {
                toggleLoading(false);
            }
        }, 'confirm');
    }
}

// Função para abrir o Modal de Edição
function openEditVersionModal(version) {
    // Cria o overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Verifica se versão está finalizada para limitar edição
    const isFinalized = version.status === 1;
    
    // Estrutura do Modal (reusando classes de form-card)
    overlay.innerHTML = `
        <div class="modal-content">
            <form id="modal-edit-form" class="form-card" style="margin: 0; max-width: 100%; box-shadow: none;">
                <h2>${isFinalized ? 'Editar Nome da Versão' : 'Editar Versão'}</h2>
                <div class="form-group">
                    <label for="modal-version-name">Número da Versão</label>
                    <input type="text" id="modal-version-name" value="${version.name}" required>
                </div>
                ${!isFinalized ? `
                <div class="form-group">
                    <label for="modal-version-date">Data de Lançamento</label>
                    <input type="date" id="modal-version-date" value="${version.date}">
                </div>
                ` : `
                <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #27ae60;">
                    <small style="color: #666;">⚠️ Versão finalizada. Apenas o nome pode ser editado.</small>
                </div>
                `}
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Alterações</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    // Eventos do Modal
    const close = () => document.body.removeChild(overlay);
    
    document.getElementById('btn-modal-cancel').onclick = close;
    
    document.getElementById('modal-edit-form').onsubmit = async (e) => {
        e.preventDefault();
        const novoNome = document.getElementById('modal-version-name').value;
        const novaData = document.getElementById('modal-version-date')?.value;
        const isFinalized = version.status === 1;

        toggleLoading(true);
        try {
            if (supabaseClient) {
                // Se finalizada, atualiza apenas o nome
                const updateData = isFinalized ? { Titulo: novoNome } : { Titulo: novoNome, DataPublicacao: novaData };
                const { error } = await supabaseClient
                    .from('Versao')
                    .update(updateData)
                    .eq('Id', version.id);
                if (error) throw error;
            }
            version.name = novoNome;
            if (!isFinalized && novaData) {
                version.date = novaData;
            }
            close();
            renderVersionDetail(version.id); 
        } catch (err) {
            showModal('Erro', 'Erro ao atualizar versão: ' + err.message);
        } finally {
            toggleLoading(false);
        }
    };
}

// Função para abrir o Modal de Item (Criar/Editar)
function openItemModal(item = null, versionId = null, onSuccess = null) {
    const isEdit = item !== null;
    
    // Gera opções de clientes
    const clientOptions = state.clients
        .filter(c => c.active)
        .map(c => `<option value="${c.id}" ${item && item.clientId === c.id ? 'selected' : ''}>${c.name}</option>`)
        .join('');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <form id="modal-item-form" class="form-card" style="margin: 0; max-width: 100%; box-shadow: none;">
                <h2>${isEdit ? 'Editar Item' : 'Novo Item'}</h2>
                <div class="form-group">
                    <label for="modal-item-ticket">Número do Ticket</label>
                    <input type="text" id="modal-item-ticket" value="${item ? (item.ticket || '') : ''}">
                </div>
                <div class="form-group">
                    <label for="modal-item-name">Descrição</label>
                    <input type="text" id="modal-item-name" value="${item ? item.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="modal-item-date">Data</label>
                    <input type="date" id="modal-item-date" value="${item ? item.date : ''}" required>
                </div>
                <div class="form-group">
                    <label for="modal-item-url">URL</label>
                    <input type="text" id="modal-item-url" value="${item ? item.url : ''}">
                </div>
                <div class="form-group">
                    <label for="modal-item-client">Cliente</label>
                    <select id="modal-item-client" required>
                        ${clientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="modal-item-migration" ${item && item.migration ? 'checked' : ''}>
                        Requer migração de banco de dados?
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="btn-modal-item-cancel">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => document.body.removeChild(overlay);
    document.getElementById('btn-modal-item-cancel').onclick = close;

    document.getElementById('modal-item-form').onsubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            Numero: document.getElementById('modal-item-ticket').value,
            Descricao: document.getElementById('modal-item-name').value,
            Data: document.getElementById('modal-item-date').value,
            Url: document.getElementById('modal-item-url').value,
            Migration: document.getElementById('modal-item-migration').checked,
            IdCliente: parseInt(document.getElementById('modal-item-client').value),
            IdVersao: versionId // VINCULA AUTOMATICAMENTE SE FOR PASSADO
        };
        
        toggleLoading(true);
        try {
            if (supabaseClient) {
                const { data, error } = await supabaseClient.from('Item').insert(payload).select();
                if (error) throw error;
                
                // Adiciona ao estado local para aparecer na lista imediatamente
                if (data && data.length > 0) {
                    state.items.push(mapDatabaseItemToLocal(data[0]));
                }
            } else {
                // Fallback Mock
                const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
                state.items.push({
                    id: newId,
                    ticket: payload.Numero,
                    name: payload.Descricao,
                    date: payload.Data,
                    url: payload.Url,
                    migration: payload.Migration,
                    clientId: payload.IdCliente,
                    versionId: payload.IdVersao
                });
            }
            close();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            showModal('Erro', 'Erro ao criar item: ' + err.message);
        } finally {
            toggleLoading(false);
        }
    };
}

// Função para abrir o Modal de Vínculo de Itens
function openLinkExistingItemsModal(versionId, onSuccess) {
    const pendingItems = state.items.filter(i => !i.versionId);

    if (pendingItems.length === 0) {
        showModal('Vincular Itens', 'Não há itens pendentes para vincular.');
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const itemsHtml = pendingItems.map(item => `
        <label class="checkbox-label" style="padding: 8px; border-radius: 4px; transition: background-color 0.2s; cursor: pointer; display: block; border-bottom: 1px solid #f0f0f0;">
            <input type="checkbox" class="item-to-link" value="${item.id}" style="margin-right: 15px;">
            <span><strong>${item.ticket || 'S/N'}:</strong> ${item.name} <em style="color: #7f8c8d;">(${getClientName(item.clientId)})</em></span>
        </label>
    `).join('');

    overlay.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="form-card" style="margin: 0; max-width: 100%; box-shadow: none;">
                <h2>Vincular Itens Existentes</h2>
                <p style="margin-bottom: 20px;">Selecione os itens pendentes que deseja adicionar a esta versão.</p>
                <div style="max-height: 40vh; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                    ${itemsHtml}
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="btn-modal-link-cancel">Cancelar</button>
                    <button type="button" class="btn-primary" id="btn-modal-link-confirm">Vincular Selecionados</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => document.body.removeChild(overlay);
    document.getElementById('btn-modal-link-cancel').onclick = close;

    document.getElementById('btn-modal-link-confirm').onclick = async () => {
        const selectedIds = Array.from(document.querySelectorAll('.item-to-link:checked'))
                                 .map(checkbox => parseInt(checkbox.value));

        if (selectedIds.length === 0) return showModal('Aviso', 'Selecione pelo menos um item.');

        toggleLoading(true);
        try {
            if (supabaseClient) {
                const { error } = await supabaseClient.from('Item').update({ IdVersao: versionId }).in('Id', selectedIds);
                if (error) throw error;
            }
            // Atualiza estado local
            selectedIds.forEach(id => {
                const item = state.items.find(i => i.id === id);
                if (item) item.versionId = versionId;
            });
            close();
            if (onSuccess) onSuccess();
        } catch (err) {
            showModal('Erro', 'Erro ao vincular itens: ' + err.message);
        } finally {
            toggleLoading(false);
        }
    };
}

// Renderizar Tela de Login
function renderLogin() {
    // Esconde a aplicação principal se ela existir
    if (appContainer) appContainer.style.display = 'none';

    const loginHtml = `
        <div class="login-container" id="login-screen">
            <form id="login-form" class="form-card login-card" style="margin: 0;">
                <h2 style="text-align: center; margin-bottom: 20px;">Version Reporter</h2>
                <div class="form-group">
                    <label for="login-user">Usuário</label>
                    <input type="text" id="login-user" placeholder="admin" required>
                </div>
                <div class="form-group">
                    <label for="login-pass">Senha</label>
                    <input type="password" id="login-pass" placeholder="admin" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">Entrar</button>
            </form>
        </div>
    `;

    // Adiciona ao body
    document.body.insertAdjacentHTML('beforeend', loginHtml);

    document.getElementById('login-form').onsubmit = async (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value;
        const pass = document.getElementById('login-pass').value;

        // Lógica de Login com Supabase
        if (supabaseClient) {
            try {
                // Tenta autenticar na tabela 'Usuario' com campos Username/Password
                let { data, error } = await supabaseClient
                    .from('Usuario')
                    .select('*')
                    .eq('Username', user)
                    .eq('Password', pass);

                // Se falhar, tenta fallback para minúsculo (caso o banco tenha normalizado)
                if (error || !data || data.length === 0) {
                    const retry = await supabaseClient
                        .from('usuario')
                        .select('*')
                        .eq('username', user)
                        .eq('password', pass);
                    
                    if (!retry.error && retry.data && retry.data.length > 0) {
                        data = retry.data;
                        error = null;
                    }
                }

                if (data && data.length > 0) {
                    // Login Sucesso
                    state.isAuthenticated = true;
                    
                    const user = data[0];
                    state.currentUser = {
                        id: user.Id || user.id,
                        name: user.Name || user.name // Captura a propriedade Name
                    };
                    localStorage.setItem('version_reporter_user', JSON.stringify(state.currentUser));
                    updateUserDisplay();

                    document.getElementById('login-screen').remove();
                    if (appContainer) appContainer.style.display = 'flex';
                    navigateTo('versions');
                    return;
                }
            } catch (err) {
                console.error('Erro ao tentar login no banco:', err);
            }
        }

        showModal('Acesso Negado', 'Usuário ou senha incorretos.');
    };
}

// Nova funcionalidade: Gerar Relato
function renderReportView(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    const versionItems = state.items.filter(i => i.versionId === versionId);
    
    pageTitle.textContent = `Relato: ${version.name}`;
    
    // Formato solicitado: **{Numero}** Versao - Lancamento {{Data}}
    const header = `**${version.name}** Versao - Lancamento ${version.date}  @everyone`;
    
    // Agrupa itens por cliente
    const itemsByClient = {};
    versionItems.forEach(item => {
        let clientName = 'Outros';
        if (item.clientId) {
            const name = getClientName(item.clientId);
            if (name && name !== 'Desconhecido') {
                clientName = name;
            }
        }
        if (!itemsByClient[clientName]) itemsByClient[clientName] = [];
        itemsByClient[clientName].push(item);
    });

    let itemsList = '';
    const sortedClients = Object.keys(itemsByClient).sort((a, b) => {
        if (a === 'Outros') return 1;
        if (b === 'Outros') return -1;
        return a.localeCompare(b);
    });

    sortedClients.forEach(client => {
        itemsList += `**${client}**\n` + itemsByClient[client].map(item => `- ${item.name}${item.migration ? ' (migrations)' : ''}`).join('\n') + '\n\n';
    });

    const fullText = `${header}\n\n${itemsList.trim()}`;

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="header-container">
            <button class="btn-secondary" id="btn-back-report">&larr; Voltar para Detalhes</button>
        </div>
        <div class="form-card" style="max-width: 800px; margin-top: 20px;">
            <h2>Pré-visualização do Relato</h2>
            <div class="form-group">
                <label for="report-text">Texto Formatado (Markdown)</label>
                <textarea id="report-text" style="width: 100%; height: 300px; padding: 15px; font-family: monospace; border: 1px solid #ced4da; border-radius: 5px;">${fullText}</textarea>
            </div>
            <div class="form-actions">
                <button class="btn-primary" id="btn-copy-report">Copiar Texto</button>
            </div>
        </div>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(container);

    document.getElementById('btn-back-report').onclick = () => renderVersionDetail(versionId);
    document.getElementById('btn-copy-report').onclick = () => {
        const textarea = document.getElementById('report-text');
        textarea.select();
        navigator.clipboard.writeText(textarea.value)
            .then(() => showModal('Sucesso', 'Relato copiado para a área de transferência!'))
            .catch(() => showModal('Erro', 'Erro ao copiar. Por favor, tente manualmente.'));
    };
}

// Renderizar Itens Pendentes (Placeholder)
async function renderPending() {
    pageTitle.textContent = '📝 Itens Pendentes';
    
    toggleLoading(true);
    try {
        if (supabaseClient) {
            // Busca apenas itens onde VersaoId é nulo (Pendente)
            let { data, error } = await supabaseClient
                .from('Item')
                .select('*')
                .is('IdVersao', null)
                .order('Id', { ascending: false });

            if (error) {
                console.error('Erro ao buscar itens pendentes:', error);
                // Tenta fallback minúsculo
                const retry = await supabaseClient.from('item').select('*').is('IdVersao', null);
                if (!retry.error) data = retry.data;
            }

            // Atualiza estado local com os itens pendentes do banco
            if (data) {
                const mappedItems = data.map(mapDatabaseItemToLocal);
                // Substitui itens pendentes no state
                state.items = state.items.filter(i => i.versionId).concat(mappedItems);
            }
            
            // Garante que clientes estejam carregados para exibir os nomes
            if (state.clients.length === 0) await refreshClientsState();
        }
    } finally {
        toggleLoading(false);
    }
    
    // Filtrar itens sem versão (null ou undefined) do estado atualizado
    const pendingItems = state.items.filter(i => !i.versionId);

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="header-container">
            <h1>Lista de Pendências</h1>
            <button class="btn-primary" id="btn-add-item">Adicionar Item</button>
        </div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Ticket</th>
                        <th>Descrição</th>
                        <th style="min-width: 110px;">Data</th>
                        <th>Cliente</th>
                        <th>Migration</th>
                        <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${pendingItems.map(item => `
                        <tr>
                            <td><a href="${item.url.startsWith('http') ? item.url : 'https://' + item.url}" target="_blank">${item.ticket || 'Link'}</a></td>
                            <td>${item.name}</td>
                            <td>${formatDateToBR(item.date)}</td>
                            <td>${getClientName(item.clientId)}</td>
                            <td>${item.migration ? 'Sim' : 'Não'}</td>
                            <td style="text-align: right;">
                                <button class="btn-primary btn-sm btn-edit-item" data-id="${item.id}">Editar</button>
                                <button class="btn-secondary btn-sm btn-del-item" data-id="${item.id}" style="background-color: #e74c3c;">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${pendingItems.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Nenhum item pendente.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    
    contentArea.innerHTML = '';
    contentArea.appendChild(container);
    // Ação do botão
    document.getElementById('btn-add-item').onclick = () => navigateTo('item-form');
    
    setupItemActions();
}

// Helper para configurar botões de ação de itens (usado em Detalhes e Pendentes)
function setupItemActions() {
    document.querySelectorAll('.btn-edit-item').forEach(btn => {
        btn.onclick = (e) => navigateTo('item-form', e.target.dataset.id); // Remove parseInt para suportar UUID se necessário
    });

    document.querySelectorAll('.btn-del-item').forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.dataset.id; // Mantém como string inicialmente
            showModal('Excluir Item', 'Tem certeza que deseja excluir este item?', () => {
                (async () => {
                    if (supabaseClient) {
                        const { error } = await supabaseClient.from('Item').delete().eq('Id', id);
                        if (error) {
                            console.warn('Erro ao deletar (tentando minúsculo)', error);
                            await supabaseClient.from('item').delete().eq('id', id);
                        }
                    }
                    // Atualiza estado local
                    state.items = state.items.filter(i => i.id != id);
                    // Recarrega a view atual
                    pageTitle.textContent.includes('Pendentes') ? renderPending() : renderVersions(); 
                })();
            }, 'confirm');
        };
    });
}

// Renderizar Clientes (Placeholder)
async function renderClients() {
    pageTitle.textContent = 'Clientes';

    toggleLoading(true);
    try {
        if (supabaseClient) {
            await refreshClientsState();
        }
    } finally {
        toggleLoading(false);
    }

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="header-container">
            <h1>👥 Gerenciamento de Clientes</h1>
            <button class="btn-primary" id="btn-add-client">Adicionar Cliente</button>
        </div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Status</th>
                    <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.clients.map(client => `
                        <tr>
                            <td>${client.id}</td>
                            <td>${client.name}</td>
                            <td>${client.active ? 'Ativo' : 'Inativo'}</td>
                            <td style="text-align: right;">
                                <button class="btn-primary btn-sm btn-edit-client" data-id="${client.id}">Editar</button>
                                <button class="btn-secondary btn-sm btn-del-client" data-id="${client.id}" style="background-color: #e74c3c;">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(container);

    document.getElementById('btn-add-client').onclick = () => navigateTo('client-form');

    // Ações Clientes
    document.querySelectorAll('.btn-edit-client').forEach(btn => btn.onclick = (e) => {
        const idStr = e.target.dataset.id;
        // Busca o cliente para garantir que passamos o ID no formato correto (pode ser UUID string)
        const client = state.clients.find(c => c.id == idStr);
        navigateTo('client-form', client ? client.id : idStr);
    });

    document.querySelectorAll('.btn-del-client').forEach(btn => {
        btn.onclick = (e) => {
            const idStr = e.target.dataset.id;
            const client = state.clients.find(c => c.id == idStr);
            const id = client ? client.id : idStr;

            showModal('Excluir Cliente', 'Excluir este cliente?', async () => {
                if (supabaseClient) {
                    const { error } = await supabaseClient.from('Cliente').delete().eq('Id', id);
                    if (error) {
                        showModal('Erro', 'Erro ao excluir do banco: ' + error.message);
                        return;
                    }
                    await refreshClientsState();
                } else {
                    // Fallback para mock
                    state.clients = state.clients.filter(c => c.id != id);
                }
                renderClients();
            }, 'confirm');
        };
    });
}

// Etapa 5: Formulário de Cliente (Cadastro/Edição)
function renderClientForm(id = null) {
    const isEdit = id !== null;
    const client = isEdit ? state.clients.find(c => c.id == id) : null;

    pageTitle.textContent = isEdit ? 'Editar Cliente' : 'Novo Cliente';

    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form id="client-form" class="form-card">
            <h2>${isEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h2>
            <div class="form-group">
                <label for="client-name">Nome do Cliente</label>
                <input type="text" id="client-name" name="clientName" value="${client ? client.name : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" id="btn-cancel">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(formContainer);

    document.getElementById('btn-cancel').onclick = () => navigateTo('clients');
    document.getElementById('client-form').onsubmit = async (e) => {
        e.preventDefault();
        const clientName = e.target.clientName.value;
        
        if (supabaseClient) {
            try {
                if (isEdit) {
                    // Update no Supabase
                    const { error } = await supabaseClient
                        .from('Cliente')
                        .update({ Nome: clientName })
                        .eq('Id', id);
                    if (error) throw error;
                } else {
                    // Insert no Supabase
                    const { error } = await supabaseClient
                        .from('Cliente')
                        .insert([{ Nome: clientName }]);
                    if (error) throw error;
                }
                await refreshClientsState();
                navigateTo('clients');
            } catch (err) {
                showModal('Erro', 'Erro ao salvar no banco: ' + err.message);
            }
        } else {
            // Fallback para Mock
            if (isEdit) {
                client.name = clientName;
            } else {
                const newId = Math.max(...state.clients.map(c => c.id), 0) + 1;
                state.clients.push({ id: newId, name: clientName, active: true });
            }
            navigateTo('clients');
        }
    };
}

// Etapa 6: Formulário de Versão (Cadastro/Edição)
function renderVersionForm(id = null) {
    const isEdit = id !== null;
    const version = isEdit ? state.versions.find(v => v.id == id) : null;

    pageTitle.textContent = isEdit ? 'Editar Versão' : 'Nova Versão';

    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form id="version-form" class="form-card">
            <h2>${isEdit ? 'Editar Versão' : 'Cadastrar Nova Versão'}</h2>
            <div class="form-group">
                <label for="version-name">Número da Versão (ex: v2.3.0)</label>
                <input type="text" id="version-name" name="versionName" value="${version ? version.name : ''}" required>
            </div>
            <div class="form-group">
                <label for="version-date">Data de Lançamento</label>
                <input type="date" id="version-date" name="versionDate" value="${version ? version.date : ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" id="btn-cancel-version">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;
    contentArea.innerHTML = '';
    contentArea.appendChild(formContainer);

    document.getElementById('btn-cancel-version').onclick = () => navigateTo('versions');
    document.getElementById('version-form').onsubmit = async (e) => {
        e.preventDefault();
        const name = e.target.versionName.value;
        const date = e.target.versionDate.value;

        toggleLoading(true);
        try {
            if (supabaseClient) {
                let error = null;
                if (isEdit) {
                    const res = await supabaseClient.from('Versao').update({ Titulo: name, DataPublicacao: date }).eq('Id', id);
                    error = res.error;
                } else {
                    const res = await supabaseClient.from('Versao').insert({ Titulo: name, DataPublicacao: date, Status: 2 });
                    error = res.error;
                }
                if (error) throw error;
                await refreshVersionsState(); // Recarrega a lista para obter IDs gerados
            } else {
                // Fallback Mock
                if (isEdit) { version.name = name; version.date = date; }
                else { const newId = Math.max(...state.versions.map(v => v.id), 0) + 1; state.versions.unshift({ id: newId, name: name, date: date, status: 2 }); }
            }
            navigateTo('versions');
        } catch (err) {
            showModal('Erro', 'Erro ao salvar versão: ' + err.message);
        } finally {
            toggleLoading(false);
        }
    };
}

// Etapa 7: Formulário de Item (Cadastro/Edição)
function renderItemForm(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? state.items.find(i => i.id == id) : null;

    pageTitle.textContent = isEdit ? 'Editar Item' : 'Novo Item';

    const clientOptions = state.clients
        .filter(c => c.active)
        .map(c => `<option value="${c.id}" ${item && item.clientId == c.id ? 'selected' : ''}>${c.name}</option>`)
        .join('');

    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form id="item-form" class="form-card">
            <h2>${isEdit ? 'Editar Item' : 'Cadastrar Novo Item'}</h2>
            <div class="form-group">
                <label for="item-ticket">Número do Ticket</label>
                <input type="text" id="item-ticket" name="itemTicket" value="${item ? (item.ticket || '') : ''}">
            </div>
            <div class="form-group">
                <label for="item-name">Descrição</label>
                <input type="text" id="item-name" name="itemName" value="${item ? item.name : ''}" required>
            </div>
            <div class="form-group">
                <label for="item-date">Data</label>
                <input type="date" id="item-date" name="itemDate" value="${item ? item.date : ''}" required>
            </div>
            <div class="form-group">
                <label for="item-url">URL (Jira, Git, etc)</label>
                <input type="text" id="item-url" name="itemUrl" value="${item ? item.url : ''}">
            </div>
            <div class="form-group">
                <label for="item-client">Cliente</label>
                <select id="item-client" name="itemClient" required>
                    ${clientOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="item-migration" name="itemMigration" ${item && item.migration ? 'checked' : ''}>
                    Requer migração de banco de dados?
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" id="btn-cancel">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(formContainer);

    document.getElementById('btn-cancel').onclick = () => navigateTo('pending');
    document.getElementById('item-form').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const payload = {
            Numero: form.itemTicket.value,
            Descricao: form.itemName.value,
            Data: form.itemDate.value,
            Url: form.itemUrl.value,
            Migration: form.itemMigration.checked,
            IdCliente: form.itemClient.value ? parseInt(form.itemClient.value) : null
        };

        if (supabaseClient) {
            let error = null;
            
            if (isEdit) {
                const res = await supabaseClient.from('Item').update(payload).eq('Id', id);
                error = res.error;
            } else {
                // Novo item (VersaoId padrão null no banco ou omitido)
                payload.IdVersao = null;
                const res = await supabaseClient.from('Item').insert([payload]);
                error = res.error;
            }

            if (error) {
                showModal('Erro', 'Erro ao salvar item: ' + error.message);
                return;
            }
        } else {
            // Fallback Mock
            if (isEdit) {
                item.ticket = payload.Numero;
                item.name = payload.Descricao;
                item.date = payload.Data;
                item.url = payload.Url;
                item.migration = payload.Migration;
                item.clientId = payload.IdCliente;
            } else {
                const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
                state.items.push({
                    id: newId,
                    ticket: payload.Numero,
                    name: payload.Descricao,
                    date: payload.Data,
                    url: payload.Url,
                    migration: payload.Migration,
                    clientId: payload.IdCliente,
                    versionId: null
                });
            }
        }
        navigateTo('pending');
    };
}

// --- Sistema de Roteamento Simples ---

function navigateTo(route, param = null) {
    // Atualiza classes ativas na sidebar
    navLinks.forEach(link => {
        if (link.dataset.route === route) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Renderiza a view correta
    switch(route) {
        case 'versions':
            renderVersions();
            break;
        case 'pending':
            renderPending();
            break;
        case 'clients':
            renderClients();
            break;
        case 'client-form':
            renderClientForm(param);
            break;
        case 'version-form':
            renderVersionForm(param);
            break;
        case 'item-form':
            renderItemForm(param);
            break;
        default:
            renderVersions();
    }
}

// Inicialização
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(e.target.dataset.route);
    });
});

function initializeApp() {
    loadSupabase(); // Inicia o Supabase

    if (checkSession()) {
        // Usuário já está logado, vai para a app
        if (appContainer) appContainer.style.display = 'flex';
        updateUserDisplay();
        navigateTo('versions');
    } else {
        // Usuário não está logado, mostra tela de login
        renderLogin();
    }
}

// Inicia a aplicação
initializeApp();

// --- Configuração de Responsividade (Menu Mobile) ---
function setupMobileResponsiveness() {
    const header = document.querySelector('.header');
    const sidebar = document.querySelector('.sidebar');
    
    // Se não encontrar os elementos estruturais básicos, encerra
    if (!header || !sidebar) return;

    // 1. Criar o botão de menu (Hambúrguer)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '&#9776;'; // Ícone de 3 linhas (Hambúrguer)
    menuBtn.setAttribute('aria-label', 'Abrir Menu');

    // Inserir antes do conteúdo atual do header
    header.insertBefore(menuBtn, header.firstChild);

    // 2. Criar o Overlay (fundo escuro)
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // 3. Função de Alternância
    function toggleMenu() {
        if (window.innerWidth <= 768) {
            // Mobile: Usa classe active e overlay
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        } else {
            // Desktop: Usa classe collapsed para reduzir largura
            sidebar.classList.toggle('collapsed');
        }
    }

    // Event Listeners
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link da sidebar (UX melhor no mobile)
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Apenas se estiver em modo mobile (sidebar tem classe active)
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
}

// Inicializa a responsividade após o carregamento do DOM
document.addEventListener('DOMContentLoaded', setupMobileResponsiveness);

// Helper para mapear objeto do Banco para Objeto Local
function mapDatabaseItemToLocal(row) {
    return {
        id: row.Id || row.id,
        ticket: row.Numero || row.numero || '',
        name: row.Descricao || row.descricao || row.Nome || row.nome || '',
        date: (row.Data || row.data || '').split('T')[0],
        url: row.Url || row.url || '',
        migration: row.Migration || row.migration,
        clientId: row.IdCliente || row.clienteid,
        versionId: row.IdVersao || row.versaoid
    };
}
