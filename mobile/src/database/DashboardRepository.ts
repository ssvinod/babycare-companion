import { db } from "./database";
export interface DashboardSummary {
  todayFeedings:number;
  todayQuantity:number;
  lastFeeding:string|null;
  latestWeight:number|null;
  nextVaccine:string|null;
  nextVaccineDate:string|null;
  nextSleep: string | null;
  nextSleepTime: string | null;
}
export default class DashboardRepository{
  getSummary():DashboardSummary{
    const today =
      new Date().toISOString().split("T")[0];
    const feedings=
      db.getFirstSync<any>(`
        SELECT
        COUNT(*) count,
        COALESCE(SUM(quantity),0)
        quantity
        FROM feeding
        WHERE date(time)=?
      `,[today]);
    const latest=
      db.getFirstSync<any>(`
        SELECT time
        FROM feeding
        ORDER BY time DESC
        LIMIT 1
      `);
    const growth=
      db.getFirstSync<any>(`
        SELECT weight
        FROM growth
        ORDER BY date DESC
        LIMIT 1
      `);
    const vaccine=
      db.getFirstSync<any>(`
        SELECT
        vaccine,
        dueDate
        FROM vaccination
        WHERE completed=0
        ORDER BY dueDate ASC
        LIMIT 1
      `);
    const latestSleep = db.getFirstSync<any>(`
      SELECT endTime
      FROM sleep
      ORDER BY endTime DESC
      LIMIT 1
      `);
    let predictedNap: string | null = null;
    if (latestSleep?.endTime) {
      const nap = new Date(latestSleep.endTime);
      // simple prediction
      nap.setHours(nap.getHours() + 2);
      predictedNap = nap.toISOString();
    }
    return{
      todayFeedings:
      feedings?.count??0,
      todayQuantity:
      feedings?.quantity??0,
      lastFeeding:
      latest?.time??null,
      latestWeight:
      growth?.weight??null,
      nextVaccine:
      vaccine?.vaccine??null,
      nextVaccineDate:
      vaccine?.dueDate??null,
      nextSleep: "Nap",
      nextSleepTime: predictedNap,
    };
  }
}