import { User } from "../models/User";

export class MapperService {
    public static mapDataToUserArray = (data: string[][]): User[] => {
        return data.map(row => ({
            id: row[0],
            email: row[1],
            createdAt: parseInt(row[2])
        } as User))
    }

    public static mapUserToArray = (user: User): string[] => {
        return [user.id, user.email, user.createdAt.toString()];
    }
}
