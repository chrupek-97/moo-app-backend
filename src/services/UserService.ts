import { User } from "../models/User";
import { DatabaseService } from "./DatabaseService";
import { MapperService } from "./MapperService";

export class UserService {
    static instance: UserService;
    private dbService: DatabaseService;
    private data: string[][];

    private constructor() {
        this.dbService = DatabaseService.getInstance();
        this.data = this.dbService.getRows("Users")
    }

    public static getInstance(): UserService {
        if (UserService.instance) {
            return this.instance;
        }

        this.instance = new UserService();
        return this.instance;
    }

    public getAllUsers() {
        return MapperService.mapDataArrayToUser(this.data);
    }

    public createUser(user: User) {
        const toAdd = MapperService.mapUserToArray(user);
        this.dbService.addRow("Users", toAdd);
    }

    public deleteUser(id: string) {
        const findedUser = this.findUserById(id);
        this.dbService.deleteRowById("Users", findedUser.id);
    }

    public editUser(user: User) {
        const toEdit = MapperService.mapUserToArray(user);
        console.log(toEdit + " toEdit")
        this.dbService.editRow("Users", user.id, toEdit);
    }

    public getUser(id: string) {
        return this.findUserById(id);
    }

    public isAuthenticated(userEmail: string) {
        return this.getAllUsers().some(usr => usr.email === userEmail);
    }

    private findUserById(id: string) {
        const allUsers = this.getAllUsers();
        const findedUser = allUsers.find(user => user.id === id);
        if (!findedUser) throw new Error(`Cannot find user with id ${id}`);
        return findedUser;
    }
}
