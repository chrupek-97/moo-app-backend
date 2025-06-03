import { ApiService, OptionParams } from "./ApiService";

export type SmsRequest = {
    to: string;
    message: string;
    from: string;
    format: "json";
}

const baseUrl = "https://api.smsapi.pl";
export class SmsService {
    public static sendSMS(smsRequest: SmsRequest) {
        const params: OptionParams<SmsRequest> = {
            token: "5QER1HZtXm0IEi2KzyWEBHZECStEELyu4H6n1Ekf",
            method: "post"
        }
        const url = `${baseUrl}/sms.do?to=48${smsRequest.to}&message=${smsRequest.message}&from=${smsRequest.from}&format=json`;
        const response = ApiService.fetch(url, params);
        console.log(response.getContentText());
        if (response.getResponseCode() !== 200) {
            console.error(response.getContentText());
            throw Error("Sms has not been sended.");
        }
        console.log(`Sms has been sended to ${smsRequest.to}.`)
    }
}