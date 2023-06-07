const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

const port = 4000; // Ganti dengan port yang diinginkan
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});