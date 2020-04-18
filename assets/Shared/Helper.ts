const NUMBER_SUFFIX_1 = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn", "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc",
    "NDc", "Vi", "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi", "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg",
    "NnTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd", "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq",
    "NnQq", "Sg"];

const NUMBER_SUFFIX_2 = ["", "K", "M", "B", "T", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq",
    "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz", "Aa", "Bb", "Cc", "Dd", "Ee", "Ff", "Gg", "Hh", "Ii", "Jj", "Kk", "Ll", "Mm", "Nn", "Oo", "Pp",
    "Qq", "Rr", "Ss", "Tt", "Uu", "Vv", "Ww", "Xx", "Yy", "Zz", "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ", "KK", "LL", "MM", "NN", "OO",
    "PP", "QQ", "RR", "SS", "TT", "UU", "VV", "WW", "XX", "YY", "ZZ"];

const NUMBER_SUFFIX_3 = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion",
    "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sedecillion", "septendecillion",
    "octodecillion", "novemdecillion ", "vigintillion", "unvigintillion", "duovigintillion", "trevigintillion", "quattuorvigintillion",
    "quinvigintillion", "sexvigintillion", "septenvigintillion", "octovigintillion", "novemvigintillion", "trigintillion", "untrigintillion",
    "duotrigintillion", "tretrigintillion", "quattuortrigintillion", "quintrigintillion", "sextrigintillion", "septentrigintillion",
    "octotrigintillion", "novemtrigintillion", "quadragintillion", "unquadragintillion", "duoquadragintillion", "trequadragintillion",
    "quattuorquadragintillion", "quinquadragintillion", "sexquadragintillion", "septenquadragintillion", "octoquadragintillion",
    "novemquadragintillion", "quinquagintillion", "unquinquagintillion", "duoquinquagintillion", "trequinquagintillion", "quattuorquinquagintillion",
    "quinquinquagintillion", "sexquinquagintillion", "septenquinquagintillion", "octoquinquagintillion", "novemquinquagintillion", "sexagintillion",
    "unsexagintillion", "duosexagintillion", "tresexagintillion", "quattuorsexagintillion", "quinsexagintillion", "sexsexagintillion",
    "septsexagintillion", "octosexagintillion", "octosexagintillion", "septuagintillion", "unseptuagintillion", "duoseptuagintillion",
    "treseptuagintillion", "quinseptuagintillion", "sexseptuagintillion", "septseptuagintillion", "octoseptuagintillion", "novemseptuagintillion",
    "octogintillion", "unoctogintillion", "duooctogintillion", "treoctogintillion", "quattuoroctogintillion", "quinoctogintillion", "sexoctogintillion",
    "septoctogintillion", "octooctogintillion", "novemoctogintillion", "nonagintillion", "unnonagintillion", "duononagintillion", "trenonagintillion",
    "quattuornonagintillion", "quinnonagintillion", "sexnonagintillion", "septnonagintillion", "octononagintillion", "novemnonagintillion", "centillion"];

export const MINUTE = 1000 * 60;
export const HOUR = 60 * MINUTE;

export function nf(num: number) {
    let idx = 0;
    while (num >= 1000) {
        num /= 1000;
        idx++;
    }
    num = Math.floor(num * 10) / 10;
    if (idx < NUMBER_SUFFIX_1.length) {
        return num.toLocaleString() + NUMBER_SUFFIX_1[idx];
    }
    return num.toLocaleString() + "E" + idx;
}

export function getUrlParams(): { [k: string]: string } {
    if (!CC_DEBUG) {
        return {};
    }
    const query = location.search.substr(1);
    const result = {};
    query.split("&").forEach((part) => {
        const item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

export function getHMS(t: number): [number, number, number] {
    let h = 0;
    let m = 0;
    let s = 0;
    const seconds = Math.floor(t / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (seconds < 60) {
        s = seconds;
    } else if (minutes < 60) {
        s = seconds - minutes * 60;
        m = minutes;
    } else {
        s = seconds - minutes * 60;
        m = minutes - hours * 60;
        h = hours;
    }
    return [h, m, s];
}

export function formatHMS(t: number) {
    const hms = getHMS(t);
    if (hms[0] === 0) {
        return `${pad(hms[1])}:${pad(hms[2])}`;
    }
    return `${pad(hms[0])}:${pad(hms[1])}:${pad(hms[2])}`;
}

export function formatHM(t: number) {
    const hms = getHMS(t);
    if (hms[0] === 0) {
        return `${hms[1]}m`;
    }
    return `${hms[0]}h${pad(hms[1])}m`;
}

function pad(num: number) {
    return num < 10 ? `0${num}` : num;
}

export function timeout(seconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
