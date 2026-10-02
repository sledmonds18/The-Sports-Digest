    "use client";

    import type { MenuScreen } from "./SportsMenuScreens";

    interface SportsCategoriesProps {
    onSportSelect: (screen: MenuScreen) => void;
    }

    export function SportsCategories({
    onSportSelect,
    }: SportsCategoriesProps) {
    const sports: [MenuScreen, string][] = [
        ["football", "⚽ Football"],
        ["basketball", "🏀 Basketball"],
        ["tennis", "🎾 Tennis"],
        ["boxing", "🥊 Boxing"],
        ["athletics", "🏃 Athletics"],
        ["f1", "🏎 Formula 1"],
        ["volleyball", "🏐 Volleyball"],
        ["cricket", "🏏 Cricket"],
        ["american-football", "🏈 NFL"],
        ["baseball", "⚾ Baseball"],
    ];

    return (
        <nav
        className="sports-category-bar"
        aria-label="Sports categories"
        >
        <div className="sports-category-inner">
            {sports.map(([screen, label]) => (
            <button
                key={screen}
                className="sports-category-link"
                onClick={() => onSportSelect(screen)}
            >
                {label}
            </button>
            ))}
        </div>
        </nav>
    );
    }