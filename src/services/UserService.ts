import { User } from "../models/User";
import { DatabaseService, DatabaseSheets } from "./DatabaseService";
import { MapperService } from "./MapperService";

export class UserService {
    static instance: UserService;
    private dbService: DatabaseService;
    private data: string[][];

    private constructor() {
        this.dbService = DatabaseService.getInstance();
        this.data = this.dbService.getRows("Users");
    }

    public static getInstance(): UserService {
        if (UserService.instance) {
            return this.instance;
        }

        this.instance = new UserService();
        return this.instance;
    }

    public getAllUsers = () => MapperService.mapDataToUserArray(this.data);

    public createUser = (user: User) => {
        const toAdd = MapperService.mapUserToArray(user);
        this.dbService.addRow("Users", toAdd);
    }

    public deleteUser = (user: User) => {
        const findedUser = this.findUserByEmail(user.email);
        this.dbService.deleteRowById("Users", findedUser.id);
    }

    public editUser = (user: User) => {
        const toEdit = MapperService.mapUserToArray(user);
        this.dbService.editRow("Users", user.id, toEdit);
    }

    public getUser = (id: string) => {
        this.findUserById(id);
    }

    private findUserByEmail = (email: string) => {
        const allUsers = this.getAllUsers();
        const findedUser = allUsers.find(user => user.email === email);
        if (!findedUser) throw new Error(`Cannot find user with email ${email}`);
        return findedUser;
    }

    private findUserById = (id: string) => {
        const allUsers = this.getAllUsers();
        const findedUser = allUsers.find(user => user.id === id);
        if (!findedUser) throw new Error(`Cannot find user with id ${id}`);
        return findedUser;
    }
}
