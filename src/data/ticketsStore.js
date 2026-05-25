let nextId = 4;

const tickets = [
  {
    id: 1,
    titulo: 'Falha no registro de pesagem',
    descricao: 'O sistema não registrou corretamente a pesagem de uma carreta.',
    setor: 'Operação',
    prioridade: 'Alta',
    status: 'Aberto',
    responsavel: 'TI',
    criadoEm: '2026-05-25T09:30:00.000Z',
    atualizadoEm: '2026-05-25T09:30:00.000Z'
  },
  {
    id: 2,
    titulo: 'Ajuste no relatório diário',
    descricao: 'Incluir filtro por setor no relatório de chamados operacionais.',
    setor: 'Administrativo',
    prioridade: 'Media',
    status: 'Em andamento',
    responsavel: 'Desenvolvimento',
    criadoEm: '2026-05-25T10:10:00.000Z',
    atualizadoEm: '2026-05-25T10:40:00.000Z'
  },
  {
    id: 3,
    titulo: 'Cadastro de novo usuário',
    descricao: 'Solicitação de acesso para colaborador do setor de logística.',
    setor: 'Logística',
    prioridade: 'Baixa',
    status: 'Resolvido',
    responsavel: 'Suporte',
    criadoEm: '2026-05-25T11:20:00.000Z',
    atualizadoEm: '2026-05-25T12:05:00.000Z'
  }
];

function getTickets() {
  return tickets;
}

function generateId() {
  const id = nextId;
  nextId += 1;
  return id;
}

module.exports = { getTickets, generateId };
