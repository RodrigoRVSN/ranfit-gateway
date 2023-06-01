
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from 'zod'
import { doc, getDoc } from '@firebase/firestore'
import { FIREBASE_DB } from "../config/firebase"

const getMachineParams = z.object({
  machine_id: z.string({ required_error: 'Machine ID is required' }),
})

export const getMachine = async (request: FastifyRequest, reply: FastifyReply) => {
  const { machine_id } = getMachineParams.parse(request.params)

  const machinesCollectionRef = doc(FIREBASE_DB, 'machines', machine_id);
  const snapshot = await getDoc(machinesCollectionRef);

  if (!snapshot.exists()) {
    reply.code(404).send({ message: 'Machine not found' })
  }

  const machineData = snapshot.data()

  reply.code(200).send(machineData)
}

