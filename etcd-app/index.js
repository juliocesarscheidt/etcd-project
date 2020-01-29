const express = require('express');
const port = process.env.API_PORT || 9000;
const app = express();

require('./routes.js')(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
