
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export function useCityClusters() {
  const [data, setData] = useState([]);      // clusters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1) fetch all map rows (location data)
        const { data: mapRows, error: mapError } = await supabase
          .from("zcasher_map_data")
          .select("zcasher_id, city, country, lat, lon");

        if (mapError) throw mapError;

        // 2) fetch all zcashers with profile/card fields
const { data: profiles, error: profileError } = await supabase
  .from("zcasher_with_referral_rank")
  .select(`
    id,
    name,
    slug,
    category,
    created_at,
    profile_image_url,
    verified_links_count,
    address_verified,
    featured,
    referral_rank,
    rank_alltime,
    rank_weekly,
    rank_monthly,
    rank_daily
  `);

        if (profileError) throw profileError;

        // 3) index profiles by id for quick lookup
        const profileById = new Map();
        for (const p of profiles) {
          profileById.set(p.id, p);
        }

        // 4) build clusters: group by city+country
        const clusterMap = new Map();

        for (const row of mapRows) {
          const p = profileById.get(row.zcasher_id);
          if (!p) continue; // skip if no matching profile

          const key = `${row.city}::${row.country}`;
          let cluster = clusterMap.get(key);
          if (!cluster) {
            cluster = {
              city: row.city,
              country: row.country,
              lat: row.lat,
              lon: row.lon,
              users: [],
            };
            clusterMap.set(key, cluster);
          }
cluster.users.push({
  id: p.id,
  name: p.name,
  category: p.category || "BUnknown Success",
  profileurl: `https://zcash.me/${p.slug}`,
  profile_image_url: p.profile_image_url,
  verified_links_count: p.verified_links_count,
  address_verified: p.address_verified,
  featured: p.featured,

  created_at: p.created_at,   // ⭐ add this

  referral_rank: p.referral_rank,
  rank_alltime: p.rank_alltime,
  rank_weekly: p.rank_weekly,
  rank_monthly: p.rank_monthly,
  rank_daily: p.rank_daily,
});


        }

        // 5) finalize clusters with count field
        const clusters = Array.from(clusterMap.values()).map((c) => ({
          ...c,
          count: c.users.length,
        }));

        setData(clusters);
        setError(null);
      } catch (err) {
        console.error("Error loading clusters from Supabase:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading, error };
}
