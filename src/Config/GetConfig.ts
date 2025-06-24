import { getModuleById, getInstanceId } from "../Annotation/createInstance";
import { META_KEY_INSTANCE_ID } from "../data/constants";
import type { IConfigApplication } from "./interface";
import lodash from "lodash";

class Application {
    configuration: any = {};
}
/**
 * 获取配置信息
 * @param key - 配置Category key
 * @param id - 配置Category 下的id
 * @returns 
 */
export const GetConfig = <ConfigKey extends keyof IConfigApplication>(
    key?: ConfigKey | 'rootPath',
    id?: keyof IConfigApplication[ConfigKey]
) => {
    return function (target: any, propertyKey: string) {
        const getter = function (this: any) {
            const instanceId = getInstanceId(this);
            const applicationObj = getModuleById(instanceId, "Application");
            if (!applicationObj) {
                console.error("Application instance is not found.", this);
                return undefined;
            }

            let overrideConfigData: any;
            const configData: any = applicationObj.configuration || {};

            if (!key || lodash.isEmpty(key)) {
                overrideConfigData = configData;
            } else {
                overrideConfigData = lodash.get(configData, key);
                overrideConfigData = id && !lodash.isEmpty(id)
                    ? lodash.get(overrideConfigData, id)
                    : overrideConfigData;
            }

            return overrideConfigData;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: () => { },
            configurable: true,
            enumerable: true,
        });
    };
};


export default GetConfig;