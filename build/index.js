'use strict';

const ScriptProps = {
  DatabaseId: "databaseId"
};
class PropsService {
  static getScriptProperty(scriptKey) {
    const prop = PropertiesService.getScriptProperties().getProperty(ScriptProps[scriptKey]);
    if (!prop) throw new Error(`Cannot get script property with key ${scriptKey}`);
    return prop;
  }
}

class DatabaseService {
  constructor() {
    const spreadsheetDbId = PropsService.getScriptProperty("DatabaseId");
    this.spreadsheetDb = SpreadsheetApp.openById(spreadsheetDbId);
  }
  static getInstance() {
    if (DatabaseService.instance) {
      return this.instance;
    }
    this.instance = new DatabaseService();
    return this.instance;
  }
  getSheetByName(sheetName) {
    const sheet = this.spreadsheetDb.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Cannot get data for sheet with name ${sheetName} because sheet with this name not exists.`);
    return sheet;
  }
  getRows(sheetName) {
    const sheet = this.getSheetByName(sheetName);
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    if (lastRow <= 1) return [];
    return sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  }
  addRow(sheetName, data) {
    const sheet = this.getSheetByName(sheetName);
    sheet.appendRow(data.map(it => `'${it}`));
  }
  editRow(sheetName, id, data) {
    const sheet = this.getSheetByName(sheetName);
    const lastColumn = sheet.getLastColumn();
    const findedRow = this.findRowById(sheetName, id);
    const range = sheet.getRange(findedRow.getRow() + 1, 1, 1, lastColumn);
    range.setValues([data]);
  }
  deleteRowById(sheetName, id) {
    const sheet = this.getSheetByName(sheetName);
    const findedRow = this.findRowById(sheetName, id);
    sheet.deleteRow(findedRow.getRow());
  }
  findRowById(sheetName, id) {
    const sheet = this.getSheetByName(sheetName);
    const findedRow = sheet.createTextFinder(id).findNext();
    if (!findedRow) throw new Error(`Cannot find row with id: ${id}.`);
    return findedRow;
  }
}

class MapperService {
  static mapDataArrayToUser(data) {
    return data.map(row => ({
      id: row[0],
      email: row[1],
      createdAt: parseInt(row[2])
    }));
  }
  static mapUserToArray(user) {
    return [user.id, user.email, user.createdAt.toString()];
  }
  static mapDataArrayToCattle(data) {
    return data.map(row => ({
      id: row[0],
      ringNumber: row[1],
      name: row[2] || "",
      type: row[3],
      sex: row[4],
      birthDate: new Date(row[5]),
      birthCountry: row[6],
      motherRingNumber: row[7]
    }));
  }
  static mapCattleToArray(cattle) {
    return [cattle.id, cattle.ringNumber, cattle.name || "", cattle.type, cattle.sex, cattle.birthDate.getTime().toString(), cattle.birthCountry, cattle.motherRingNumber];
  }
}

class CattleService {
  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.data = this.dbService.getRows("Cattle");
  }
  static getInstance() {
    if (CattleService.instance) {
      return this.instance;
    }
    this.instance = new CattleService();
    return this.instance;
  }
  getAllCattle() {
    return MapperService.mapDataArrayToCattle(this.data);
  }
  createCattle(cattle) {
    const toAdd = MapperService.mapCattleToArray(cattle);
    this.dbService.addRow("Cattle", toAdd);
  }
  deleteCattle(id) {
    this.dbService.deleteRowById("Cattle", id);
  }
  editCattle(cattle) {
    const toEdit = MapperService.mapCattleToArray(cattle);
    this.dbService.editRow("Cattle", cattle.id, toEdit);
  }
  getCattle(id) {
    this.findCattleById(id);
  }
  findCattleById(id) {
    const allCattle = this.getAllCattle();
    const findedCattle = allCattle.find(cattle => cattle.id === id);
    if (!findedCattle) throw new Error(`Cannot find cattle with id ${id}`);
    return findedCattle;
  }
}

class ResponseService {
  static createResponse(response) {
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
}

class UserService {
  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.data = this.dbService.getRows("Users");
  }
  static getInstance() {
    if (UserService.instance) {
      return this.instance;
    }
    this.instance = new UserService();
    return this.instance;
  }
  getAllUsers() {
    return MapperService.mapDataArrayToUser(this.data);
  }
  createUser(user) {
    const toAdd = MapperService.mapUserToArray(user);
    this.dbService.addRow("Users", toAdd);
  }
  deleteUser(id) {
    const findedUser = this.findUserById(id);
    this.dbService.deleteRowById("Users", findedUser.id);
  }
  editUser(user) {
    const toEdit = MapperService.mapUserToArray(user);
    console.log(toEdit + " toEdit");
    this.dbService.editRow("Users", user.id, toEdit);
  }
  getUser(id) {
    return this.findUserById(id);
  }
  isAuthenticated(userEmail) {
    return this.getAllUsers().some(usr => usr.email === userEmail);
  }
  findUserById(id) {
    const allUsers = this.getAllUsers();
    const findedUser = allUsers.find(user => user.id === id);
    if (!findedUser) throw new Error(`Cannot find user with id ${id}`);
    return findedUser;
  }
}

function doPost(e) {
  const url = e.parameter.url;
  const data = e.postData.contents;
  const defaultResponse = {
    status: "success",
    statusCode: 200,
    message: "",
    data: null
  };
  if (url.includes("User")) {
    const userService = UserService.getInstance();
    const parsedData = JSON.parse(data);
    switch (url) {
      case "createUser":
        userService.createUser(parsedData);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 201,
          message: "User has been created"
        });
      case "editUser":
        userService.editUser(parsedData);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "User has been edited"
        });
      case "deleteUser":
        userService.deleteUser(parsedData.id);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "User has been deleted"
        });
      case "isUserAuthenticated":
        const isAuthenticated = userService.isAuthenticated(parsedData.email);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: `${isAuthenticated ? "User has been authenticated" : "User has not been authenticated"}`,
          data: {
            isAuthenticated
          }
        });
      default:
        break;
    }
  }
  if (url.includes("cattle")) {
    const cattleService = CattleService.getInstance();
    const parsedData = JSON.parse(data);
    switch (url) {
      case "createCattle":
        cattleService.createCattle(parsedData);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 201,
          message: "User has been created"
        });
      case "editCattle":
        cattleService.editCattle(parsedData);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "User has been edited"
        });
      case "deleteCattle":
        cattleService.deleteCattle(parsedData);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "User has been deleted"
        });
      default:
        break;
    }
  }
}
function doGet(e) {
  const url = e.parameter.url;
  const id = e.parameter.id;
  const defaultResponse = {
    status: "success",
    statusCode: 200,
    message: "",
    data: null
  };
  if (url.includes("User")) {
    const userService = UserService.getInstance();
    switch (url) {
      case "getUser":
        const user = userService.getUser(id);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "User has been retreived",
          data: {
            user
          }
        });
      default:
        break;
    }
  }
  if (url.includes("Cattle")) {
    const cattleService = CattleService.getInstance();
    switch (url) {
      case "getCattle":
        const cattle = cattleService.getCattle(id);
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "Cattle has been retrived",
          data: {
            cattle
          }
        });
      case "getAllCattle":
        const allCattle = cattleService.getAllCattle();
        return ResponseService.createResponse({
          ...defaultResponse,
          statusCode: 200,
          message: "List of cattle has been retrived",
          data: {
            cattle: allCattle
          }
        });
      default:
        break;
    }
  }
}
