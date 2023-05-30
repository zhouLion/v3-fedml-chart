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

// is href link
export function isHrefLink(str: string) {
    return str.startsWith('http') || str.startsWith('www')
}

// is primary type
export function isPrimaryType(str: string) {
    return typeof str === 'string'
     || typeof str === 'number'
     || typeof str === 'boolean'
}
