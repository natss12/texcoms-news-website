import featuredStories from "../data/featured-stories.json";

const tickerStories = featuredStories.filter(
  (story) => story.category === "World" || story.showInTicker,
);

function Ticker({ onSelectStory }) {
  return (
    <div className="ticker" role="group" aria-label="Latest news headlines">
      <div className="ticker__track">
        {[0, 1].map((copy) => (
          <div className="ticker__group" key={copy} aria-hidden={copy === 1}>
            {tickerStories.map((story) => (
              <button
                className="ticker__item"
                key={`${copy}-${story.id}`}
                type="button"
                tabIndex={copy === 1 ? -1 : 0}
                onClick={() => onSelectStory(story.id)}
              >
                {story.title}<span className="ticker__separator" aria-hidden="true">✳</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ticker;