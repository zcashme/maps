import Papa from "papaparse";

export default {
  async fetch(request, env) {
    const file = await env.ASSETS.fetch("http://assets/zks_users_with_cities.csv");
    const arrayBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(arrayBuffer);

    // FIX BOM (important)
    const cleanedCsv = csvText.replace(/^\uFEFF/, "");

    const rows = Papa.parse(cleanedCsv, { header: true }).data;

    const clusters = {};

    rows.forEach(row => {
      if (!row.city || !row.lat || !row.lon) return;

      const city = row.city;

      if (!clusters[city]) {
        clusters[city] = {
          city: row.city,
          country: row.country,
          lat: Number(row.lat),
          lon: Number(row.lon),
          users: [],
          count: 0
        };
      }

      // Add username (NOW WORKS)
      clusters[city].users.push(row.name);
      clusters[city].count = clusters[city].users.length;
    });

    return new Response(JSON.stringify(Object.values(clusters)), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
