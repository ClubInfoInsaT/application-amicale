// @flow

/**
 * Gets the given services list without items of the given ids
 *
 * @param idList The ids of items to remove
 * @param sourceList The item list to use as source
 * @returns {[]}
 */
export default function getStrippedServicesList<T>(
  idList: Array<string>,
  sourceList: Array<{key: string, ...T}>,
): Array<{key: string, ...T}> {
  const newArray = [];
  sourceList.forEach((item: {key: string, ...T}) => {
    if (!idList.includes(item.key)) newArray.push(item);
  });
  return newArray;
}
