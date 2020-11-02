require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swagger = require('../swagger/doc');
const { dbConnection, notFound, serverError } = require('./middlewares');

const PORT = process.env.PORT || 3000;

const app = express();

const routes = require('./routes');

const swaggerRoutes = swagger(express);

app.use(bodyParser.json());
app.use(dbConnection);
app.use(routes, swaggerRoutes);
app.use('/', routes);
app.use(notFound);
app.use(serverError);

// eslint-disable-next-line no-unused-vars
app.use((e, req, res, next) => res.status(e.status || 500).json({ message: e.message }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports.app = app;
