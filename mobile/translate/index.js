import { getConfig } from "../config";

const translateWrap = (str = '') => {
    const { language } = getConfig() || {}
    let res = str;
    const translateDATA = require("./global.translate.static.json");
    res = translateDATA[str] ? translateDATA[str][language] : str;
    return (res || '')
}
export default translateWrap