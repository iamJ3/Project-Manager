import dotenv from 'dotenv'
import app from './server.js'
import connectDB from './db/index.js'



dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 3000


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`server running at http://localhost:${port}`);

        })
    })
    .catch((err) => {
        console.log(' ❌MongoDb connection error', err)
        process.exit(1)
    }
)