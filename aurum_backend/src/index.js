const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const routes = require('./routes');
const { catalog } = require('./ht');
const Product = require('./models/ProductModel');

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({
    origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
    credentials: true,
}));

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(cookieParser())

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(()=>{
    console.log("Connect DB success!")
    Product.find().lean().then((all) => catalog.reindex(all)).catch(console.log)
})
.catch((err)=>{
    console.log("Eroor: ",err);
})

app.listen(port, ()=>{
    console.log("service is running in port: ", "http://localhost:"+port);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, async () => {
        await catalog.close()
        process.exit(0)
    })
}
