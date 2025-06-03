import { PropsService } from "./PropsService";

export const DatabaseSheets = {
    Users: "Users",
    Cattle: "Cattle",
} as const;

type DatabaseSheetKey = keyof typeof DatabaseSheets;

export class DatabaseService {
    static instance: DatabaseService;
    private spreadsheetDb: GoogleAppsScript.Spreadsheet.Spreadsheet;

    private constructor() {
        const spreadsheetDbId = PropsService.getScriptProperty("DatabaseId");
        this.spreadsheetDb = SpreadsheetApp.openById(spreadsheetDbId);
    }

    public static getInstance(): DatabaseService {
        if (DatabaseService.instance) {
            return this.instance;
        }

        this.instance = new DatabaseService();
        return this.instance;
    }

    private getSheetByName(sheetName: DatabaseSheetKey) {
        const sheet = this.spreadsheetDb.getSheetByName(sheetName);
        if (!sheet) throw new Error(`Cannot get data for sheet with name ${sheetName} because sheet with this name not exists.`);
        return sheet;
    }

    public getRows(sheetName: DatabaseSheetKey): string[][] {
        const sheet = this.getSheetByName(sheetName);
        const lastRow = sheet.getLastRow();
        const lastColumn = sheet.getLastColumn();
        if (lastRow <= 1) return [];
        return sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
    }

    public addRow(sheetName: DatabaseSheetKey, data: string[]) {
        const sheet = this.getSheetByName(sheetName);
        sheet.appendRow(data.map(it => `'${it}`));
    }

    public editRow(sheetName: DatabaseSheetKey, id: string, data: string[]) {
        const sheet = this.getSheetByName(sheetName);
        const lastColumn = sheet.getLastColumn();
        const findedRow = this.findRowById(sheetName, id);
        const range = sheet.getRange(findedRow.getRow() + 1, 1, 1, lastColumn);
        range.setValues([data]);
    }

    public deleteRowById(sheetName: DatabaseSheetKey, id: string) {
        const sheet = this.getSheetByName(sheetName);
        const findedRow = this.findRowById(sheetName, id);
        sheet.deleteRow(findedRow.getRow())
    }

    private findRowById(sheetName: DatabaseSheetKey, id: string) {
        const sheet = this.getSheetByName(sheetName);
        const findedRow = sheet.createTextFinder(id).findNext();
        if (!findedRow) throw new Error(`Cannot find row with id: ${id}.`);
        return findedRow;
    }
}

