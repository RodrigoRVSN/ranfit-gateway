import { FastifyReply, FastifyRequest } from "fastify"
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore"
import { z } from 'zod'
import { FIREBASE_DB } from "../config/firebase"
import { IUser } from "../@types/IUser"

type DataType = {
  points: number;
  power: number;
  date: string;
}

const sendActivityBody = z.object({
  user_id: z.string({ required_error: 'User ID is required' }),
  power: z.number({ required_error: 'Power is required' }),
  points: z.number({ required_error: 'Points is required' }),
})

const updateUserPoints = async (userId: string, newPoints: number) => {
  const usersRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnapshot = await getDoc(usersRef)
  const userData = userDocSnapshot.data() as IUser

  const updatedPoints = newPoints + userData.points

  await setDoc(usersRef, { ...userData, points: updatedPoints }, { merge: true })
}

export const sendActivity = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = sendActivityBody.parse(request.body)

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const exercisesRef = doc(FIREBASE_DB, 'exercises', body.user_id);
  const exerciseDocSnapshot = await getDoc(exercisesRef);

  const existingData: DataType[] = exerciseDocSnapshot.data()?.data
  const exerciseDoneIndex: number = existingData?.findIndex((item: DataType) => item.date === currentDate)

  if (exerciseDoneIndex === -1 || exerciseDoneIndex === undefined) {
    const newData: DataType = {
      points: body.points,
      power: body.power,
      date: currentDate,
    }

    await setDoc(exercisesRef, { data: arrayUnion(newData) }, { merge: true });
    await updateUserPoints(body.user_id, body.points)

    return reply.code(201).send({ message: `Activity registered at ${currentDate}` })
  }

  const updatedData = { ...existingData[exerciseDoneIndex] };
  updatedData.points += body.points;
  updatedData.power += body.power;

  existingData[exerciseDoneIndex] = updatedData;

  await setDoc(exercisesRef, { data: existingData }, { merge: true });
  await updateUserPoints(body.user_id, body.points)

  return reply.code(200).send({ message: `Activity progress updated at ${currentDate}` })
}