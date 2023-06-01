import { FastifyReply, FastifyRequest } from "fastify"
import { doc, setDoc } from "firebase/firestore"
import { z } from 'zod'
import { FIREBASE_DB } from "../config/firebase"

const connectUserParams = z.object({
  machine_id: z.string({ required_error: 'Machine ID is required' }),
})

const connectUserBody = z.object({
  user_id: z.string(),
})

export const connectUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { machine_id } = connectUserParams.parse(request.params)
  const { user_id } = connectUserBody.parse(request.body)

  const machinesDocRef = doc(FIREBASE_DB, 'machines', machine_id);

  await setDoc(machinesDocRef, { user_id });

  const status = user_id ? "connected" : "disconnected"
  const replyMessage = `User${user_id && ` ${user_id}`} is being ${status} from machine ${machine_id}`

  reply.code(200).send({ message: replyMessage })
}