import { Cattle, CattleSex } from "../models/Cattle";
import { User } from "../models/User";

export class MapperService {
    public static mapDataArrayToUser(data: string[][]): User[] {
        return data.map(row => ({
            id: row[0],
            email: row[1],
            createdAt: parseInt(row[2])
        } as User));
    }

    public static mapUserToArray(user: User): string[] {
        return [user.id,
        user.email,
        user.createdAt.toString()]
    }

    public static mapDataArrayToCattle(data: string[][]): Cattle[] {
        return data.map(row => ({
            id: row[0],
            ringNumber: row[1],
            name: row[2] || "",
            type: row[3],
            sex: row[4] as CattleSex,
            birthDate: new Date(row[5]),
            birthCountry: row[6],
            motherRingNumber: row[7],
        } as Cattle));
    }

    public static mapCattleToArray(cattle: Cattle): string[] {
        return [cattle.id,
        cattle.ringNumber,
        cattle.name || "",
        cattle.type,
        cattle.sex,
        cattle.birthDate.getTime().toString(),
        cattle.birthCountry,
        cattle.motherRingNumber];
    }
}
