const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(5000, () => {
  console.log(new Date().toISOString(), 'Scratch server running on 5000');
  setInterval(() => {
    console.log(new Date().toISOString(), 'alive tick');
  }, 1000);
});
