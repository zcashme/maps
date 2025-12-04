import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const CHUNK_SIZE = 500;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function loadCities() {
  return new Promise((resolve) => {
    const cities = [];
    fs.createReadStream("worldcities.csv")
      .pipe(csv())
      .on("data", (row) => {
        cities.push({
          city: row.city,
          country: row.country,
          lat: parseFloat(row.lat),
          lon: parseFloat(row.lng),
        });
      })
      .on("end", () => resolve(cities));
  });
}

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) {
    out.push(array.slice(i, i + size));
  }
  return out;
}

async function run() {
  console.log("Loading cities...");
  const cities = await loadCities();

  console.log("Fetching zcashers...");
  const { data: zcashers, error } = await supabase
    .from("zcasher")
    .select("id");

  if (error) {
    console.error("Supabase error:", error);
    process.exit(1);
  }

  console.log(`Total zcashers: ${zcashers.length}`);

  const rows = zcashers.map((z) => {
    const c = cities[Math.floor(Math.random() * cities.length)];
    return {
      zcasher_id: z.id,
      city: c.city,
      country: c.country,
      lat: c.lat,
      lon: c.lon,
    };
  });

  console.log("Preparing batches...");
  const batches = chunk(rows, CHUNK_SIZE);

  console.log(`Total batches: ${batches.length}`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    const { error: upsertError } = await supabase
      .from("zcasher_map_data")
      .upsert(batch);

    if (upsertError) {
      console.error("Batch error:", upsertError);
      process.exit(1);
    }

    console.log(`Batch ${i + 1}/${batches.length} inserted`);
  }

  console.log("DONE: map data populated.");
}

run();
