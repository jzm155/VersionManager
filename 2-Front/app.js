// Estado da aplicação (Mock Data)
const state = {
    versions: [],
    clients: [],
    items: []
};

// Referências ao DOM
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const navLinks = document.querySelectorAll('.nav-link');

// --- Funções de Renderização ---

// Helper para obter nome do cliente
function getClientName(clientId) {
    const client = state.clients.find(c => c.id === clientId);
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

// Etapa 2: Renderizar Tela de Versões
function renderVersions() {
    pageTitle.textContent = 'Versões';
    
    // Container do cabeçalho da página (Título + Botão)
    const headerContainer = document.createElement('div');
    headerContainer.className = 'header-container';
    
    headerContainer.innerHTML = `
        <h1>Lista de Versões</h1>
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
            <span style="display:block; margin-bottom: 10px;">Lançamento: ${version.date}</span>
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
function renderVersionDetail(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    if (!version) return;

    // Filtrar itens desta versão
    const versionItems = state.items.filter(i => i.versionId === versionId);

    pageTitle.textContent = `Detalhes: ${version.name}`;

    const container = document.createElement('div');
    
    // Cabeçalho dos detalhes com botão voltar
    const statusInfo = getStatusInfo(version.status);
    const isPending = version.status === 2;
    const canReport = version.status !== 3;
    const disabledAttr = !isPending ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-secondary" id="btn-back" style="margin-right: 10px;">&larr; Voltar</button>
                <span style="font-size: 1.2rem; font-weight: bold;">${version.name}</span>
                <span style="color: #666; margin-left: 10px;">${version.date}</span>
                <button class="btn-primary btn-sm" id="btn-edit-version-modal" title="Editar Detalhes" ${disabledAttr}>✏️ Editar</button>
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
                        <th>Data</th>
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
                            <td>${item.date}</td>
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
        showModal('Alterar Status', `Deseja alterar o status para ${statusInfo.label}?`, () => {
            version.status = newStatus;
            renderVersionDetail(versionId); // Recarrega a tela para atualizar o badge
        }, 'confirm');
    }
}

// Função para abrir o Modal de Edição
function openEditVersionModal(version) {
    // Cria o overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Estrutura do Modal (reusando classes de form-card)
    overlay.innerHTML = `
        <div class="modal-content">
            <form id="modal-edit-form" class="form-card" style="margin: 0; max-width: 100%; box-shadow: none;">
                <h2>Editar Versão</h2>
                <div class="form-group">
                    <label for="modal-version-name">Número da Versão</label>
                    <input type="text" id="modal-version-name" value="${version.name}" required>
                </div>
                <div class="form-group">
                    <label for="modal-version-date">Data de Lançamento</label>
                    <input type="date" id="modal-version-date" value="${version.date}">
                </div>
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
    
    document.getElementById('modal-edit-form').onsubmit = (e) => {
        e.preventDefault();
        // Atualiza estado
        version.name = document.getElementById('modal-version-name').value;
        version.date = document.getElementById('modal-version-date').value;
        
        close();
        renderVersionDetail(version.id); // Atualiza a tela de fundo
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
                    <input type="text" id="modal-item-ticket" value="${item ? (item.ticket || '') : ''}" required>
                </div>
                <div class="form-group">
                    <label for="modal-item-ticket-title">Título do Ticket (Opcional)</label>
                    <input type="text" id="modal-item-ticket-title" value="${item ? (item.ticketTitle || '') : ''}">
                </div>
                <div class="form-group">
                    <label for="modal-item-name">Nome do Item</label>
                    <input type="text" id="modal-item-name" value="${item ? item.name : ''}" required>
                </div>
                <div class="form-group">
                    <label for="modal-item-date">Data</label>
                    <input type="date" id="modal-item-date" value="${item ? item.date : ''}" required>
                </div>
                <div class="form-group">
                    <label for="modal-item-url">URL</label>
                    <input type="text" id="modal-item-url" value="${item ? item.url : ''}" required>
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

    document.getElementById('modal-item-form').onsubmit = (e) => {
        e.preventDefault();
        
        // Lógica de Criação (Focada no pedido de adicionar item novo na versão)
        // Nota: Simplifiquei assumindo criação de novo item, mas a estrutura suporta edição se necessário.
        const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
        const newItem = {
            id: newId,
            ticket: document.getElementById('modal-item-ticket').value,
            ticketTitle: document.getElementById('modal-item-ticket-title').value,
            name: document.getElementById('modal-item-name').value,
            date: document.getElementById('modal-item-date').value,
            url: document.getElementById('modal-item-url').value,
            migration: document.getElementById('modal-item-migration').checked,
            clientId: parseInt(document.getElementById('modal-item-client').value),
            versionId: versionId // VINCULA AUTOMATICAMENTE À VERSÃO SE PASSADO
        };
        
        state.items.push(newItem);
        
        close();
        if (onSuccess) onSuccess();
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

    document.getElementById('btn-modal-link-confirm').onclick = () => {
        const selectedIds = Array.from(document.querySelectorAll('.item-to-link:checked'))
                                 .map(checkbox => parseInt(checkbox.value));

        selectedIds.forEach(id => {
            const item = state.items.find(i => i.id === id);
            if (item) item.versionId = versionId;
        });

        close();
        if (onSuccess) onSuccess();
    };
}

// Nova funcionalidade: Gerar Relato
function renderReportView(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    const versionItems = state.items.filter(i => i.versionId === versionId);
    
    pageTitle.textContent = `Relato: ${version.name}`;
    
    // Formato solicitado: **{Numero}** Versao - Lancamento {{Data}}
    const header = `**${version.name}** Versao - Lancamento ${version.date}  @everyone`;
    const itemsList = versionItems.map(item => `- ${item.name}${item.migration ? ' (migrations)' : ''}`).join('\n');
    const fullText = `${header}\n\n${itemsList}`;

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
function renderPending() {
    pageTitle.textContent = 'Itens Pendentes';
    
    // Filtrar itens sem versão (null ou undefined)
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
                        <th>Nome</th>
                        <th>Data</th>
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
                            <td>${item.date}</td>
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
        btn.onclick = (e) => navigateTo('item-form', parseInt(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-del-item').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            showModal('Excluir Item', 'Tem certeza que deseja excluir este item?', () => {
                state.items = state.items.filter(i => i.id !== id);
                // Recarrega a view atual (gambiarra simples: verifica titulo)
                pageTitle.textContent.includes('Pendentes') ? renderPending() : renderVersions(); 
            }, 'confirm');
        };
    });
}

// Renderizar Clientes (Placeholder)
function renderClients() {
    pageTitle.textContent = 'Clientes';

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="header-container">
            <h1>Gerenciamento de Clientes</h1>
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
    document.querySelectorAll('.btn-edit-client').forEach(btn => btn.onclick = (e) => navigateTo('client-form', parseInt(e.target.dataset.id)));
    document.querySelectorAll('.btn-del-client').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            showModal('Excluir Cliente', 'Excluir este cliente?', () => {
                state.clients = state.clients.filter(c => c.id !== id);
                renderClients();
            }, 'confirm');
        };
    });
}

// Etapa 5: Formulário de Cliente (Cadastro/Edição)
function renderClientForm(id = null) {
    const isEdit = id !== null;
    const client = isEdit ? state.clients.find(c => c.id === id) : null;

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
    document.getElementById('client-form').onsubmit = (e) => {
        e.preventDefault();
        const clientName = e.target.clientName.value;
        
        if (isEdit) {
            client.name = clientName;
        } else {
            const newId = Math.max(...state.clients.map(c => c.id), 0) + 1;
            state.clients.push({ id: newId, name: clientName, active: true });
        }
        navigateTo('clients');
    };
}

// Etapa 6: Formulário de Versão (Cadastro/Edição)
function renderVersionForm(id = null) {
    const isEdit = id !== null;
    const version = isEdit ? state.versions.find(v => v.id === id) : null;

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
    document.getElementById('version-form').onsubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            version.name = e.target.versionName.value;
            version.date = e.target.versionDate.value;
        } else {
            const newId = Math.max(...state.versions.map(v => v.id), 0) + 1;
            // Novas versões nascem como Pendente
            state.versions.unshift({ id: newId, name: e.target.versionName.value, date: e.target.versionDate.value, status: 2 });
        }
        navigateTo('versions');
    };
}

// Etapa 7: Formulário de Item (Cadastro/Edição)
function renderItemForm(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? state.items.find(i => i.id === id) : null;

    pageTitle.textContent = isEdit ? 'Editar Item' : 'Novo Item';

    const clientOptions = state.clients
        .filter(c => c.active)
        .map(c => `<option value="${c.id}" ${item && item.clientId === c.id ? 'selected' : ''}>${c.name}</option>`)
        .join('');

    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form id="item-form" class="form-card">
            <h2>${isEdit ? 'Editar Item' : 'Cadastrar Novo Item'}</h2>
            <div class="form-group">
                <label for="item-ticket">Número do Ticket</label>
                <input type="text" id="item-ticket" name="itemTicket" value="${item ? (item.ticket || '') : ''}" required>
            </div>
            <div class="form-group">
                <label for="item-ticket-title">Título do Ticket (Opcional)</label>
                <input type="text" id="item-ticket-title" name="itemTicketTitle" value="${item ? (item.ticketTitle || '') : ''}">
            </div>
            <div class="form-group">
                <label for="item-name">Nome do Item</label>
                <input type="text" id="item-name" name="itemName" value="${item ? item.name : ''}" required>
            </div>
            <div class="form-group">
                <label for="item-date">Data</label>
                <input type="date" id="item-date" name="itemDate" value="${item ? item.date : ''}" required>
            </div>
            <div class="form-group">
                <label for="item-url">URL (Jira, Git, etc)</label>
                <input type="text" id="item-url" name="itemUrl" value="${item ? item.url : ''}" required>
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
    document.getElementById('item-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        
        if (isEdit) {
            item.ticket = form.itemTicket.value;
            item.ticketTitle = form.itemTicketTitle.value;
            item.name = form.itemName.value;
            item.date = form.itemDate.value;
            item.url = form.itemUrl.value;
            item.migration = form.itemMigration.checked;
            item.clientId = parseInt(form.itemClient.value);
        } else {
            const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
            const newItem = {
                id: newId,
                ticket: form.itemTicket.value,
                ticketTitle: form.itemTicketTitle.value,
                name: form.itemName.value,
                date: form.itemDate.value,
                url: form.itemUrl.value,
                migration: form.itemMigration.checked,
                clientId: parseInt(form.itemClient.value),
                versionId: null
            };
            state.items.push(newItem);
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

// Carregar rota inicial
navigateTo('versions');

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
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    // Event Listeners
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link da sidebar (UX melhor no mobile)
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Apenas se estiver em modo mobile (sidebar tem classe active)
            if (sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

// Inicializa a responsividade após o carregamento do DOM
document.addEventListener('DOMContentLoaded', setupMobileResponsiveness);

// --- Debug / Mock Data Generator ---
function generateMockData() {
    state.versions = [
        { id: 1, name: 'v2.1.0', date: '2023-10-25', status: 1 },
        { id: 2, name: 'v2.0.5', date: '2023-10-10', status: 1 },
        { id: 3, name: 'v2.0.0', date: '2023-09-30', status: 2 },
        { id: 4, name: 'v1.9.8', date: '2023-09-15', status: 3 }
    ];
    state.clients = [
        { id: 1, name: 'TechCorp', active: true },
        { id: 2, name: 'HealthSys', active: true },
        { id: 3, name: 'Fintech Solutions', active: false }
    ];
    state.items = [
        { id: 1, ticket: 'JIRA-101', ticketTitle: 'Erro Login', name: 'Correção de autenticação', date: '2023-10-24', url: 'https://jira.com/101', migration: false, clientId: 1, versionId: 1 },
        { id: 2, ticket: 'JIRA-102', ticketTitle: 'Relatório Vendas', name: 'Novo relatório de vendas', date: '2023-10-23', url: 'https://jira.com/102', migration: true, clientId: 2, versionId: 1 },
        { id: 3, ticket: 'JIRA-103', ticketTitle: 'Rodapé CSS', name: 'Ajuste no rodapé', date: '2023-10-05', url: 'https://jira.com/103', migration: false, clientId: 1, versionId: 2 },
        { id: 4, ticket: 'JIRA-104', ticketTitle: 'Performance DB', name: 'Otimização de banco de dados', date: '2023-11-01', url: 'https://jira.com/104', migration: true, clientId: 3, versionId: null },
        { id: 5, ticket: 'JIRA-105', ticketTitle: 'Refactor JS', name: 'Refatoração da Home', date: '2023-11-02', url: 'https://jira.com/105', migration: false, clientId: 1, versionId: null }
    ];
    showModal('Sucesso', 'Dados de teste gerados com sucesso!', () => navigateTo('versions'));
}

// Criação do botão flutuante
const btnMock = document.createElement('button');
btnMock.textContent = 'Gerar Mock';
btnMock.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000; padding: 10px 15px; background-color: #34495e; color: white; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); opacity: 0.8; transition: opacity 0.3s;';
btnMock.onmouseover = () => btnMock.style.opacity = '1';
btnMock.onmouseout = () => btnMock.style.opacity = '0.8';
btnMock.onclick = generateMockData;
document.body.appendChild(btnMock);
