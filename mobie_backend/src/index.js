const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const routes = require('./routes');

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(cookieParser())

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(()=>{
    console.log("Connect DB success!")
})
.catch((err)=>{
    console.log("Eroor: ",err);
})

app.listen(port, ()=>{
    console.log("service is running in port: ", "http://localhost:"+port);
});