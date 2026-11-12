# NELE — No-Broker Real Estate for Raichur

NELE is a mobile-first real estate marketplace concept for Raichur district, Karnataka. It is designed to help people find, sell, and rent property directly with owners, without brokerage fees.

Browse local listings in Raichur City, Manvi, Sindhanur, Lingasugur, Mudgal, and nearby villages. The experience is designed around local property types, locations, and transaction details.

## What NELE offers

- **Buy or rent locally:** Explore plots, independent houses, flats and apartments, rooms, and commercial shops.
- **Search with useful filters:** Narrow listings by sale or rent, property type, area, price, bedrooms, furnishing, intended tenant, and document availability. Sort by newest or price.
- **Review property details:** See asking price in Indian currency format, size and unit, address or landmark, photos, and details such as bedrooms, facing, floor, and road width.
- **Post a property:** A guided listing flow collects the transaction type, property details, price, locality, photos, optional document information, and contact preferences before previewing a listing.
- **Save and manage listings:** Keep a shortlist, review your own listings, pause or resume them, and mark properties as sold or rented.
- **Connect directly:** The interface includes owner chat, price offers, and WhatsApp contact flows where enabled.
- **Keep local context:** Area choices include Raichur City, Manvi, Sindhanur, Lingasugur, Mudgal, and other villages. Property sizes support units such as square feet, square yards, guntas, cents, and acres.

NELE's goal is to make local property discovery more direct and transparent. Buyers and renters should independently inspect a property and verify ownership and revenue records before making payments or signing agreements.

## Prototype status

This repository currently contains a **frontend prototype**, not a production marketplace. It uses sample listings and simulated authentication, messaging, offers, and contact flows. Prototype state is saved in the browser's local storage; listings and conversations are not shared or synchronized between users. Document badges and sample records are for demonstration and do not represent real verification.

Production use will require backend services for accounts, shared listings, messaging, document storage and verification, and contact integrations.

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

The Vite development server prints the local URL when it starts.

## Useful commands

```bash
npm run lint   # TypeScript check
npm run build  # Production build
npm run preview
```

No API key is required to run the current frontend prototype.

## Technology

- React and TypeScript
- Vite
- Tailwind CSS
- Lucide icons
