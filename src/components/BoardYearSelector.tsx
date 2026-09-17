import { useEffect, type JSX } from "react";
import { useBoardYearsQuery } from "../hooks";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BoardYearSelectorProps {
  /** Called whenever the user picks a valid year */
  onYearChange: (year: string) => void;
  /** The currently active year (controlled) */
  selectedYear: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * BoardYearSelector
 *
 * Fetches the list of available board years from the API and renders a
 * styled <select> the parent can use to re-drive the board data fetch.
 *
 * Usage:
 *   const [year, setYear] = useState(new Date().getFullYear().toString());
 *
 *   <BoardYearSelector selectedYear={year} onYearChange={setYear} />
 *
 *   const { data } = useFetch("/api/v1/board", {
 *     queryParams: { yearFrom: year, memberType: "officer,technical,operation,branding" },
 *   });
 */
const BoardYearSelector = ({
  onYearChange,
  selectedYear,
}: BoardYearSelectorProps): JSX.Element => {
  // Fetch the available years from the API.
  const { data: years = [], isLoading, error } = useBoardYearsQuery();

  // Auto-select the first year if none is selected yet and data has arrived
  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      onYearChange(years[0]);
    }
  }, [years, selectedYear, onYearChange]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
        <span className="inline-block w-4 h-4 border-2 border-[#05568D] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading years…</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 font-medium">
        Failed to load years: {error.message}
      </p>
    );
  }

  if (years.length === 0) {
    return <p className="text-sm text-gray-500">No board years available.</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="board-year-select"
        className="text-sm font-semibold text-gray-700 whitespace-nowrap"
      >
        Board Year:
      </label>

      <div className="relative">
        <select
          id="board-year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 pr-9 pl-3 text-sm font-medium text-gray-800 shadow-sm cursor-pointer transition duration-200 hover:border-[#05568D] focus:outline-none focus:ring-2 focus:ring-[#05568D] focus:border-transparent"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {Number.parseInt(year, 10) - 1} - {year}
            </option>
          ))}
        </select>

        {/* Custom chevron — replaces the browser's default arrow */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default BoardYearSelector;
