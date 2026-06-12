import dayjs from "dayjs";
import { IDateProvider } from "./IDateProvider.js";

export class DayjsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return dayjs().add(days, "day").toDate();
  }
}