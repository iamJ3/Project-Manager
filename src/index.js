import dotenv from 'dotenv'
import app from './server.js'

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);

})
