// @flow


/**
 * Sanitizes the given string to improve search performance.
 *
 * This removes the case, accents, spaces and underscores.
 *
 * @param str The string to sanitize
 * @return {string} The sanitized string
 */
export function sanitizeString(str: string): string {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "")
        .replace(/_/g, "");
}

/**
 * Checks if the given string matches the query.
 *
 * @param str The string to check
 * @param query The query string used to find a match
 * @returns {boolean}
 */
export function stringMatchQuery(str: string, query: string) {
    return sanitizeString(str).includes(sanitizeString(query));
}

/**
 * Checks if the given arrays have an item in common
 *
 * @param filter The filter array
 * @param categories The item's categories tuple
 * @returns {boolean} True if at least one entry is in both arrays
 */
export function isItemInCategoryFilter(filter: Array<number>, categories: [number, number]) {
    for (const category of categories) {
        if (filter.indexOf(category) !== -1)
            return true;
    }
    return false;
}
