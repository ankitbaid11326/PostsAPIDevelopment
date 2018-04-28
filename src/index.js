import express from 'express';

import constants from './config/constants';
import './config/database';
import middlewareConfig from './config/middlewares';
import apiRoutes from './modules';

const app = express();

middlewareConfig(app);

app.get('/', (req, res) => {
    res.json({
        'hello': 'Hello'
    })
})

apiRoutes(app);

app.listen(constants.PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`Server is running on Port : ${constants.PORT}
        ---
        Running on ${process.env.NODE_ENV}
        ---
        ENJOY Your LIFE....
        `);
  }
});
