export type OptionParams<T> = {
    token: string;
    method: "get"
} | {
    token: string;
    method: "post",
    payload?: T
}

export class ApiService {
    private static createOptions<T>(option: OptionParams<T>): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: option.method,
            contentType: "application/json",
            headers: {
                Authorization: `Bearer ${option.token}`
            },
            muteHttpExceptions: true
        };

        if (option.method === "post") {
            return {
                ...options,
                payload: JSON.stringify(option.payload)
            }
        }

        return options;
    }

    public static fetch<T>(
        url: string,
        option: OptionParams<T>
    ): GoogleAppsScript.URL_Fetch.HTTPResponse {
        const options = this.createOptions(option);
        return UrlFetchApp.fetch(url, options);
    }
}