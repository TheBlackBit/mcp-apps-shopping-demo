// The demo's product catalog + reviews — the only demo-specific data now that the
// storefront machinery (pricing, cart, checkout, gates, stores) lives in
// @openmobilehub/credentagent-storefront. Fed to createStorefront() in main.ts.
import type { Product, Review } from "@openmobilehub/credentagent-storefront";

export const CATALOG: Product[] = [
  {
    id: "aurora-headphones",
    name: "Aurora Wireless Headphones",
    price: 199.0,
    currency: "USD",
    image: "https://picsum.photos/seed/aurora-headphones/400/300",
    category: "Audio",
    description: "Over-ear ANC headphones with 40h battery life.",
  },
  {
    id: "nimbus-keyboard",
    name: "Nimbus Mechanical Keyboard",
    price: 129.0,
    currency: "USD",
    image: "https://picsum.photos/seed/nimbus-keyboard/400/300",
    category: "Accessories",
    description: "Hot-swappable 75% keyboard with PBT keycaps.",
  },
  {
    id: "lumen-monitor",
    name: 'Lumen 27" 4K Monitor',
    price: 449.0,
    currency: "USD",
    image: "https://picsum.photos/seed/lumen-monitor/400/300",
    category: "Displays",
    description: "27-inch 4K IPS display with USB-C power delivery.",
  },
  {
    id: "drift-mouse",
    name: "Drift Ergonomic Mouse",
    price: 69.0,
    currency: "USD",
    image: "https://picsum.photos/seed/drift-mouse/400/300",
    category: "Accessories",
    description: "Lightweight wireless mouse with silent clicks.",
  },
  {
    id: "pulse-webcam",
    name: "Pulse 1080p Webcam",
    price: 89.0,
    currency: "USD",
    image: "https://picsum.photos/seed/pulse-webcam/400/300",
    category: "Video",
    description: "1080p60 webcam with auto light correction.",
  },
  {
    id: "harbor-dock",
    name: "Harbor USB-C Dock",
    price: 159.0,
    currency: "USD",
    image: "https://picsum.photos/seed/harbor-dock/400/300",
    category: "Accessories",
    description: "11-in-1 dock: dual HDMI, Ethernet, SD, 100W passthrough.",
  },
  {
    id: "ember-desk-lamp",
    name: "Ember Smart Desk Lamp",
    price: 59.0,
    currency: "USD",
    image: "https://picsum.photos/seed/ember-desk-lamp/400/300",
    category: "Lighting",
    description: "Tunable white LED lamp with wireless charging base.",
  },
  {
    id: "atlas-stand",
    name: "Atlas Laptop Stand",
    price: 49.0,
    currency: "USD",
    image: "https://picsum.photos/seed/atlas-stand/400/300",
    category: "Accessories",
    description: "Aluminum adjustable laptop stand, folds flat.",
  },
];

// Sample reviews keyed by product id, backing the `get-product-reviews` tool.
export const REVIEWS: Record<string, Review[]> = {
  "aurora-headphones": [
    { author: "Mia R.", rating: 5, text: "ANC is the real deal. Cancels the office hum completely; battery easily lasts a work week." },
    { author: "Devin K.", rating: 4, text: "Sound is rich and balanced. Clamp force is a bit strong on day one but loosens up." },
  ],
  "nimbus-keyboard": [
    { author: "Priya S.", rating: 5, text: "Hot-swap heaven — swapped to tactile switches in minutes, no soldering. PBT caps feel premium." },
    { author: "Tom B.", rating: 4, text: "Typing feel is excellent. Wish it had per-key RGB at this price." },
  ],
  "lumen-monitor": [
    { author: "Carlos M.", rating: 5, text: "USB-C one-cable setup drives my laptop and charges it. Text is razor sharp at 4K." },
    { author: "Anna L.", rating: 4, text: "Colors are great out of the box. Stand wobbles slightly if you bump the desk." },
  ],
  "drift-mouse": [
    { author: "Jordan P.", rating: 5, text: "Silent and light — clicks are nearly inaudible on calls, and it glides effortlessly." },
    { author: "Sam W.", rating: 4, text: "No wrist fatigue after 8 hours. Scroll wheel could be a touch grippier." },
  ],
  "pulse-webcam": [
    { author: "Lena F.", rating: 4, text: "Sharp 1080p60, smooth motion, and the light correction handles my backlit window well." },
    { author: "Raj N.", rating: 4, text: "Big step up from my laptop cam. Mic is okay; I still use a headset." },
  ],
  "harbor-dock": [
    { author: "Grace H.", rating: 5, text: "Replaced four adapters — dual HDMI, ethernet, and 100W passthrough all work flawlessly." },
    { author: "Owen T.", rating: 4, text: "Does everything advertised. Gets warm under heavy load but never throttled." },
  ],
  "ember-desk-lamp": [
    { author: "Yuki A.", rating: 5, text: "Tunable white is great for evenings and the Qi charging base is a clever touch." },
    { author: "Beth C.", rating: 4, text: "Plenty of light for reading. App could be simpler but the lamp is lovely." },
  ],
  "atlas-stand": [
    { author: "Marcus D.", rating: 5, text: "Rock solid — no wobble even while typing hard, and it folds flat for travel." },
    { author: "Iris V.", rating: 4, text: "Raised my screen to eye level instantly. Wish it went just a bit higher." },
  ],
};
