require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const swagger = require('./swagger');
const { dbConnection, notFound, serverError } = require('./src/middlewares');

const PORT = process.env.PORT || 3000;

const app = express();

const routes = require('./src/routes');

// const swaggerRoutes = swagger(express);

app.use(bodyParser.json());
app.use(dbConnection);
// app.use(routes, swaggerRoutes);
app.use('/', routes);
app.use(notFound);
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
