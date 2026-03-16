// Estado da aplicação (Mock Data)
const state = {
    versions: [
        { id: 1, name: 'v2.1.0', date: '2023-10-25', status: 'Finalizado' },
        { id: 2, name: 'v2.0.5', date: '2023-10-10', status: 'Finalizado' },
        { id: 3, name: 'v2.0.0', date: '2023-09-30', status: 'Pendente' },
        { id: 4, name: 'v1.9.8', date: '2023-09-15', status: 'Cancelado' }
    ],
    clients: [
        { id: 1, name: 'TechCorp', active: true },
        { id: 2, name: 'HealthSys', active: true },
        { id: 3, name: 'Fintech Solutions', active: false }
    ],
    items: [
        { id: 1, name: 'Correção de autenticação', date: '2023-10-24', url: 'https://jira.com/101', migration: false, clientId: 1, versionId: 1 },
        { id: 2, name: 'Novo relatório de vendas', date: '2023-10-23', url: 'https://jira.com/102', migration: true, clientId: 2, versionId: 1 },
        { id: 3, name: 'Ajuste no rodapé', date: '2023-10-05', url: 'https://jira.com/103', migration: false, clientId: 1, versionId: 2 },
        { id: 4, name: 'Otimização de banco de dados', date: '2023-11-01', url: 'https://jira.com/104', migration: true, clientId: 3, versionId: null },
        { id: 5, name: 'Refatoração da Home', date: '2023-11-02', url: 'https://jira.com/105', migration: false, clientId: 1, versionId: null }
    ]
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
        
        const statusClass = `status-${version.status.toLowerCase()}`;

        card.innerHTML = `
            <h3>${version.name}</h3>
            <span style="display:block; margin-bottom: 10px;">Lançamento: ${version.date}</span>
            <span class="status-badge ${statusClass}">${version.status}</span>
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
    const statusClass = `status-${version.status.toLowerCase()}`;

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-secondary" id="btn-back" style="margin-right: 10px;">&larr; Voltar</button>
                <span style="font-size: 1.2rem; font-weight: bold;">${version.name}</span>
                <span style="color: #666; margin-left: 10px;">${version.date}</span>
                <button class="btn-primary btn-sm" id="btn-edit-version-modal" title="Editar Detalhes">✏️ Editar</button>
                <span class="status-badge ${statusClass}" style="margin-top:0;">${version.status}</span>
            </div>
            <div>
                <button class="btn-primary" id="btn-report-version" style="margin-right: 5px; background-color: #8e44ad;">Gerar Relato</button>
                <button class="btn-primary" id="btn-link-item">Adicionar Item</button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>URL</th>
                        <th>Migration</th>
                        <th>Cliente</th>
                        <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${versionItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.date}</td>
                            <td><a href="${item.url}" target="_blank">Link</a></td>
                            <td>${item.migration ? 'Sim' : 'Não'}</td>
                            <td>${getClientName(item.clientId)}</td>
                            <td style="text-align: right;">
                                <button class="btn-primary btn-sm btn-edit-item" data-id="${item.id}">Editar</button>
                                <button class="btn-secondary btn-sm btn-del-item" data-id="${item.id}" style="background-color: #e74c3c;">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${versionItems.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Nenhum item vinculado.</td></tr>' : ''}
                </tbody>
            </table>
        </div>

        <!-- Footer Actions -->
        <div class="detail-footer-actions">
            <button class="btn-primary btn-success" id="btn-finalize-version">Finalizar Versão</button>
            <button class="btn-primary btn-danger" id="btn-cancel-version">Cancelar Versão</button>
        </div>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(container);

    // Ação do botão voltar
    document.getElementById('btn-back').onclick = () => navigateTo('versions');
    
    // Ação do botão Adicionar Item
    document.getElementById('btn-link-item').onclick = () => renderLinkItemToVersion(version.id);

    // Ação Gerar Relato
    document.getElementById('btn-report-version').onclick = () => renderReportView(version.id);
    
    // Ação Editar Versão (Abrir Modal)
    document.getElementById('btn-edit-version-modal').onclick = (e) => {
        e.stopPropagation();
        openEditVersionModal(version);
    };

    // Ações de Rodapé (Status)
    document.getElementById('btn-finalize-version').onclick = () => updateVersionStatus(version.id, 'Finalizado');
    document.getElementById('btn-cancel-version').onclick = () => updateVersionStatus(version.id, 'Cancelado');
    
    setupItemActions(); // Configura eventos de editar/excluir itens
}

// Função auxiliar para atualizar status
function updateVersionStatus(versionId, newStatus) {
    const version = state.versions.find(v => v.id === versionId);
    if (version) {
        if (confirm(`Deseja alterar o status para ${newStatus}?`)) {
            version.status = newStatus;
            renderVersionDetail(versionId); // Recarrega a tela para atualizar o badge
        }
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
                    <label for="modal-version-name">Nome da Versão</label>
                    <input type="text" id="modal-version-name" value="${version.name}" required>
                </div>
                <div class="form-group">
                    <label for="modal-version-date">Data de Lançamento</label>
                    <input type="date" id="modal-version-date" value="${version.date}" required>
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

// Nova funcionalidade: Gerar Relato
function renderReportView(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    const versionItems = state.items.filter(i => i.versionId === versionId);
    
    pageTitle.textContent = `Relato: ${version.name}`;
    
    // Formato solicitado: **{Numero}** Versao - Lancamento {{Data}}
    const header = `**${version.name}** Versao - Lancamento ${version.date}`;
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
            .then(() => alert('Relato copiado para a área de transferência!'))
            .catch(() => alert('Erro ao copiar. Por favor, tente manualmente.'));
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
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>URL</th>
                        <th>Migration</th>
                        <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${pendingItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.date}</td>
                            <td>${getClientName(item.clientId)}</td>
                            <td><a href="${item.url}" target="_blank">Link</a></td>
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
            if(confirm('Tem certeza que deseja excluir este item?')) {
                state.items = state.items.filter(i => i.id !== parseInt(e.target.dataset.id));
                // Recarrega a view atual (gambiarra simples: verifica titulo)
                pageTitle.textContent.includes('Pendentes') ? renderPending() : renderVersions(); 
            }
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
            if(confirm('Excluir este cliente?')) {
                state.clients = state.clients.filter(c => c.id !== parseInt(e.target.dataset.id));
                renderClients();
            }
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
                <label for="version-name">Nome da Versão (ex: v2.3.0)</label>
                <input type="text" id="version-name" name="versionName" value="${version ? version.name : ''}" required>
            </div>
            <div class="form-group">
                <label for="version-date">Data de Lançamento</label>
                <input type="date" id="version-date" name="versionDate" value="${version ? version.date : ''}" required>
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
            state.versions.unshift({ id: newId, name: e.target.versionName.value, date: e.target.versionDate.value, status: 'Pendente' });
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

    document.getElementById('btn-cancel').onclick = () => {
        if (state.createItemForVersionId) {
            const targetVersionId = state.createItemForVersionId;
            delete state.createItemForVersionId; // Limpa o contexto
            renderLinkItemToVersion(targetVersionId); // Volta para a tela de vincular
        } else {
            navigateTo('pending'); // Comportamento padrão
        }
    };
    document.getElementById('item-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        
        if (isEdit) {
            item.name = form.itemName.value;
            item.date = form.itemDate.value;
            item.url = form.itemUrl.value;
            item.migration = form.itemMigration.checked;
            item.clientId = parseInt(form.itemClient.value);
        } else {
            const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
            const newItem = {
                id: newId,
                name: form.itemName.value,
                date: form.itemDate.value,
                url: form.itemUrl.value,
                migration: form.itemMigration.checked,
                clientId: parseInt(form.itemClient.value),
                versionId: null
            };
            state.items.push(newItem);

            // Se estivermos no fluxo de "Criar para Vincular"
            if (state.createItemForVersionId) {
                newItem.versionId = state.createItemForVersionId; // Vincula o item à versão
                const targetVersionId = state.createItemForVersionId;
                delete state.createItemForVersionId; // Limpa o contexto
                renderVersionDetail(targetVersionId); // Vai direto para os detalhes da versão
                return; // Encerra o fluxo aqui
            }
        }
        navigateTo('pending');
    };
}

// Etapa 8: Vincular Item a uma Versão
function renderLinkItemToVersion(versionId) {
    const version = state.versions.find(v => v.id === versionId);
    pageTitle.textContent = `Vincular Item a: ${version.name}`;

    const pendingItems = state.items.filter(i => !i.versionId);

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="header-container">
            <button class="btn-secondary" id="btn-back-details">&larr; Voltar para Detalhes</button>
            <button class="btn-primary" id="btn-create-for-version">Criar e Vincular Novo Item</button>
        </div>
        <p style="margin: 20px 0;">Selecione um item pendente para vincular à versão <strong>${version.name}</strong>.</p>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cliente</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${pendingItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${getClientName(item.clientId)}</td>
                            <td>
                                <button class="btn-primary btn-sm" data-item-id="${item.id}">Vincular</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${pendingItems.length === 0 ? '<tr><td colspan="3" style="text-align: center;">Nenhum item pendente para vincular.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;

    contentArea.innerHTML = '';
    contentArea.appendChild(container);

    document.getElementById('btn-back-details').onclick = () => renderVersionDetail(versionId);

    document.getElementById('btn-create-for-version').onclick = () => {
        // Define um contexto para o formulário de criação saber para onde voltar e o que fazer.
        state.createItemForVersionId = versionId;
        navigateTo('item-form');
    };

    contentArea.querySelectorAll('.btn-primary[data-item-id]').forEach(button => {
        button.onclick = (e) => {
            const itemId = parseInt(e.target.dataset.itemId);
            const itemToLink = state.items.find(i => i.id === itemId);
            if (itemToLink) {
                itemToLink.versionId = versionId;
                renderVersionDetail(versionId);
            }
        };
    });
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
