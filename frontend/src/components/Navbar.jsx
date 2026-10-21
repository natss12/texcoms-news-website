import { useEffect, useRef, useState } from "react";
import DateRangeCalendar from "./DateRangeCalendar.jsx";

const categories = ["all", "Markets", "World", "Technology", "Business", "National", "Delhi", "Science", "Sports"];
const datePresets = [
  { id: "all", label: "Any date" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

function Navbar({ onSearch, filters, onFiltersChange }) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const controlsRef = useRef(null);
  const activeTopicCount = Number(filters.category !== "all");
  const selectedDateLabel = datePresets.find((preset) => preset.id === filters.datePreset)?.label ?? "Custom dates";

  useEffect(() => {
    if (!topicsOpen && !dateOpen && !calendarOpen) return undefined;

    function handlePointerDown(event) {
      if (!controlsRef.current?.contains(event.target)) {
        setTopicsOpen(false);
        setDateOpen(false);
        setCalendarOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setTopicsOpen(false);
        setDateOpen(false);
        setCalendarOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [topicsOpen, dateOpen, calendarOpen]);

  function selectDatePreset(datePreset) {
    onFiltersChange({ ...filters, datePreset, dateRange: { from: null, to: null } });
    setDateOpen(false);
  }

  function clearTopics() {
    onFiltersChange({ ...filters, category: "all" });
  }

  function clearDate() {
    onFiltersChange({ ...filters, datePreset: "all", dateRange: { from: null, to: null } });
    setDateOpen(false);
    setCalendarOpen(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    onSearch(search.trim());
    document.querySelector("#blog-posts")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="site-header">
      <nav className="site-nav page-width" aria-label="Main navigation">
        <a className="site-nav__brand" href="#home">
          <span className="site-nav__mark" aria-hidden="true">N</span>
          NewsPulse
        </a>
        <div className="site-nav__content">
          <div className="nav-actions">
            <form className="nav-search" role="search" onSubmit={submitSearch}>
              <label className="visually-hidden" htmlFor="article-search">Search stories</label>
              <input
                id="article-search"
                type="search"
                placeholder="Search stories"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit" aria-label="Search stories">
                <span aria-hidden="true">⌕</span>
              </button>
            </form>
            <div className="header-filter-controls" ref={controlsRef}>
              <div className="story-filter header-option">
                <button
                  className={`story-filter__trigger${topicsOpen ? " is-open" : ""}`}
                  type="button"
                  aria-expanded={topicsOpen}
                  aria-controls="topic-filter-panel"
                  onClick={() => {
                    setTopicsOpen(!topicsOpen);
                    setDateOpen(false);
                    setCalendarOpen(false);
                  }}
                >
                  <span className="filter-mark" aria-hidden="true"><i /><i /><i /></span>
                  <span>Filters</span>
                  {activeTopicCount > 0 && <span className="story-filter__count">{activeTopicCount}</span>}
                </button>
                {topicsOpen && (
                  <div className="story-filter__panel" id="topic-filter-panel" aria-label="Filter stories by topic">
                    <div className="story-filter__heading">
                      <div>
                        <p className="eyebrow">Story themes</p>
                        <h2>Topics</h2>
                      </div>
                      <button className="story-filter__clear" type="button" onClick={clearTopics}>Clear</button>
                    </div>
                    <fieldset className="story-filter__group">
                      <legend>Choose a topic</legend>
                      <div className="story-filter__options">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            className={filters.category === category ? "is-active" : ""}
                            aria-pressed={filters.category === category}
                            onClick={() => onFiltersChange({ ...filters, category })}
                          >
                            {category === "all" ? "All topics" : category}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>

              <div className="date-filter header-option">
                <button
                  className={`date-filter__trigger${dateOpen ? " is-open" : ""}`}
                  type="button"
                  aria-expanded={dateOpen}
                  aria-controls="date-filter-panel"
                  onClick={() => {
                    setDateOpen(!dateOpen);
                    setTopicsOpen(false);
                    setCalendarOpen(false);
                  }}
                >
                  <span>Date</span>
                  <span className="date-filter__value">{selectedDateLabel}</span>
                </button>
                {dateOpen && (
                  <div className="date-filter__panel" id="date-filter-panel" aria-label="Filter stories by date">
                    <div className="date-filter__heading">
                      <h2>Publication date</h2>
                      <button type="button" onClick={clearDate}>Clear</button>
                    </div>
                    <div className="date-filter__options">
                      {datePresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className={filters.datePreset === preset.id ? "is-active" : ""}
                          aria-pressed={filters.datePreset === preset.id}
                          onClick={() => selectDatePreset(preset.id)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="range-filter header-option">
                <button
                  className={`range-filter__trigger${filters.datePreset === "range" ? " is-active" : ""}${calendarOpen ? " is-open" : ""}`}
                  type="button"
                  aria-expanded={calendarOpen}
                  aria-controls="range-calendar-panel"
                  onClick={() => {
                    setCalendarOpen(!calendarOpen);
                    setTopicsOpen(false);
                    setDateOpen(false);
                  }}
                >
                  <span aria-hidden="true">▦</span>
                  <span>Date range</span>
                </button>
                {calendarOpen && (
                  <div className="range-filter__panel" id="range-calendar-panel">
                    <DateRangeCalendar
                      compact
                      selectedRange={filters.dateRange}
                      onSelect={(dateRange) => onFiltersChange({ ...filters, datePreset: "range", dateRange })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;