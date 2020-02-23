const express = require('express');

const port = process.env.API_PORT || 9000;
const app = express();

require('./routes/user.js')(app);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
