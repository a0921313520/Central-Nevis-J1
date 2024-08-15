import { getConfig } from "../config";

const translateWrap = (str = '') => {
    const { languageType } = getConfig() || {}
    let res = str;
    const translateDATA = require("./global.translate.static.json");
    res = translateDATA[str] ? translateDATA[str][languageType] : str;
    return (res || '')
}
export default translateWrap