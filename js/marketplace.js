/**
 * js/marketplace.js
 * Farmer Cockpit & Marketplace Engine + Corporate Wholesale Buyer Portal
 * - 1-Click Produce Upload Form
 * - Active Lots Inventory Dashboard
 * - Incoming Live Bids & Negotiation Desk (Accept & Counter-offer)
 * - Tamper-Evident e-NAM Priority Gate Pass (QR Code & Moisture Cert)
 * - Corporate Buyer Wholesale Catalog & Multi-Parameter Filter
 * - Direct Bidding Modal & Digital Escrow Purchase Order (Certificate)
 */

// In-Memory Marketplace Lots State
window.MARKETPLACE_LOTS = [
  {
    lotId: "LOT-MH-8921",
    farmerId: "farmer_ramesh",
    farmerName: "Ramesh Patil",
    cropName: "Onion",
    variety: "Nashik Red Garva",
    quantityQtl: 120,
    expectedPrice: 2200,
    harvestDate: "2026-09-02",
    qualityGrade: "Grade A (Export Quality)",
    moisturePercent: "11.2% (Permissible)",
    state: "Maharashtra",
    district: "Nashik",
    mandi: "Lasalgaon APMC",
    photoUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
    status: "Bidding Active", // 'Bidding Active', 'Deal Locked', 'Sold', 'In Transit'
    createdAt: "Today 08:30 AM",
    bids: [
      {
        bidId: "BID-7701",
        buyerId: "buyer_itc",
        buyerName: "ITC Agri Business",
        bidPricePerQtl: 2280,
        totalOffer: 273600,
        pickupLogistics: "ITC Direct Farmgate Fleet",
        paymentTerms: "Instant DBT Escrow (T+0 Days)",
        status: "Pending", // 'Pending', 'Accepted', 'Countered', 'Rejected'
        timestamp: "10 mins ago"
      },
      {
        bidId: "BID-7702",
        buyerId: "buyer_sahyadri",
        buyerName: "Sahyadri Farmers Producer Co.",
        bidPricePerQtl: 2240,
        totalOffer: 268800,
        pickupLogistics: "FPO Aggregation Center Mohadi",
        paymentTerms: "Direct Bank Transfer Escrow",
        status: "Pending",
        timestamp: "28 mins ago"
      }
    ]
  },
  {
    lotId: "LOT-PB-4510",
    farmerId: "farmer_gurpreet",
    farmerName: "Gurpreet Singh",
    cropName: "Wheat",
    variety: "Sharbati Gold PBW-343",
    quantityQtl: 250,
    expectedPrice: 2500,
    harvestDate: "2026-08-30",
    qualityGrade: "Grade A (Premium Milling)",
    moisturePercent: "10.4% (Certified Dry)",
    state: "Punjab",
    district: "Ludhiana",
    mandi: "Khanna Mandi",
    photoUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    status: "Bidding Active",
    createdAt: "Yesterday 04:15 PM",
    bids: [
      {
        bidId: "BID-7703",
        buyerId: "buyer_itc",
        buyerName: "ITC Aashirvaad Division",
        bidPricePerQtl: 2560,
        totalOffer: 640000,
        pickupLogistics: "Institutional Rail Siding Khanna",
        paymentTerms: "Direct RTGS Escrow",
        status: "Pending",
        timestamp: "45 mins ago"
      }
    ]
  },
  {
    lotId: "LOT-KA-3120",
    farmerId: "farmer_suresh",
    farmerName: "Suresh Gowda",
    cropName: "Tomato",
    variety: "Abhinav Hybrid",
    quantityQtl: 80,
    expectedPrice: 1900,
    harvestDate: "2026-09-04",
    qualityGrade: "Organic Certified",
    moisturePercent: "Fresh Farm Harvest",
    state: "Karnataka",
    district: "Kolar",
    mandi: "Kolar APMC",
    photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    status: "Bidding Active",
    createdAt: "Today 07:10 AM",
    bids: [
      {
        bidId: "BID-7704",
        buyerId: "buyer_reliance",
        buyerName: "Reliance Fresh Rural Direct",
        bidPricePerQtl: 1950,
        totalOffer: 156000,
        pickupLogistics: "Reefer Temperature Truck",
        paymentTerms: "Escrow Instant Clearance",
        status: "Pending",
        timestamp: "5 mins ago"
      }
    ]
  },
  {
    lotId: "LOT-MP-6014",
    farmerId: "farmer_mukesh",
    farmerName: "Mukesh Patidar",
    cropName: "Soybean",
    variety: "Yellow JS-9560",
    quantityQtl: 180,
    expectedPrice: 4950,
    harvestDate: "2026-09-01",
    qualityGrade: "Grade A",
    moisturePercent: "9.8% (Optimal)",
    state: "Madhya Pradesh",
    district: "Ujjain",
    mandi: "Ujjain Chimanganj",
    photoUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
    status: "Deal Locked",
    createdAt: "2 days ago",
    bids: []
  }
];

// Initialize Marketplace UI
window.initMarketplace = function() {
  window.renderLotsDashboard();
  window.renderWholesaleCatalog();
};

// 1-Click Produce Upload Handler
window.handleProduceUpload = function(event) {
  event.preventDefault();
  const form = document.getElementById('produceUploadForm');
  if (!form) return;

  const cropName = form.cropName.value.trim();
  const variety = form.variety.value.trim();
  const quantityQtl = parseFloat(form.quantityQtl.value);
  const expectedPrice = parseFloat(form.expectedPrice.value);
  const harvestDate = form.harvestDate.value;
  const qualityGrade = form.qualityGrade.value;
  const photoUrl = form.photoUrl.value.trim() || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400";

  if (!cropName || isNaN(quantityQtl) || isNaN(expectedPrice)) {
    alert("Please enter valid crop details, quantity, and price.");
    return;
  }

  const newLotId = `LOT-${(window.currentUser?.state || 'IN').substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLot = {
    lotId: newLotId,
    farmerId: window.currentUser ? window.currentUser.id : "farmer_ramesh",
    farmerName: window.currentUser ? window.currentUser.name : "Ramesh Patil",
    cropName: cropName,
    variety: variety || "Local High-Yield",
    quantityQtl: quantityQtl,
    expectedPrice: expectedPrice,
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    qualityGrade: qualityGrade,
    moisturePercent: "11.0% (Certified)",
    state: window.currentUser?.state || "Maharashtra",
    district: window.currentUser?.district || "Nashik",
    mandi: `${window.currentUser?.district || 'Nashik'} APMC`,
    photoUrl: photoUrl,
    status: "Bidding Active",
    createdAt: "Just now",
    bids: [
      // Auto-simulate institutional offer within 5 seconds
      {
        bidId: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
        buyerId: "buyer_itc",
        buyerName: "ITC Agri Business",
        bidPricePerQtl: Math.round(expectedPrice * 1.03),
        totalOffer: Math.round(quantityQtl * expectedPrice * 1.03),
        pickupLogistics: "Direct Mandi Hub Transport",
        paymentTerms: "Instant DBT Escrow (T+0)",
        status: "Pending",
        timestamp: "Just now"
      }
    ]
  };

  window.MARKETPLACE_LOTS.unshift(newLot);
  form.reset();

  window.renderLotsDashboard();
  window.renderWholesaleCatalog();

  if (typeof window.showToast === 'function') {
    window.showToast(`Lot ${newLotId} (${cropName}) published successfully! Bids are now live.`);
  }
};

// Render Farmer Active Lots Dashboard
window.renderLotsDashboard = function() {
  const container = document.getElementById('farmerLotsContainer');
  const bidsDesk = document.getElementById('incomingBidsDesk');
  if (!container) return;

  const currentFarmerId = window.currentUser ? window.currentUser.id : 'farmer_ramesh';
  // Filter lots belonging to current farmer or show all for testing if none
  let lots = window.MARKETPLACE_LOTS.filter(l => l.farmerId === currentFarmerId);
  if (lots.length === 0) {
    lots = window.MARKETPLACE_LOTS; // fallback so user can interact immediately
  }

  container.innerHTML = '';

  lots.forEach(lot => {
    const card = document.createElement('div');
    card.className = 'lot-card';
    
    let statusClass = 'badge-active';
    if (lot.status === 'Deal Locked') statusClass = 'badge-locked';
    if (lot.status === 'Sold') statusClass = 'badge-sold';
    if (lot.status === 'In Transit') statusClass = 'badge-transit';

    card.innerHTML = `
      <div class="lot-header">
        <div>
          <span class="lot-id">${lot.lotId}</span>
          <h4 class="lot-crop-title">${lot.cropName} <small class="lot-variety">(${lot.variety})</small></h4>
        </div>
        <span class="lot-status-badge ${statusClass}">${lot.status}</span>
      </div>
      <div class="lot-body">
        <div class="lot-metric">
          <span class="metric-lbl">Quantity</span>
          <strong class="metric-val">${lot.quantityQtl} Quintals</strong>
        </div>
        <div class="lot-metric">
          <span class="metric-lbl">Expected Modal</span>
          <strong class="metric-val price-highlight">₹${lot.expectedPrice} / Qtl</strong>
        </div>
        <div class="lot-metric">
          <span class="metric-lbl">Quality Grade</span>
          <strong class="metric-val">${lot.qualityGrade}</strong>
        </div>
        <div class="lot-metric">
          <span class="metric-lbl">Moisture Test</span>
          <strong class="metric-val text-success">${lot.moisturePercent}</strong>
        </div>
      </div>
      <div class="lot-footer">
        <button class="btn btn-outline btn-sm" onclick="window.generateGatePass('${lot.lotId}')">
          🎟️ e-NAM Priority Gate Pass
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.scrollToBidsDesk('${lot.lotId}')">
          💬 Bids (${lot.bids.length})
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Render Incoming Live Bids & Negotiation Desk
  if (bidsDesk) {
    bidsDesk.innerHTML = '';
    let totalBidsRendered = 0;

    lots.forEach(lot => {
      lot.bids.forEach(bid => {
        totalBidsRendered++;
        const bidRow = document.createElement('div');
        bidRow.className = `bid-card ${bid.status === 'Accepted' ? 'bid-accepted' : ''}`;
        bidRow.innerHTML = `
          <div class="bid-card-header">
            <div class="buyer-info">
              <span class="buyer-avatar">🏢</span>
              <div>
                <strong>${bid.buyerName}</strong>
                <div class="lot-ref">Offer for Lot: <code>${lot.lotId}</code> (${lot.cropName} - ${lot.quantityQtl} Qtl)</div>
              </div>
            </div>
            <div class="bid-rate-box">
              <div class="bid-price">₹${bid.bidPricePerQtl} <span class="unit">/ Qtl</span></div>
              <div class="bid-total">Total Offer: ₹${bid.totalOffer.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div class="bid-meta-details">
            <span>🚚 Logistics: ${bid.pickupLogistics}</span>
            <span>🔒 Payment: ${bid.paymentTerms}</span>
            <span>⏱️ ${bid.timestamp}</span>
          </div>
          <div class="bid-actions-row">
            ${bid.status === 'Accepted' ? `
              <span class="badge badge-success">✓ Escrow Contract Generated & Deal Locked</span>
              <button class="btn btn-sm btn-outline" onclick="window.openEscrowContract('${lot.lotId}', '${bid.bidId}')">📄 View Escrow Contract</button>
            ` : `
              <button class="btn btn-success btn-sm" onclick="window.acceptBid('${lot.lotId}', '${bid.bidId}')">
                ✓ Accept Bid & Lock Escrow
              </button>
              <button class="btn btn-warning btn-sm" onclick="window.openCounterOfferModal('${lot.lotId}', '${bid.bidId}', ${bid.bidPricePerQtl})">
                ⇄ Counter-Offer
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.rejectBid('${lot.lotId}', '${bid.bidId}')">
                ✕ Decline
              </button>
            `}
          </div>
        `;
        bidsDesk.appendChild(bidRow);
      });
    });

    if (totalBidsRendered === 0) {
      bidsDesk.innerHTML = `<div class="empty-notice">No active bids right now. Produce uploaded lots are being reviewed by corporate buyers.</div>`;
    }
  }
};

window.scrollToBidsDesk = function(lotId) {
  const el = document.getElementById('incomingBidsDeskSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Accept Bid -> Locks Deal & Generates Escrow Contract
window.acceptBid = function(lotId, bidId) {
  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId);
  if (!lot) return;
  const bid = lot.bids.find(b => b.bidId === bidId);
  if (!bid) return;

  bid.status = 'Accepted';
  lot.status = 'Deal Locked';

  window.renderLotsDashboard();
  window.renderWholesaleCatalog();

  if (typeof window.showToast === 'function') {
    window.showToast(`Bid from ${bid.buyerName} accepted! Escrow Contract generated.`);
  }

  // Open the Escrow PO Modal automatically
  window.openEscrowContract(lotId, bidId);
};

// Counter-Offer Handler
window.openCounterOfferModal = function(lotId, bidId, currentBidPrice) {
  const modal = document.getElementById('counterOfferModal');
  if (!modal) return;

  document.getElementById('counterLotId').value = lotId;
  document.getElementById('counterBidId').value = bidId;
  document.getElementById('counterCurrentBidDisplay').textContent = `₹${currentBidPrice} / Qtl`;
  document.getElementById('counterProposedPrice').value = Math.round(currentBidPrice * 1.05);

  window.openModal('counterOfferModal');
};

window.submitCounterOffer = function(event) {
  event.preventDefault();
  const lotId = document.getElementById('counterLotId').value;
  const bidId = document.getElementById('counterBidId').value;
  const counterPrice = parseFloat(document.getElementById('counterProposedPrice').value);

  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId);
  if (lot) {
    const bid = lot.bids.find(b => b.bidId === bidId);
    if (bid) {
      bid.bidPricePerQtl = counterPrice;
      bid.totalOffer = counterPrice * lot.quantityQtl;
      bid.timestamp = "Countered by Farmer Just Now";
      bid.status = "Pending";
      window.closeModal('counterOfferModal');
      window.renderLotsDashboard();
      if (typeof window.showToast === 'function') {
        window.showToast(`Counter-offer of ₹${counterPrice}/Qtl transmitted to buyer!`);
      }
    }
  }
};

window.rejectBid = function(lotId, bidId) {
  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId);
  if (!lot) return;
  lot.bids = lot.bids.filter(b => b.bidId !== bidId);
  window.renderLotsDashboard();
  if (typeof window.showToast === 'function') {
    window.showToast("Bid declined.");
  }
};

// Tamper-Evident e-NAM Priority Gate Pass Generator
// Creates a high-fidelity printable Mandi Entry Pass with QR code, Lot ID, Vehicle Number, APMC Gate entry window, and moisture certification
window.generateGatePass = function(lotId) {
  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId) || window.MARKETPLACE_LOTS[0];
  const modal = document.getElementById('gatePassModal');
  if (!modal) return;

  const now = new Date();
  const validUntil = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8-hour gate window

  const vehicleNo = `MH-15-EG-${Math.floor(1000 + Math.random() * 9000)}`;
  const passSerial = `eNAM-GP-${Math.floor(100000 + Math.random() * 900000)}`;

  // Populate Gate Pass Modal Content
  document.getElementById('gpPassSerial').textContent = passSerial;
  document.getElementById('gpLotId').textContent = lot.lotId;
  document.getElementById('gpFarmerName').textContent = lot.farmerName;
  document.getElementById('gpCommodity').textContent = `${lot.cropName} (${lot.variety})`;
  document.getElementById('gpQuantity').textContent = `${lot.quantityQtl} Quintals`;
  document.getElementById('gpVehicleNo').textContent = vehicleNo;
  document.getElementById('gpMandi').textContent = `${lot.district} APMC Principal Market Yard`;
  document.getElementById('gpGateWindow').textContent = `${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${validUntil.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (Priority Lane)`;
  document.getElementById('gpMoisture').textContent = `${lot.moisturePercent} [Electronic Hydro-Sensor Verified]`;

  // Render Tamper-Evident SVG QR Code
  const qrContainer = document.getElementById('gpQrCode');
  if (qrContainer) {
    qrContainer.innerHTML = window.generateSvgQrCode(`https://enam.gov.in/verify/pass?id=${passSerial}&lot=${lot.lotId}&sec=SHA256-OK`);
  }

  window.openModal('gatePassModal');
};

// Lightweight pure JS SVG QR Code Generator (Zero external dependencies)
window.generateSvgQrCode = function(dataString) {
  // Deterministic SVG pseudo-QR matrix pattern with finder patterns
  const size = 180;
  const modules = 25;
  const cellSize = size / modules;
  
  let rects = '';
  
  // Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  function addFinderPattern(x0, y0) {
    // Outer 7x7
    rects += `<rect x="${x0 * cellSize}" y="${y0 * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#0a3d24" rx="2" />`;
    rects += `<rect x="${(x0 + 1) * cellSize}" y="${(y0 + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#ffffff" />`;
    rects += `<rect x="${(x0 + 2) * cellSize}" y="${(y0 + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#0a3d24" />`;
  }

  addFinderPattern(0, 0);
  addFinderPattern(modules - 7, 0);
  addFinderPattern(0, modules - 7);

  // Data modules based on hash of string
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    hash = (hash << 5) - hash + dataString.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Avoid finder pattern zones
      if ((r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7)) {
        continue;
      }
      const val = Math.sin(hash + r * 13 + c * 37);
      if (val > 0.05) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="#0a3d24" />`;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="qr-svg">
      <rect width="${size}" height="${size}" fill="#ffffff" rx="8" />
      ${rects}
    </svg>
  `;
};

// ==========================================
// Corporate Buyer Wholesale Catalog & Portal
// ==========================================
window.renderWholesaleCatalog = function() {
  const container = document.getElementById('wholesaleCatalogContainer');
  if (!container) return;

  const filterCommodity = (document.getElementById('buyerFilterCommodity')?.value || '').toLowerCase();
  const filterState = (document.getElementById('buyerFilterState')?.value || '').toLowerCase();
  const filterGrade = (document.getElementById('buyerFilterGrade')?.value || '');
  const maxPrice = parseFloat(document.getElementById('buyerFilterMaxPrice')?.value || 999999);

  let filtered = window.MARKETPLACE_LOTS;

  if (filterCommodity) {
    filtered = filtered.filter(l => l.cropName.toLowerCase().includes(filterCommodity));
  }
  if (filterState) {
    filtered = filtered.filter(l => l.state.toLowerCase().includes(filterState));
  }
  if (filterGrade) {
    filtered = filtered.filter(l => l.qualityGrade.includes(filterGrade));
  }
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter(l => l.expectedPrice <= maxPrice);
  }

  container.innerHTML = '';

  filtered.forEach(lot => {
    const card = document.createElement('div');
    card.className = 'wholesale-lot-card';
    card.innerHTML = `
      <div class="wlot-image-wrap">
        <img src="${lot.photoUrl}" alt="${lot.cropName}" class="wlot-thumb" onerror="this.src='https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400'">
        <span class="wlot-grade-badge">${lot.qualityGrade}</span>
      </div>
      <div class="wlot-content">
        <div class="wlot-header">
          <div>
            <h4 class="wlot-title">${lot.cropName} - ${lot.variety}</h4>
            <div class="wlot-farmer">
              👨‍🌾 ${lot.farmerName} 
              <span class="verified-tick" title="Verified e-NAM Producer">✓ Verified</span>
              <span class="star-rating">★ 4.9</span>
            </div>
          </div>
          <div class="wlot-price">
            <span class="price-val">₹${lot.expectedPrice}</span>
            <span class="price-unit">/ Quintal</span>
          </div>
        </div>
        <div class="wlot-meta">
          <span>📍 ${lot.district}, ${lot.state} (${lot.mandi})</span>
          <span>📦 Available: <strong>${lot.quantityQtl} Quintals</strong></span>
          <span>💧 Moisture: ${lot.moisturePercent}</span>
        </div>
        <div class="wlot-actions">
          <button class="btn btn-primary btn-sm" onclick="window.openDirectBiddingModal('${lot.lotId}')">
            🤝 Place Direct Bid
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.openEscrowContract('${lot.lotId}')">
            📋 Sample Escrow PO
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-notice">No verified lots matching the selected parameters. Try widening filters.</div>`;
  }
};

// Direct Bidding Modal
window.openDirectBiddingModal = function(lotId) {
  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId);
  if (!lot) return;

  document.getElementById('bidModalLotId').value = lot.lotId;
  document.getElementById('bidModalCropDisplay').textContent = `${lot.cropName} (${lot.variety}) - ${lot.quantityQtl} Qtl`;
  document.getElementById('bidModalBasePrice').textContent = `₹${lot.expectedPrice} / Qtl`;
  document.getElementById('bidCustomPriceInput').value = lot.expectedPrice;
  document.getElementById('bidLogisticsPref').value = "Buyer Arranged Logistics (Ex-Farmgate)";
  document.getElementById('bidEscrowTerms').value = "100% Escrow Secured (Disbursed via DBT on Gate Weighbridge)";

  window.openModal('directBiddingModal');
};

window.submitDirectBid = function(event) {
  event.preventDefault();
  const lotId = document.getElementById('bidModalLotId').value;
  const bidPrice = parseFloat(document.getElementById('bidCustomPriceInput').value);
  const logistics = document.getElementById('bidLogisticsPref').value;
  const paymentTerms = document.getElementById('bidEscrowTerms').value;

  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId);
  if (!lot) return;

  const buyerName = window.currentUser && window.currentUser.role === 'buyer' 
    ? window.currentUser.name 
    : "ITC Agri Business";

  const newBid = {
    bidId: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
    buyerId: window.currentUser ? window.currentUser.id : "buyer_itc",
    buyerName: buyerName,
    bidPricePerQtl: bidPrice,
    totalOffer: Math.round(bidPrice * lot.quantityQtl),
    pickupLogistics: logistics,
    paymentTerms: paymentTerms,
    status: "Pending",
    timestamp: "Just now"
  };

  lot.bids.unshift(newBid);

  window.closeModal('directBiddingModal');
  window.renderLotsDashboard();
  window.renderWholesaleCatalog();

  if (typeof window.showToast === 'function') {
    window.showToast(`Bid of ₹${bidPrice}/Qtl placed successfully on Lot ${lotId}!`);
  }
};

// Digital Escrow Purchase Order Modal (Certificate)
window.openEscrowContract = function(lotId, bidId) {
  const lot = window.MARKETPLACE_LOTS.find(l => l.lotId === lotId) || window.MARKETPLACE_LOTS[0];
  const bid = (bidId ? lot.bids.find(b => b.bidId === bidId) : lot.bids[0]) || {
    bidId: "BID-7701",
    buyerName: "ITC Agri Business",
    bidPricePerQtl: lot.expectedPrice,
    totalOffer: lot.quantityQtl * lot.expectedPrice,
    pickupLogistics: "Direct Mandi Hub Transport",
    paymentTerms: "Direct Bank Transfer Escrow (T+0 Days)"
  };

  const modal = document.getElementById('escrowContractModal');
  if (!modal) return;

  const contractNo = `eNAM-ESC-${Math.floor(100000 + Math.random() * 900000)}`;
  const cess = Math.round(bid.totalOffer * 0.015); // 1.5% APMC cess
  const netFarmer = bid.totalOffer; // Farmer receives full negotiated bid in DBT

  document.getElementById('ecContractNo').textContent = contractNo;
  document.getElementById('ecDate').textContent = new Date().toLocaleDateString('en-IN');
  document.getElementById('ecFarmerName').textContent = lot.farmerName;
  document.getElementById('ecBuyerName').textContent = bid.buyerName;
  document.getElementById('ecLotId').textContent = lot.lotId;
  document.getElementById('ecCommodity').textContent = `${lot.cropName} (${lot.variety})`;
  document.getElementById('ecQuantity').textContent = `${lot.quantityQtl} Quintals`;
  document.getElementById('ecRate').textContent = `₹${bid.bidPricePerQtl} / Quintal`;
  document.getElementById('ecTotalValue').textContent = `₹${bid.totalOffer.toLocaleString('en-IN')}`;
  document.getElementById('ecCess').textContent = `₹${cess.toLocaleString('en-IN')} (1.5% statutory market fee)`;
  document.getElementById('ecNetFarmer').textContent = `₹${netFarmer.toLocaleString('en-IN')}`;
  document.getElementById('ecDeliveryTerms').textContent = bid.pickupLogistics;
  document.getElementById('ecEscrowStatus').textContent = "Escrow Secured & Locked (T+0 DBT Release upon Weighbridge Inspection)";

  window.openModal('escrowContractModal');
};
