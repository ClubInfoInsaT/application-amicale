


/**
 * Sanitizes the given string to improve search performance
 *
 * @param str The string to sanitize
 * @return {string} The sanitized string
 */
export function sanitizeString(str: string): string {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(" ", "");
}

export function stringMatchQuery(str: string, query: string) {
    return sanitizeString(str).includes(sanitizeString(query));
}

export function isItemInCategoryFilter(filter: Array<string>, categories: Array<string>) {
    for (const category of categories) {
        if (filter.indexOf(category) !== -1)
            return true;
    }
    return false;
}
