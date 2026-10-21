import { useEffect, useState } from "react";
import featuredStories from "../data/featured-stories.json";
import posts from "../data/market-news.json";

function formatPublicationDate(value) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatPublicationTime(value) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(new Date(value));
}

function ShareStoryButton({ post }) {
  const [shareMessage, setShareMessage] = useState("");

  async function shareStory() {
    setShareMessage("");
    const shareUrl = post.url ||
      `${window.location.origin}${window.location.pathname}#story-${encodeURIComponent(post.id)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.searchableSummary,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setShareMessage("Unable to share this story.");
        }
      }
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setShareMessage("Sharing is not available in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Story link copied.");
    } catch {
      setShareMessage("Unable to copy the story link.");
    }
  }

  return (
    <div className="post-card__share-wrap">
      <button className="post-card__share" type="button" onClick={shareStory}>
        <span aria-hidden="true">↗</span> Share story
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">{shareMessage}</span>
    </div>
  );
}

function BlogPosts({ searchQuery, filters, selectedStoryId }) {
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const stories = [
    ...posts.map((post) => ({
      ...post,
      label: post.category,
      date: post.publishedAt.slice(0, 10),
      publishedDateTime: post.publishedAt,
      url: post.sourceUrl,
      alt: post.imageAlt,
      searchableSummary: post.summary.join(" "),
    })),
    ...featuredStories.map((post) => ({
      ...post,
      label: post.category,
      date: post.publishedAt.slice(0, 10),
      publishedDateTime: post.publishedAt,
      url: post.sourceUrl,
      alt: post.imageAlt,
      searchableSummary: post.summary,
    })),
  ];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const filteredPosts = stories.filter((post) =>
    `${post.title} ${post.searchableSummary} ${post.label} ${post.author} ${post.source}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) &&
    (filters.category === "all" || post.label === filters.category) &&
    (() => {
      const [year, month, day] = post.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (filters.datePreset === "today") return date.getTime() === today.getTime();
      if (filters.datePreset === "week") return date >= weekStart && date <= today;
      if (filters.datePreset === "month") return date >= monthStart && date <= today;
      if (filters.datePreset === "range") {
        return (!filters.dateRange.from || date >= filters.dateRange.from) &&
          (!filters.dateRange.to || date <= filters.dateRange.to);
      }
      return true;
    })(),
  );

  useEffect(() => {
    if (!selectedStoryId) return;

    document.getElementById(`story-${selectedStoryId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedStoryId]);

  return (
    <section className="blog-section page-width" id="blog-posts" aria-labelledby="blog-title">
      <div className="blog-section__heading">
        <div>
          <h2 id="blog-title">Latest stories</h2>
        </div>
      </div>

      {filteredPosts.length ? (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <article className={`post-card${selectedStoryId === post.id ? " is-selected" : ""}`} id={`story-${post.id}`} key={post.id}>
              {post.url ? (
                <a className="post-card__image" href={post.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                  <img src={post.image} alt={post.alt} loading="lazy" />
                </a>
              ) : (
                <div className="post-card__image">
                  <img src={post.image} alt={post.alt} loading="lazy" />
                </div>
              )}
              <div className="post-card__body">
                <div className="post-card__meta">
                  <span>{post.label}</span>
                  <time dateTime={post.publishedDateTime}>
                    {formatPublicationDate(post.publishedDateTime)}
                    {" · "}
                    {post.publishedAtDisplay || (
                      post.publishedDateTime.length > 10
                        ? formatPublicationTime(post.publishedDateTime)
                        : "Time not provided"
                    )}
                  </time>
                </div>
                <h3>{post.url ? <a href={post.url} target="_blank" rel="noreferrer">{post.title}</a> : post.title}</h3>
                <p className="post-card__byline">
                  <span>Published by {post.source}</span>
                  <span>By {post.author}</span>
                </p>
                <p>{post.searchableSummary}</p>
                <div className="post-card__actions">
                  <button
                    className="post-card__read post-card__read-button"
                    type="button"
                    aria-expanded={expandedStoryId === post.id}
                    aria-controls={`story-details-${post.id}`}
                    onClick={() => setExpandedStoryId((current) => current === post.id ? null : post.id)}
                  >
                    {expandedStoryId === post.id ? "Close story" : "Read story"}
                    <span aria-hidden="true">{expandedStoryId === post.id ? "−" : "→"}</span>
                  </button>
                  <ShareStoryButton post={post} />
                </div>
                {expandedStoryId === post.id && (
                  <div className="post-card__details" id={`story-details-${post.id}`}>
                    {post.detailContent?.length ? post.detailContent.map((section) => (
                      <section key={section.heading}>
                        <h4>{section.heading}</h4>
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </section>
                    )) : (
                      <p>{post.searchableSummary}</p>
                    )}
                    {post.url && (
                      <a className="post-card__source-link" href={post.url} target="_blank" rel="noreferrer">
                        Read the original at {post.source}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="blog-empty" role="status">No stories match those search and filter settings.</p>
      )}
    </section>
  );
}

export default BlogPosts;