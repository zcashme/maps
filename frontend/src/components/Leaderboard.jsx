import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCityClusters } from "../hooks/useCityClusters";
import { getTopCities } from "../utils/stats";
import { toSlug } from "../utils/slugs";
import "./Leaderboard.css";

export default function Leaderboard() {
    const { data: clusters } = useCityClusters();
    const topCities = useMemo(() => getTopCities(clusters, 3), [clusters]);

    if (topCities.length === 0) return null;

    return (
        <div className="leaderboard">
            <h3>Top Cities</h3>
            <ol className="leader-list">
                {topCities.map((c, i) => (
                    <li key={`${c.city}-${c.country}`} title={`${c.city}, ${c.country}: ${c.count} users`}>
                        <Link to={`/${toSlug(c.country)}/${toSlug(c.city)}`} className="leader-link">
                            <span className="rank">#{i + 1}</span>
                            <span className="city">{c.city}</span>
                            <span className="count">{c.count}</span>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}
