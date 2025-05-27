const ScriptProps = {
    DatabaseId: "databaseId"
}

type ScriptKey = keyof typeof ScriptProps;

export class PropsService {
    public static getScriptProperty = (scriptKey: ScriptKey) => {
        const prop = PropertiesService.getScriptProperties().getProperty(ScriptProps[scriptKey]);
        if (!prop) throw new Error(`Cannot get script property with key ${scriptKey}`);
        return prop;
    }
}