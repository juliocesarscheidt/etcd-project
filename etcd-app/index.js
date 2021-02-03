const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();

const port = process.env.API_PORT || 8200;
const host = process.env.API_HOST || '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);

require('./routes/userRoute.js')(router);
require('./routes/healthcheckRoute.js')(router);

app.listen(port, host, () => {
  console.info(`Server listening on ${host}:${port}`);
});
