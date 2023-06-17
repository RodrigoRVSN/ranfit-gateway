import { Timestamp } from "firebase/firestore";

export type IExercise = {
  points: number;
  power: number;
  date: Timestamp;
}