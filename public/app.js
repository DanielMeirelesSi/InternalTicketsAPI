const apiUrl = '/api/tickets';

const form = document.getElementById('ticketForm');
const formMessage = document.getElementById('formMessage');
const ticketsList = document.getElementById('ticketsList');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sectorFilter = document.getElementById('sectorFilter');
const totalTickets = document.getElementById('totalTickets');
const openTickets = document.getElementById('openTickets');
const progressTickets = document.getElementById('progressTickets');
const resolvedTickets = document.getElementById('resolvedTickets');

async function loadTickets() {
  const params = new URLSearchParams();

  if (statusFilter.value) params.append('status', statusFilter.value);
  if (priorityFilter.value) params.append('prioridade', priorityFilter.value);
  if (sectorFilter.value) params.append('setor', sectorFilter.value);

  const response = await fetch(`${apiUrl}?${params.toString()}`);
  const tickets = await response.json();

  renderTickets(tickets);
  updateSummary();
}

async function updateSummary() {
  const response = await fetch(apiUrl);
  const tickets = await response.json();

  totalTickets.textContent = tickets.length;
  openTickets.textContent = tickets.filter(ticket => ticket.status === 'Aberto').length;
  progressTickets.textContent = tickets.filter(ticket => ticket.status === 'Em andamento').length;
  resolvedTickets.textContent = tickets.filter(ticket => ticket.status === 'Resolvido').length;
}

function renderTickets(tickets) {
  ticketsList.innerHTML = '';

  if (tickets.length === 0) {
    ticketsList.innerHTML = '<div class="empty-state">Nenhum chamado encontrado.</div>';
    return;
  }

  tickets.forEach(ticket => {
    const card = document.createElement('article');
    card.className = 'ticket-card';
    card.innerHTML = `
      <div class="ticket-top">
        <h3>#${ticket.id} - ${ticket.titulo}</h3>
        <span class="badge">${ticket.status}</span>
      </div>
      <p>${ticket.descricao}</p>
      <div class="ticket-meta">
        <span class="badge">Setor: ${ticket.setor}</span>
        <span class="badge priority-${ticket.prioridade}">Prioridade: ${ticket.prioridade}</span>
        <span class="badge">Responsável: ${ticket.responsavel}</span>
      </div>
      <div class="ticket-actions">
        <select data-status-id="${ticket.id}">
          <option value="Aberto" ${ticket.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
          <option value="Em andamento" ${ticket.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
          <option value="Resolvido" ${ticket.status === 'Resolvido' ? 'selected' : ''}>Resolvido</option>
          <option value="Cancelado" ${ticket.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
        <button data-delete-id="${ticket.id}">Excluir</button>
      </div>`;
    ticketsList.appendChild(card);
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const data = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    setor: document.getElementById('setor').value,
    prioridade: document.getElementById('prioridade').value,
    responsavel: document.getElementById('responsavel').value
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    formMessage.textContent = result.erro || 'Não foi possível abrir o chamado.';
    formMessage.style.color = '#dc2626';
    return;
  }

  form.reset();
  formMessage.textContent = 'Chamado aberto com sucesso.';
  formMessage.style.color = '#15803d';
  loadTickets();
});

ticketsList.addEventListener('change', async event => {
  const ticketId = event.target.dataset.statusId;
  if (!ticketId) return;

  await fetch(`${apiUrl}/${ticketId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: event.target.value })
  });

  loadTickets();
});

ticketsList.addEventListener('click', async event => {
  const ticketId = event.target.dataset.deleteId;
  if (!ticketId) return;

  await fetch(`${apiUrl}/${ticketId}`, { method: 'DELETE' });
  loadTickets();
});

statusFilter.addEventListener('change', loadTickets);
priorityFilter.addEventListener('change', loadTickets);
sectorFilter.addEventListener('input', loadTickets);

loadTickets();
