const { getTickets, generateId } = require('../data/ticketsStore');
const { normalizeText } = require('../utils/text');

const allowedPriorities = ['Baixa', 'Media', 'Alta', 'Critica'];
const allowedStatus = ['Aberto', 'Em andamento', 'Resolvido', 'Cancelado'];

function list(filters = {}) {
  let tickets = getTickets();

  if (filters.status) {
    tickets = tickets.filter(ticket => normalizeText(ticket.status) === normalizeText(filters.status));
  }

  if (filters.prioridade) {
    tickets = tickets.filter(ticket => normalizeText(ticket.prioridade) === normalizeText(filters.prioridade));
  }

  if (filters.setor) {
    tickets = tickets.filter(ticket => normalizeText(ticket.setor).includes(normalizeText(filters.setor)));
  }

  return tickets;
}

function getById(id) {
  const ticket = findTicket(id);

  if (!ticket) {
    return { success: false, message: 'Chamado não encontrado.' };
  }

  return { success: true, data: ticket };
}

function create(data) {
  const validation = validateTicket(data);

  if (!validation.success) {
    return validation;
  }

  const now = new Date().toISOString();

  const ticket = {
    id: generateId(),
    titulo: data.titulo.trim(),
    descricao: data.descricao.trim(),
    setor: data.setor.trim(),
    prioridade: data.prioridade,
    status: 'Aberto',
    responsavel: data.responsavel?.trim() || 'Não definido',
    criadoEm: now,
    atualizadoEm: now
  };

  getTickets().push(ticket);

  return { success: true, data: ticket };
}

function updateStatus(id, status) {
  const ticket = findTicket(id);

  if (!ticket) {
    return { success: false, type: 'not_found', message: 'Chamado não encontrado.' };
  }

  if (!allowedStatus.includes(status)) {
    return { success: false, type: 'validation', message: 'Status inválido.' };
  }

  ticket.status = status;
  ticket.atualizadoEm = new Date().toISOString();

  return { success: true, data: ticket };
}

function remove(id) {
  const tickets = getTickets();
  const index = tickets.findIndex(ticket => ticket.id === Number(id));

  if (index === -1) {
    return { success: false, message: 'Chamado não encontrado.' };
  }

  tickets.splice(index, 1);

  return { success: true, message: 'Chamado removido com sucesso.' };
}

function validateTicket(data) {
  if (!data.titulo || !data.descricao || !data.setor || !data.prioridade) {
    return { success: false, message: 'Título, descrição, setor e prioridade são obrigatórios.' };
  }

  if (!allowedPriorities.includes(data.prioridade)) {
    return { success: false, message: 'Prioridade inválida.' };
  }

  return { success: true };
}

function findTicket(id) {
  return getTickets().find(ticket => ticket.id === Number(id));
}

module.exports = { list, getById, create, updateStatus, remove };
