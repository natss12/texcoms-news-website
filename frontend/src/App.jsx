import { useState } from "react";
import BlogPosts from "./components/NewsPosts.jsx";
import FeatureCarousel from "./components/FeatureCarousel.jsx";
import Navbar from "./components/Navbar.jsx";
import Ticker from "./components/Ticker.jsx";

function App() {
  const [articleSearch, setArticleSearch] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [storyFilters, setStoryFilters] = useState({
    category: "all",
    datePreset: "all",
    dateRange: { from: null, to: null },
  });

  function selectFeaturedStory(storyId) {
    setArticleSearch("");
    setStoryFilters({
      category: "all",
      datePreset: "all",
      dateRange: { from: null, to: null },
    });
    setSelectedStoryId(storyId);
  }

  return (
    <>
      <Navbar
        onSearch={setArticleSearch}
        filters={storyFilters}
        onFiltersChange={setStoryFilters}
      />
      <main id="home">
        <Ticker onSelectStory={selectFeaturedStory} />
        <FeatureCarousel onSelectStory={selectFeaturedStory} />
        <BlogPosts
          searchQuery={articleSearch}
          filters={storyFilters}
          selectedStoryId={selectedStoryId}
        />
      </main>
      <footer className="site-footer" id="contact">
        <div className="site-footer__main page-width">
          <div className="site-footer__identity">
            <a className="site-footer__brand" href="#home">
              <span className="site-nav__mark" aria-hidden="true">N</span>
              NewsPulse
            </a>
            <p>Thoughtful reporting for a world in motion.</p>
          </div>
          <nav className="site-footer__column" aria-label="Explore">
            <h2>Explore</h2>
            <a href="#blog-posts">Stories</a>
            <a href="#blog-posts">Latest stories</a>
            <a href="#home">Back to top</a>
          </nav>
        </div>
        <div className="site-footer__bottom page-width">
          <span>Independent ideas. Clear perspectives.</span>
          <span>© {new Date().getFullYear()} NewsPulse</span>
        </div>
      </footer>
    </>
  );
}

export default App;