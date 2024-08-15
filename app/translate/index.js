import { getConfig } from "../config";

export default function translateWrap(str = '') {
    const { languageType } = getConfig() || {} 
    return function translateInner() {
        let res = str;

        const translateDATA = require("./global.translate.static.json");
        res = translateDATA[str] ? translateDATA[str][languageType] : str;

        return (res || '')
    }
}