import express from 'express'
import cors from 'cors'

const app = express();

//configration
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cors({
    origin: process.env.CORS_ORIGIN ?.split(",") || 'http://localhost:5172' ,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', "PUT", "OPTIONS", "PATCH"],
    allowedHeaders: ["Authorization", "Content-Type"],
})
);


app.get('/', (req, res) => {
    res.send('its form sever.js')
})

export default app