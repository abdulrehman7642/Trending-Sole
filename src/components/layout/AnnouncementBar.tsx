import { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const messages = [
    'Free delivery across the UAE',
    'New Autumn Collection Now Live — Shop the Edit',
    'Easy Returns & Exchanges within 30 Days',
  ];
  const [idx, setIdx] = useState(0);

  if (!visible) return null;

  return (
    <div className="bg-primary text-ivory text-xs tracking-widest font-sans flex items-center justify-between px-6 py-2.5 relative">
      <div className="flex-1" />
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIdx((i) => (i - 1 + messages.length) % messages.length)}
          className="opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Previous"
        >
          ‹
        </button>
        <span className="uppercase font-medium">{messages[idx]}</span>
        <button
          onClick={() => setIdx((i) => (i + 1) % messages.length)}
          className="opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Next"
        >
          ›
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => setVisible(false)}
          className="opacity-50 hover:opacity-100 transition-opacity text-sm"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
