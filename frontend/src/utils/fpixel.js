export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", "PageView");
    } catch {
      // Ignore tracking errors safely
    }
  }
};

export const event = (name, options = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", name, options);
    } catch {
      // Ignore tracking errors safely
    }
  }
};
