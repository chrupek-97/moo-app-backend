export type CattleSex = "Samiec" | "Samica"

export type Cattle = {
    id: string;
    name?: string;
    ringNumber: string;
    sex: CattleSex;
    type: string;
    birthDate: Date;
    birthCountry: string;
    motherRingNumber: string;
}