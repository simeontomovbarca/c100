export const analytics = {
  trackEvent(event: string, properties?: Record<string, unknown>) {
    console.log('[Analytics Event]', event, properties);

    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', event, properties);
      }

      if ((window as any).fbq) {
        (window as any).fbq('track', event, properties);
      }
    }
  },

  trackDropOpen(collectionName: string) {
    this.trackEvent('drop_open', { collection: collectionName });
  },

  trackPurchase(orderId: string, value: number, currency: string) {
    this.trackEvent('purchase', {
      transaction_id: orderId,
      value,
      currency
    });
  },

  trackJoinClub(email: string) {
    this.trackEvent('join_club', { email });
  },

  trackSoldOut(collectionName: string) {
    this.trackEvent('sold_out', { collection: collectionName });
  },

  trackAddToCart(collectionName: string, size: string) {
    this.trackEvent('add_to_cart', {
      collection: collectionName,
      size
    });
  },

  trackPageView(path: string) {
    this.trackEvent('page_view', { page_path: path });
  }
};
