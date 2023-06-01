import fastify from 'fastify'
import { connectUser } from "./services/connect-user"
import { getMachine } from "./services/get-machine"
import { sendActivity } from "./services/send-activity"
import { PORT } from "./constants"

const server = fastify()

server.get('/activity/:machine_id', getMachine)
server.post('/activity/:machine_id', connectUser)
server.post('/activity', sendActivity)

server.listen({ host: '0.0.0.0', port: PORT ? Number(PORT) : 8080 }).then((path) => console.log(`🚀 Server running in: ${path}`))