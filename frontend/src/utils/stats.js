/**
 * @typedef {Object} Cluster
 * @property {string} city
 * @property {string} country
 * @property {number} count
 */

/**
 * Get the top N cities by user count.
 * @param {Cluster[]} clusters 
 * @param {number} limit 
 * @returns {Cluster[]}
 */
export function getTopCities(clusters, limit = 3) {
    if (!clusters || clusters.length === 0) return [];

    return [...clusters]
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}
