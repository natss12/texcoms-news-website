import { useRef, useState } from "react";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function localDate(year, month, day) {
  return new Date(year, month, day);
}

function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return localDate(year, month - 1, day);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function makeRange(first, last) {
  return first <= last ? { from: first, to: last } : { from: last, to: first };
}

function getMonthDays(month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingDays = (localDate(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = localDate(year, monthIndex + 1, 0).getDate();
  const count = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

  return Array.from({ length: count }, (_, index) => {
    const day = index - leadingDays + 1;
    return day < 1 || day > daysInMonth ? null : localDate(year, monthIndex, day);
  });
}

function DateRangeCalendar({ selectedRange, onSelect, compact = false }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return localDate(now.getFullYear(), now.getMonth(), 1);
  });
  const [previewRange, setPreviewRange] = useState(null);
  const drag = useRef(null);
  const skipClick = useRef(false);
  const days = getMonthDays(visibleMonth);
  const shownRange = previewRange || selectedRange;
  const now = new Date();
  const today = localDate(now.getFullYear(), now.getMonth(), now.getDate());
  const monthTitle = visibleMonth.toLocaleDateString("en", { month: "long", year: "numeric" });

  function selectDate(date) {
    if (!selectedRange?.from || selectedRange.to) {
      onSelect({ from: date, to: null });
    } else {
      onSelect(makeRange(selectedRange.from, date));
    }
    setPreviewRange(null);
  }

  function dateAtPointer(event) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const key = target instanceof Element
      ? target.closest("[data-calendar-date]")?.dataset.calendarDate
      : "";
    return key ? parseDate(key) : null;
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    const date = dateAtPointer(event);
    if (date) drag.current = { anchor: date, current: date, pointerId: event.pointerId, moved: false };
  }

  function handlePointerMove(event) {
    const currentDrag = drag.current;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;
    const date = dateAtPointer(event);
    if (!date || date.getTime() === currentDrag.current.getTime()) return;
    currentDrag.current = date;
    currentDrag.moved = true;
    setPreviewRange(makeRange(currentDrag.anchor, date));
  }

  function handlePointerUp(event) {
    const currentDrag = drag.current;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;
    const date = dateAtPointer(event) || currentDrag.current;
    if (currentDrag.moved) {
      onSelect(makeRange(currentDrag.anchor, date));
      setPreviewRange(null);
      skipClick.current = true;
      window.setTimeout(() => { skipClick.current = false; }, 0);
    }
    drag.current = null;
  }

  return (
    <div className={`date-range-calendar${compact ? " date-range-calendar--compact" : ""}`}>
      <div className="date-range-calendar__topline">
        <div>
          <h3>Choose a date range</h3>
          {!compact && <p className="date-range-calendar__hint">Click a start and end date, or drag across the calendar.</p>}
        </div>
        {selectedRange?.from && (
          <p className="date-range-calendar__selection" aria-live="polite">
            {formatDate(selectedRange.from)}{selectedRange.to ? ` – ${formatDate(selectedRange.to)}` : " – choose an end date"}
          </p>
        )}
      </div>

      <div className="calendar">
        <div className="calendar__header">
          <button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(localDate(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>‹</button>
          <h4 aria-live="polite">{monthTitle}</h4>
          <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(localDate(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>›</button>
        </div>
        <div
          className="calendar__grid"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { drag.current = null; setPreviewRange(null); }}
        >
          {weekdays.map((weekday) => <span className="calendar__weekday" key={weekday}>{weekday}</span>)}
          {days.map((date, index) => {
            if (!date) return <span className="calendar__blank" key={`blank-${index}`} />;
            const key = dateKey(date);
            const inRange = shownRange?.from && date >= shownRange.from && (!shownRange.to || date <= shownRange.to);
            const isStart = shownRange?.from?.getTime() === date.getTime();
            const isEnd = shownRange?.to?.getTime() === date.getTime();
            const isToday = date.getTime() === today.getTime();

            return (
              <button
                type="button"
                className={`calendar__day${inRange ? " is-in-range" : ""}${isStart ? " is-start" : ""}${isEnd ? " is-end" : ""}${isToday ? " is-today" : ""}`}
                key={key}
                data-calendar-date={key}
                aria-label={new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date)}
                aria-pressed={Boolean(inRange)}
                onClick={() => { if (!skipClick.current) selectDate(date); }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DateRangeCalendar;