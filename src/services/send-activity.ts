import { FastifyReply, FastifyRequest } from "fastify"
import { Timestamp, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore"
import { z } from 'zod'
import { FIREBASE_DB } from "../config/firebase"
import { IExercise } from "../@types/IExercise"
import { updateUserData } from "../helpers/update-user-data"

const EXPIRED_ACTIVITY_SECONDS = 10

const sendActivityBody = z.object({
  user_id: z.string({ required_error: 'User ID is required' }),
  power: z.number({ required_error: 'Power is required' }),
  points: z.number({ required_error: 'Points is required' }),
})

export const sendActivity = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = sendActivityBody.parse(request.body)

  const exercisesRef = doc(FIREBASE_DB, 'exercises', body.user_id);
  const exerciseDocSnapshot = await getDoc(exercisesRef);

  const existingData: IExercise[] = exerciseDocSnapshot.data()?.data

  const currentDate = Timestamp.fromDate(new Date())
  const lastDate = existingData?.[existingData?.length - 1]?.date

  const passedTimeFromLastRegister = lastDate ? currentDate.seconds - lastDate.seconds : 0


  if (passedTimeFromLastRegister > EXPIRED_ACTIVITY_SECONDS || !existingData?.length) {
    const newData: IExercise = {
      points: body.points,
      power: body.power,
      date: currentDate,
    }

    await setDoc(exercisesRef, { data: arrayUnion(newData) }, { merge: true });
    await updateUserData(body.user_id, body.points, body.power)

    return reply.code(201).send({ message: `New activity created at ${currentDate.toDate()}` })
  }

  const lastRegisteredActivity = existingData[existingData?.length - 1]

  lastRegisteredActivity.points = lastRegisteredActivity.points + body.points
  lastRegisteredActivity.power = lastRegisteredActivity.power + body.power
  lastRegisteredActivity.date = currentDate

  await setDoc(exercisesRef, { data: existingData }, { merge: true });
  await updateUserData(body.user_id, body.points, body.power)

  return reply.code(200).send({ message: `Activity updated at ${currentDate.toDate()}` })
}