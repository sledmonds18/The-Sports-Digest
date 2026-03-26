    "use client";

    import { TICKER } from "./lib/data";

    export function Ticker() {
    return (
        <div className="ticker" role="marquee" aria-label="Live sports scores">
        <div className="tlbl">Live</div>
        <div className="ttrack">
            <div className="tinner" aria-hidden="true">
            {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i}>{t}</span>
            ))}
            </div>
        </div>
        </div>
    );
    }
