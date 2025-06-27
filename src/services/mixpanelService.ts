import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
mixpanel.init('8b69a03cbfa7047c5fa1bfdf8cf74ac2', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
});

export const analytics = {
  // Track events
  track: (event: string, properties?: Record<string, any>) => {
    mixpanel.track(event, properties);
  },

  // Identify users
  identify: (userId: string) => {
    mixpanel.identify(userId);
  },

  // Set user properties
  setUser: (properties: Record<string, any>) => {
    mixpanel.people.set(properties);
  },

  // Track page views
  trackPageView: (pageName: string) => {
    mixpanel.track('Page View', { page: pageName });
  },

  // Reset user
  reset: () => {
    mixpanel.reset();
  },
};

export default analytics; 