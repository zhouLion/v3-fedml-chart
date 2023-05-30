// group list by field
export function groupBy<T extends Record<string, never>>(
    list: T[],
    field: string,
) {
    return list.reduce<Record<string, T[]>>((acc, item) => {
        const key = item[field]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {})
}

// unique list by specific field
export function uniqueBy<T extends Record<string, never>>(
    list: T[],
    field: string,
): T[] {
    return list.reduce<T[]>((acc, item) => {
        if (!acc.some(i => i[field] === item[field])) {
            acc.push(item)
        }
        return acc
    }, [])
}
