const express = require('express');
require('dotenv/config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const authJWT = require('./helper/jwt');
// const errorHandler = require('./helper/error-handler');
const app = express();



// middleware
app.use(cors());
app.options('*',cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJWT());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
// app.use(errorHandler())

//routers
const api = process.env.API_URL;
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/users`,usersRoutes);
app.use(`${api}/orders`,ordersRoutes);



const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port : ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.connection.on('error', err => {
    console.log(`DB Connection error: ${err.message}`);
})

