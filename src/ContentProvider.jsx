import { useEffect, useState } from "react";
import { DEFAULT_CONTENT, mergeContent } from "./content.js";
import { ContentContext, fetchSavedContent } from "./contentStore.js";

// Shows the starting content straight away, then what was saved in the admin page as soon as it arrives.
export default function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    let alive = true;
    fetchSavedContent()
      .then((saved) => {
        if (alive && saved) setContent(mergeContent(saved));
      })
      .catch((e) => console.warn(e.message));
    return () => {
      alive = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
