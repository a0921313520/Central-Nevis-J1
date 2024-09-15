import { getConfig } from "../config";

//translateWrap("请输入 PIN 码，您还有 {X} 次尝试机会", { X: 8 });
const translateWrap = (str = '', values = {}) => {
    const config = getConfig() || {};
    const language = config.language || 'VN';
    let res = str;
    try {
        const translateDATA = require("./global.translate.static.json");
        // 查找翻译
        res = translateDATA[str] && translateDATA[str][language] ? translateDATA[str][language] : str;
        // 替换占位符
        res = res.replace(/\{(\w+)\}/g, (match, key) => values[key] || match);
    } catch (error) {
        console.error('Error loading translation data:', error);
    }

    return res || '';
}

export default translateWrap;
