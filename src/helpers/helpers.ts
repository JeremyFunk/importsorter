export const isClosingImport = (line: string): boolean => {
    return line.endsWith('\'') || line.endsWith('"')
}

export const getOrigin = (line: string): string => {
    let firstSep = line.indexOf('\'')
    if(firstSep === 0){
        firstSep = line.indexOf('"')
    }
    return line.substring(firstSep + 1, line.length - 1)
}
export const getImport = (line: string): string => {
    let firstSep = line.indexOf('from')
    return line.substring(6, firstSep).trim()
}