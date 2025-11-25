export function toSlug(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with -
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

export function fromSlug(slug, clusters) {
    if (!slug || !clusters) return null;
    // Try to find a city where toSlug(city.city) matches the input slug
    return clusters.find(c => toSlug(c.city) === slug) || null;
}
