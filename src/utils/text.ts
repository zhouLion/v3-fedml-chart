// truncate text
export function truncate(str: string, num = 10) {
    if (!str) {
        return ''
    }
    else {
        if (str.length > num) {
            return `${str.slice(0, num)}...`
        }
        return str
    }
}
