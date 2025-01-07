function makePropMap(thing) {
    let toRet = {};
    const names = Object.getOwnPropertyNames(thing.__proto__).filter(x => x !== "initialize" && x !== "constructor")
    for (const name of names) {
        toRet[name] = typeof thing[name]
    }
    return toRet;
}
copy(JSON.stringify(Object.fromEntries(Object.entries(Stores).map(([k, v]) => [k, makePropMap(v)]))))
