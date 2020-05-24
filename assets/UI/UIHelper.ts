export function icon(name: string, size = 24, marginRight = 0, additionalStyle = {}, additionalAttrs = {}) {
    return m(
        "i.mi",
        { style: { fontSize: `${size}px`, marginRight: `${marginRight}px`, ...additionalStyle }, ...additionalAttrs },
        name
    );
}
