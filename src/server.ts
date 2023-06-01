import fastify from 'fastify'
import { connectUser } from "./services/connect-user"
import { getMachine } from "./services/get-machine"
import { sendActivity } from "./services/send-activity"
import { PORT } from "./constants"

const server = fastify()

server.get('/activity/:machine_id', getMachine)
server.post('/activity/:machine_id', connectUser)
server.post('/activity', sendActivity)

server.listen({ port: Number(PORT) || 8080 }, (err, address) => {
  if (err) {
    process.exit(1)
  }
  console.log(`🚀 Server running at ${address}`)
})