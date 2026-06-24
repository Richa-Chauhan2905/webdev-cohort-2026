import { createServer } from 'node:http'
import {createApplication} from './app'

async function main(){
    try {
        const app = createApplication()
        const server = createServer(app)
        const PORT: number = 8080

        server.listen(PORT, () => {
            console.log(`HTTP server running on ${PORT}`);
        })
    } catch (error) {
        console.log("Error starting HTTP server")
    }
}

main()