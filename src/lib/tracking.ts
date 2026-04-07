export const trackWhatsAppClick = async (source: string, config?: { phone?: string, message?: string }) => {
  const timestamp = Date.now();
  const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

  // 1. GA4 Integration (Mocked for demonstration)
  console.log(`[GA4] Event: whatsapp_click | Category: engagement | Label: ${source}`);
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: source
    });
  }

  // 2. Custom Backend Tracking
  try {
    await fetch('/api/track/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, device, timestamp })
    });
  } catch (error) {
    console.error('Failed to track WhatsApp click', error);
  }

  // 3. Open WhatsApp
  const phone = config?.phone || "2348000000000";
  const message = encodeURIComponent(config?.message || "Hello TOSJESS Investment Limited, I want to apply for a loan.");
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
};
