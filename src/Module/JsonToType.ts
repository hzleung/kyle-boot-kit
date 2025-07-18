import { AppService, AppModel } from "../Annotation";
import { GetConfig } from "../Config";
import { IConfigServer } from "../Config/interface/IConfigServer";
import { StaticFiles } from "../utils/StaticFiles";
import utils from "../utils/utils";
import path from "path";
import fs from "fs";

@AppModel(StaticFiles)
@AppService
export class JsonToType {
    @GetConfig("Server")
    private config: IConfigServer;

    @GetConfig("rootPath")
    private rootPath: string;

    private tabLen: number = 4;
    constructor(private file: StaticFiles) {}

    toType(data: any, typeName: string, exportValue?: boolean) {
        const tempPath = utils.isEmpty(this.config.generateTypePath) ? this.config.tempPath : this.config.generateTypePath;
        const tempPathValue = path.resolve(this.rootPath, tempPath);
        const savePath = path.resolve(this.rootPath, tempPath, './export_types');
        const saveFileName = path.resolve(savePath, `${typeName}.d.ts`);
        if(utils.isArray(data)) {
            const dataTypeCode = this.toType(data[0], `${typeName}Item`, true);
            const exportTypeCode = `export type ${typeName} = Array<${typeName}Item>;`;
            const finalCode = `${dataTypeCode}\r\n${exportTypeCode}\r\n`;
            if(!exportValue) {
                this.file.checkDir(savePath, tempPathValue);
                fs.writeFileSync(saveFileName, finalCode, { encoding: "utf-8"});
            }
            return finalCode;
        } else if(utils.isObject(data)){
            const SaveSubTypeList = [];
            const SaveInterfaceCode = this.objToType(data, typeName, SaveSubTypeList, null, true);
            const code = `${SaveSubTypeList.join('\r\n')}\r\n${SaveInterfaceCode}`
          
            if(!exportValue) {
                this.file.checkDir(savePath, tempPathValue);
                fs.writeFileSync(saveFileName, code, { encoding: "utf-8"});
            }
            return code;
        }
    }
    private objToType(data: Object, name: string, subTypeList: string[], topKey?: string, shouldExport: boolean = false) {
        const exportCode = shouldExport ? "export " : "";
        const typeCodeList: string[] = [
            `${exportCode}interface ${name} {`
        ];
        const attributeCodeList: string[] = [];
        const elementBefore = " ".repeat(this.tabLen);
        const keyList = Object.keys(data);
        const keyMaxLen = this.getKeyMaxLen(keyList);
        keyList.forEach((key: string) => {
            const obj = data[key];
            const keyFillSpace = this.getKeyFillSpace(keyMaxLen, key);
            if(utils.isArray(obj)) {
                // Array
                const SubTypeName = key.substring(0,1).toUpperCase() + key.substring(1);
                const SubTypeNameAll = !utils.isEmpty(topKey) ? `${topKey}_${SubTypeName}` : SubTypeName;
                const SubInterfaceName = `I${SubTypeNameAll}`;
                const SubTypeCode = this.objToType(obj[0], SubInterfaceName, subTypeList);
                subTypeList.push(SubTypeCode);
                attributeCodeList.push(`${elementBefore}${key}${keyFillSpace}: Array<${SubInterfaceName}>;`);
            } else if(utils.isObject(obj)) {
                // Object
                const SubTypeName = key.substring(0,1).toUpperCase() + key.substring(1);
                const SubTypeNameAll = !utils.isEmpty(topKey) ? `${topKey}_${SubTypeName}` : SubTypeName;
                const SubInterfaceName = `I${SubTypeNameAll}`;
                const SubTypeCode = this.objToType(obj, SubInterfaceName, subTypeList);
                subTypeList.push(SubTypeCode);
                attributeCodeList.push(`${elementBefore}${key}${keyFillSpace}: ${SubInterfaceName};`);
            } else if(utils.isString(obj)) {
                attributeCodeList.push(`${elementBefore}${key}${keyFillSpace}: String;`);
            } else if(utils.isNumber(obj)) {
                attributeCodeList.push(`${elementBefore}${key}${keyFillSpace}: Number;`);
            } else if(utils.isBoolean(obj)) {
                attributeCodeList.push(`${elementBefore}${key}${keyFillSpace}: Boolean;`);
            }
        });
        typeCodeList.push(...attributeCodeList.sort());
        typeCodeList.push("}");
        return typeCodeList.join("\r\n") + "\r\n";
    }
    private getKeyMaxLen(keys: string[]) {
        let maxLen = 0;
        keys.forEach((key) => {
            if(key.length > maxLen) {
                maxLen = key.length;
            }
        });
        return maxLen + 1;
    }
    private getKeyFillSpace(maxLen: number, key: string) {
        const fillLen = maxLen - key.length;
        return fillLen > 0 ? " ".repeat(fillLen) : "";
    }
}
