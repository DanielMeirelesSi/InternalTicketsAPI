const express = require('express');
const cors = require('cors');
const path = require('path');
const ticketsRoutes = require('./routes/ticketsRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'InternalTicketsAPI'
  });
});

app.use('/api/tickets', ticketsRoutes);

app.listen(port, () => {
  console.log(`InternalTicketsAPI rodando em http://localhost:${port}`);
});
