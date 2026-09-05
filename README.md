# Kisan Mandi Setu (e-NAM 2.0)
### Strengthening Market Linkages & Fair Price Discovery for Indian Farmers

A digital agricultural market linkage and price discovery web platform tailored for Indian farmers, FPOs, and corporate wholesale buyers. Built with **100% pure HTML, CSS, and Vanilla JavaScript** with zero external runtime build dependencies.

🔗 **GitHub Repository**: https://kurhadenarayan44-a11y.github.io/SIH-Test/
---

## 🌾 Core Features & Architectural Highlights

### 1. Multilingual Support (All Major Indian Languages)
- **11 Native Languages**: Hindi (हिंदी), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), Gujarati (ગુજરાતી), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Odia (ଓଡ଼ିଆ), and English.
- **Instant Dynamic DOM Translation (`js/i18n.js`)**: Real-time zero page reload language switching translating navigation bars, buttons, metrics, tables, forms, and alerts.
- **Persistent Preference**: Automatically saved in `localStorage`.

### 2. Rural Accessibility & Emergency Support
- **Dynamic Font Resizer ($A- / A / A+$)**: Top bar accessibility toggle scaling root typography from 14px to 19px for elder or low-vision farmers.
- **Day / Night Contrast Mode**: Switches between **Emerald Day mode** (optimized for high-glare sunlight field use) and **High-Contrast OLED Night mode**.
- **1551 Kisan Call Centre Direct Hotline**: Instant one-click quick-dial button (`tel:1551`).
- **Text-to-Speech (Audio Readout)**: Native `window.speechSynthesis` speaks live mandi rates and advisories in regional vernaculars.
- **Voice Search Simulation**: Interactive microphone in the mandi search bar with speech recognition and simulated vernacular query chips.
- **3-Step Visual Rural Guide**: Step-by-step visual cards explaining:
  1. *Check Live Mandi Bhav*
  2. *1-Click Upload Produce*
  3. *Direct Bank Payment (DBT)*

### 3. Dual-Role Entryway & Multi-Account Manager (`js/auth.js`)
- **Farmer Entryway** (mandi price alerts, produce listings, live bids, gate passes).
- **Buyer Entryway** (wholesale commodity discovery, bulk filters, verified seller ratings, digital escrow POs).
- **1-Click Profile Switcher** with pre-configured test accounts:
  - *Ramesh Patil* (Farmer, Nashik, Maharashtra)
  - *Gurpreet Singh* (Farmer, Ludhiana, Punjab)
  - *ITC Agri Business* (Corporate Buyer, Mumbai)
  - *Sahyadri Farmers Producer Co.* (FPO Aggregator, Nashik)
- **Account Registration Modal**: Quick sign-up supporting Aadhaar/GSTIN, Mobile, State, and District.

### 4. Farmer Cockpit & Marketplace Engine (`js/marketplace.js`)
- **1-Click Produce Upload Form**: Crop Name, Variety, Quantity (Quintals), Expected Price (₹/Qtl), Harvest Date, Quality Grade (Grade A / Organic / Fair), and Photo URL.
- **Active Lots Inventory Dashboard**: Real-time lot status tracking (`Bidding Active`, `Deal Locked`, `Sold`, `In Transit`).
- **Incoming Live Bids & Negotiation Desk**: Multi-bid feed from institutional buyers (ITC, Reliance Fresh, Sahyadri FPO) with:
  - **Accept Bid Button**: Locks deal and generates Escrow Contract.
  - **Counter-Offer Button**: Farmers propose revised counter-prices per quintal.
- **Tamper-Evident e-NAM Priority Gate Pass**: Printable official entry pass with cryptographic SVG QR code, Lot ID, Vehicle Number, APMC Gate entry window, and moisture certification.

### 5. Corporate Wholesale Buyer Portal (`js/marketplace.js`)
- **Wholesale Produce Catalog**: Verified lots across India with quality badges and seller star ratings.
- **Multi-Parameter Filtering**: By State, Commodity, Minimum Quality Grade (A/B/C/Organic), and Max Price (₹/Qtl).
- **Direct Bidding Modal**: Custom bid price per quintal, logistics pickup request, and digital payment terms.
- **Digital Escrow Purchase Order**: Legally binding digital contract certificate with legal clauses, APMC cess allocations (1.5%), and delivery timelines.

### 6. Real-Time Inter-Mandi Road Transport P&L Terminal (`js/analytics.js`)
- **Mathematical Road Arbitrage Calculator**: Prevents distress sales by calculating net road profit/loss of shipping produce to distant mandis.
- **High-Arbitrage Corridor Presets**:
  - 🧅 *Nashik (Lasalgaon) → Mumbai (Vashi APMC)* [215 km]
  - 🌾 *Ludhiana (Khanna) → Delhi (Azadpur APMC)* [310 km]
  - 🍅 *Kolar APMC → Bengaluru (Yeshwanthpur APMC)* [75 km]
  - 🌱 *Ujjain Chimanganj → Ahmedabad (Jamalpur APMC)* [385 km]
- **Interactive Distance Slider**: Dynamically recalculates diesel costs, tolls, transit spoilage, and net profit per quintal.
- **Vehicle Models**: Pickup Van (15 Qtl), Mini Truck (40 Qtl), Heavy Multi-Axle Truck (150 Qtl).
- **Live Output Badges**: `PROFITABLE: ROUTE TRUCK` (Green) or `LOSS: SELL LOCALLY` (Red).

### 7. 14-Day AI Predictive Price Forecast & Advisory (`js/analytics.js`)
- **Interactive High-Definition Canvas Chart**: 14-day historical modal prices alongside 14-day forecasted price curves for Onion, Wheat, Tomato, Soybean, Cotton, and Potato.
- **Statutory Government MSP Benchmark**: Red dashed baseline overlaying statutory Minimum Support Price.
- **Interactive Hover HUD**: Real-time crosshair and floating tooltip displaying exact date, price in ₹, and % difference vs MSP.
- **Action Signals**: `HOLD PRODUCE (Expected +14% in 10 Days)` or `SELL NOW (Peak Arrival Window Approaching)`.

### 8. Official Government Mandi Price Engine (`js/mandiData.js`, `convert_csv_to_pdf.js`)
- Sourced directly from Ministry of Agriculture API format (`9ef84268-d588-465a-a308-a864a43d0070`).
- **5,000 live national mandi records** covering 25 states and all major commodities.
- Multi-filtering, live search, sorting, pagination, and row-level audio speech readout.
- **103-Page Official PDF Report** (`Official_Mandi_Data_Gov_All_States_Report.pdf`) generated via pure Node.js.

### 9. 2-Way Trust & Mutual Rating Protocol (`js/ratingSystem.js`)
- **Buyer Rates Farmer**: Produce Quality & Grading Accuracy, Moisture & Sorting Standards, Packaging & Loading (1–5 stars).
- **Farmer Rates Buyer**: Instant DBT Payment Settlement, Fair Weighment Practices, Contract Honor & Professional Conduct (1–5 stars).
- **Live Verified Green Badges** dynamically rendered for high-reputation participants.

---

## 🚀 Getting Started

### Run Locally
Simply serve the files using any static file server:

```bash
# Using Node.js built-in server (included)
node server.js
# Access at http://localhost:8085/
```

Or open `index.html` directly in any web browser! Zero compilation or external dependencies required.

---

## 📜 License
Developed under the Smart India Hackathon (SIH) framework for rural farmer empowerment and agricultural price transparency.
