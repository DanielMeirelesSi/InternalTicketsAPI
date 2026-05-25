const ticketsService = require('../services/ticketsService');

function list(req, res) {
  const { status, prioridade, setor } = req.query;
  const tickets = ticketsService.list({ status, prioridade, setor });

  res.json(tickets);
}

function getById(req, res) {
  const result = ticketsService.getById(req.params.id);

  if (!result.success) {
    return res.status(404).json({ erro: result.message });
  }

  res.json(result.data);
}

function create(req, res) {
  const result = ticketsService.create(req.body);

  if (!result.success) {
    return res.status(400).json({ erro: result.message });
  }

  res.status(201).json(result.data);
}

function updateStatus(req, res) {
  const result = ticketsService.updateStatus(req.params.id, req.body.status);

  if (!result.success) {
    const statusCode = result.type === 'not_found' ? 404 : 400;
    return res.status(statusCode).json({ erro: result.message });
  }

  res.json(result.data);
}

function remove(req, res) {
  const result = ticketsService.remove(req.params.id);

  if (!result.success) {
    return res.status(404).json({ erro: result.message });
  }

  res.json({ mensagem: result.message });
}

module.exports = { list, getById, create, updateStatus, remove };
