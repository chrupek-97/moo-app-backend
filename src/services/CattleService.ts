import { Cattle } from "../models/Cattle";
import { DatabaseService } from "./DatabaseService";
import { MapperService } from "./MapperService";

export class CattleService {
    static instance: CattleService;
    private dbService: DatabaseService;
    private data: string[][];

    private constructor() {
        this.dbService = DatabaseService.getInstance();
        this.data = this.dbService.getRows("Cattle");
    }

    public static getInstance(): CattleService {
        if (CattleService.instance) {
            return this.instance;
        }

        this.instance = new CattleService();
        return this.instance;
    }

    public getAllCattle() {
        return MapperService.mapDataArrayToCattle(this.data);
    }

    public createCattle(cattle: Cattle) {
        const toAdd = MapperService.mapCattleToArray(cattle);
        this.dbService.addRow("Cattle", toAdd)
    }

    public deleteCattle(id: string) {
        this.dbService.deleteRowById("Cattle", id);
    }

    public editCattle(cattle: Cattle) {
        const toEdit = MapperService.mapCattleToArray(cattle);
        this.dbService.editRow("Cattle", cattle.id, toEdit);
    }

    public getCattle(id: string) {
        this.findCattleById(id);
    }

    private findCattleById(id: string) {
        const allCattle = this.getAllCattle();
        const findedCattle = allCattle.find(cattle => cattle.id === id);
        if (!findedCattle) throw new Error(`Cannot find cattle with id ${id}`);
        return findedCattle;
    }
}
