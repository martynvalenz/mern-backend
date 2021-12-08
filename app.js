const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config({path:'./.env'});
require('./db/mongoose');
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use('/api', require('./controllers/authRoutes'));

app.get('/', (req, res) => {
  res.send('Access Denied');
});

app.listen(port, () => {
  console.log(`Server listening on 3001`)
})