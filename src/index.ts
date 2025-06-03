import { UserDto } from "./dto/UserDto";
import { CattleService } from "./services/CattleService";
import { ResponseService } from "./services/ResponseService";
import { SmsService } from "./services/SmsService";
import { UserService } from "./services/UserService";
import { ApiResponse } from "./types/ApiResponse";

type PostEnpoint =
    "createUser" |
    "editUser" |
    "deleteUser" |
    "isUserAuthenticated" |
    "createCattle" |
    "editCattle" |
    "deleteCattle"


type GetEndpoint =
    "getUser" |
    "getCattle" |
    "getAllCattle"

function doPost(e: GoogleAppsScript.Events.DoPost) {
    const url = e.parameter.url as PostEnpoint;
    const data = e.postData.contents;
    const defaultResponse: ApiResponse = {
        status: "success",
        statusCode: 200,
        message: "",
        data: null
    }

    if (url.includes("User")) {
        const userService = UserService.getInstance();
        const parsedData = JSON.parse(data);

        switch (url) {
            case "createUser":
                userService.createUser(parsedData);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 201,
                        message: "User has been created"
                    })
            case "editUser":
                userService.editUser(parsedData)
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "User has been edited"
                    })
            case "deleteUser":
                userService.deleteUser(parsedData.id);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "User has been deleted"
                    });
            case "isUserAuthenticated":
                const isAuthenticated = userService.isAuthenticated(parsedData.email);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: `${isAuthenticated ? "User has been authenticated" : "User has not been authenticated"}`,
                        data: { isAuthenticated }
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
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 201,
                        message: "User has been created"
                    })
            case "editCattle":
                cattleService.editCattle(parsedData);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "User has been edited"
                    })
            case "deleteCattle":
                cattleService.deleteCattle(parsedData);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "User has been deleted"
                    })
            default:
                break;
        }
    }
}

function doGet(e: GoogleAppsScript.Events.DoGet) {
    const url = e.parameter.url as GetEndpoint;
    const id = e.parameter.id;
    const defaultResponse: ApiResponse = {
        status: "success",
        statusCode: 200,
        message: "",
        data: null
    }

    if (url.includes("User")) {
        const userService = UserService.getInstance();

        switch (url) {
            case "getUser":
                const user = userService.getUser(id);
                return ResponseService
                    .createResponse<UserDto>({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "User has been retreived",
                        data: {
                            user
                        }
                    })
            default:
                break;
        }
    }

    if (url.includes("Cattle")) {
        const cattleService = CattleService.getInstance();

        switch (url) {
            case "getCattle":
                const cattle = cattleService.getCattle(id);
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "Cattle has been retrived",
                        data: {
                            cattle
                        }
                    })
            case "getAllCattle":
                const allCattle = cattleService.getAllCattle();
                return ResponseService
                    .createResponse({
                        ...defaultResponse,
                        statusCode: 200,
                        message: "List of cattle has been retrived",
                        data: {
                            cattle: allCattle
                        }
                    })
            default:
                break;
        }
    }
}