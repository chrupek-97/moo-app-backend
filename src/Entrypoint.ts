import { UserService } from "./services/UserService";

type Endpoint = "create-user" | "update-user" | "read-users" | "delete-user" | "get-user";

function doPost(e: any) {
    const url = e.parameter.url as Endpoint;
    const data = e.postData.contents;

    if (url.includes("user")) {
        const userService = UserService.getInstance();

        switch (url) {
            case "create-user":
                userService.createUser(data);
                break;
            case "update-user":
                userService.editUser(data)
                break;
            case "read-users":
                userService.getUser(data);
                break;
            case "delete-user":
                userService.deleteUser(data);
                break;
            default:
                break;
        }
    }

}