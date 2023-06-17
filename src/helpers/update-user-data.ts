import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../config/firebase";
import { IUser } from "../@types/IUser";

const XP_GAINED_MULTIPLIER = 0.5

export const updateUserData = async (userId: string, newPoints: number, newPower: number) => {
  const usersRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnapshot = await getDoc(usersRef)
  const userData = userDocSnapshot.data() as IUser

  userData.power += newPower
  userData.points += newPoints

  const experienceGained = Math.floor(newPoints * XP_GAINED_MULTIPLIER)
  const summedExperience = userData.currentExperience + experienceGained

  const haveLevelUp = summedExperience > userData.experienceToLevelUp

  const levelsPassed = Math.floor(summedExperience / userData.experienceToLevelUp)
  userData.level += levelsPassed

  userData.currentExperience = haveLevelUp ?
    summedExperience % userData.experienceToLevelUp :
    userData.currentExperience + experienceGained

  await setDoc(usersRef, userData, { merge: true })
}
