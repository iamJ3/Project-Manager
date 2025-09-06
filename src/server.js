import express from 'express'
import cors from 'cors'
import healthCheckRouter from './routes/healthcheck.route.js'
import authRouter from "./routes/auth.routes.js"
import cookieParser from 'cookie-parser';

const app = express();

//cors configration
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', "PUT", "OPTIONS", "PATCH"],
    allowedHeaders: ["Authorization", "Content-Type"],
})
);
app.use(cookieParser())


//importing routes
app.use('/api/v1/healthcheck', healthCheckRouter)
app.use('/api/v1/auth', authRouter)


app.get('/', (req, res) => {
    res.status(200).json({ msg: "successfully connected" })
})

export default app