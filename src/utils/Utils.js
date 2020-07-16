// @flow


/**
 * Gets a sublist of the given list with items of the given ids only
 *
 * The given list must have a field id or key
 *
 * @param idList The ids of items to find
 * @param originalList The original list
 * @returns {[]}
 */
export function getSublistWithIds(
    idList: Array<string>,
    originalList: Array<{ key: string, [key: string]: any }>
): Array<{ key: string, [key: string]: any }> {
    let subList = [];
    for (let i = 0; i < subList.length; i++) {
        subList.push(null);
    }
    let itemsAdded = 0;
    for (let i = 0; i < originalList.length; i++) {
        const item = originalList[i];
        if (idList.includes(item.key)) {
            subList[idList.indexOf(item.key)] = item;
            itemsAdded++;
            if (itemsAdded === idList.length)
                break;
        }
    }
    for (let i = 0; i < subList.length; i++) {
        if (subList[i] == null)
            subList.splice(i, 1);
    }

    return subList;
}
