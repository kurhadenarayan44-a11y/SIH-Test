/**
 * js/analytics.js
 * 1. Real-Time Inter-Mandi Road Transport P&L Terminal (Mathematical Arbitrage Calculator)
 * 2. 14-Day AI Predictive Price Forecast & Advisory (Interactive Canvas Chart & MSP Benchmark)
 */

// Vehicle Models & Logistics Metrics (Reflecting authentic Indian commercial carriers)
const VEHICLE_SPECS = {
  pickup: { name: "Pickup Van (e.g. Bolero Maxi Truck)", maxCapacityQtl: 15, mileageKmPerL: 11.5, tollAndDriverPerKm: 4.5, avgSpeedKmph: 42 },
  mini_truck: { name: "Mini Truck (e.g. Tata 407 / Eicher Pro)", maxCapacityQtl: 40, mileageKmPerL: 7.2, tollAndDriverPerKm: 7.5, avgSpeedKmph: 45 },
  heavy_truck: { name: "Heavy Multi-Axle Truck (e.g. Ashok Leyland 2820)", maxCapacityQtl: 150, mileageKmPerL: 3.8, tollAndDriverPerKm: 14.0, avgSpeedKmph: 48 }
};

const COMMODITY_PERISHABILITY = {
  "Tomato": 0.35,      // % loss per transit hour
  "Onion": 0.10,
  "Potato": 0.08,
  "Wheat": 0.015,
  "Soybean": 0.02,
  "Cotton": 0.01,
  "Green Chilli": 0.40,
  "Banana": 0.25,
  "Paddy(Dhan)": 0.02
};

const DIESEL_RATE_INR = 92.50; // Current average Indian diesel rate (₹/L)

window.initAnalytics = function() {
  window.initArbitrageCalculator();
  window.initForecastChart();
};

// =======================================================
// 1. Inter-Mandi Road Transport P&L Terminal
// =======================================================
window.initArbitrageCalculator = function() {
  const form = document.getElementById('arbitrageForm');
  if (!form) return;

  const slider = document.getElementById('arbDistanceSlider');
  const numInput = document.getElementById('arbDistanceKm');
  if (slider && numInput) {
    slider.addEventListener('input', (e) => {
      numInput.value = e.target.value;
      window.calculateArbitrage();
    });
    numInput.addEventListener('input', (e) => {
      slider.value = e.target.value;
      window.calculateArbitrage();
    });
  }

  // Set default initial calculation
  window.calculateArbitrage();
};

window.setArbitragePreset = function(origin, dest, commodity, distance, qty) {
  const originInput = document.getElementById('arbOriginMandi');
  const destInput = document.getElementById('arbDestMandi');
  const commSelect = document.getElementById('arbCommodity');
  const distInput = document.getElementById('arbDistanceKm');
  const distSlider = document.getElementById('arbDistanceSlider');
  const qtyInput = document.getElementById('arbQuantity');
  const vehicleSelect = document.getElementById('arbVehicleType');

  if (originInput) originInput.value = origin;
  if (destInput) destInput.value = dest;
  if (commSelect) commSelect.value = commodity;
  if (distInput) distInput.value = distance;
  if (distSlider) distSlider.value = distance;
  if (qtyInput) qtyInput.value = qty;
  if (vehicleSelect) {
    if (qty > 40) vehicleSelect.value = 'heavy_truck';
    else if (qty > 15) vehicleSelect.value = 'mini_truck';
    else vehicleSelect.value = 'pickup';
  }

  window.calculateArbitrage();
  if (typeof window.showToast === 'function') {
    window.showToast(`Loaded route: ${origin} → ${dest} (${distance} km)`);
  }
};

window.calculateArbitrage = function() {
  const originMandi = document.getElementById('arbOriginMandi')?.value || "Lasalgaon APMC (Nashik)";
  const destMandi = document.getElementById('arbDestMandi')?.value || "Vashi APMC (Navi Mumbai)";
  const commodity = document.getElementById('arbCommodity')?.value || "Onion";
  const quantity = parseFloat(document.getElementById('arbQuantity')?.value || 40);
  const vehicleKey = document.getElementById('arbVehicleType')?.value || "mini_truck";
  const distanceKm = parseFloat(document.getElementById('arbDistanceKm')?.value || 215);

  const vehicle = VEHICLE_SPECS[vehicleKey] || VEHICLE_SPECS.mini_truck;

  // Benchmark prices for origin and destination
  let originPrice = 1850;
  let destPrice = 2450;

  if (commodity === "Onion") { originPrice = 1850; destPrice = 2420; }
  else if (commodity === "Tomato") { originPrice = 1350; destPrice = 2150; }
  else if (commodity === "Wheat") { originPrice = 2300; destPrice = 2650; }
  else if (commodity === "Soybean") { originPrice = 4600; destPrice = 5120; }
  else if (commodity === "Cotton") { originPrice = 6900; destPrice = 7580; }
  else if (commodity === "Potato") { originPrice = 1200; destPrice = 1680; }

  const customOriginPrice = parseFloat(document.getElementById('arbOriginCustomPrice')?.value);
  const customDestPrice = parseFloat(document.getElementById('arbDestCustomPrice')?.value);
  if (!isNaN(customOriginPrice) && customOriginPrice > 0) originPrice = customOriginPrice;
  if (!isNaN(customDestPrice) && customDestPrice > 0) destPrice = customDestPrice;

  // 1. Gross Revenue
  const originRevenue = quantity * originPrice;
  const targetGrossRevenue = quantity * destPrice;
  const grossDiff = targetGrossRevenue - originRevenue;

  // 2. Diesel & Fuel Costs
  const fuelLiters = distanceKm / vehicle.mileageKmPerL;
  const fuelCost = Math.round(fuelLiters * DIESEL_RATE_INR);

  // 3. Toll Taxes & Driver Charges
  const tollsAndDriver = Math.round(distanceKm * vehicle.tollAndDriverPerKm);

  // 4. Perishability In-Transit Wastage
  const transitHours = distanceKm / vehicle.avgSpeedKmph;
  const hourlyLossRate = (COMMODITY_PERISHABILITY[commodity] || 0.05) / 100;
  const totalPerishabilityPct = Math.min(hourlyLossRate * transitHours, 0.15);
  const transitWastageVal = Math.round(targetGrossRevenue * totalPerishabilityPct);

  // 5. APMC Cess (1.5%)
  const apmcCess = Math.round(targetGrossRevenue * 0.015);

  // 6. Total Deductions
  const totalDeductions = fuelCost + tollsAndDriver + transitWastageVal + apmcCess;

  // 7. Net Road Profit / Loss
  const netProfit = grossDiff - totalDeductions;
  const netProfitPerQtl = Math.round(netProfit / quantity);

  // Update UI Elements
  const outGross = document.getElementById('outGrossDiff');
  const outFuel = document.getElementById('outFuelCost');
  const outTolls = document.getElementById('outTollsDriver');
  const outLoss = document.getElementById('outTransitLoss');
  const outCess = document.getElementById('outApmcCess');
  const netProfitEl = document.getElementById('outNetProfit');
  const netPerQtlEl = document.getElementById('outNetPerQtl');
  const badgeEl = document.getElementById('arbRecommendationBadge');

  if (outGross) outGross.textContent = `₹${grossDiff.toLocaleString('en-IN')}`;
  if (outFuel) outFuel.textContent = `- ₹${fuelCost.toLocaleString('en-IN')} (${fuelLiters.toFixed(1)} L)`;
  if (outTolls) outTolls.textContent = `- ₹${tollsAndDriver.toLocaleString('en-IN')}`;
  if (outLoss) outLoss.textContent = `- ₹${transitWastageVal.toLocaleString('en-IN')} (${(totalPerishabilityPct * 100).toFixed(1)}%)`;
  if (outCess) outCess.textContent = `- ₹${apmcCess.toLocaleString('en-IN')}`;

  if (netProfitEl) {
    netProfitEl.textContent = `₹${netProfit.toLocaleString('en-IN')}`;
    netProfitEl.className = netProfit >= 0 ? 'text-profit-huge' : 'text-loss-huge';
  }

  if (netPerQtlEl) {
    netPerQtlEl.textContent = `${netProfit >= 0 ? '+' : '-'}₹${Math.abs(netProfitPerQtl).toLocaleString('en-IN')} / Qtl`;
  }

  if (badgeEl) {
    if (netProfit > 0) {
      badgeEl.className = "recommendation-badge badge-profitable";
      badgeEl.innerHTML = `🟢 ${window.t('badge_profitable') || 'PROFITABLE: ROUTE TRUCK'} (+₹${netProfitPerQtl}/Qtl)`;
    } else {
      badgeEl.className = "recommendation-badge badge-loss";
      badgeEl.innerHTML = `🔴 ${window.t('badge_loss') || 'LOSS: SELL LOCALLY'} (-₹${Math.abs(netProfitPerQtl)}/Qtl)`;
    }
  }
};


// =======================================================
// 2. 14-Day AI Predictive Price Forecast & Advisory
// =======================================================
const FORECAST_COMMODITIES = {
  "Onion": {
    cropIcon: "🧅",
    msp: 1850,
    historical: [1950, 1980, 2020, 2010, 2050, 2080, 2090, 2120, 2140, 2130, 2150, 2180, 2200, 2220],
    forecast:   [2250, 2280, 2310, 2340, 2370, 2400, 2430, 2450, 2480, 2500, 2520, 2540, 2550, 2580],
    signal: "HOLD PRODUCE (Expected +14% in 10 Days)",
    signalType: "hold",
    advice: "Export duty relaxation and lower monsoon arrivals in Nashik belt indicate tight supply. Withholding for 10-14 days maximizes realization."
  },
  "Wheat": {
    cropIcon: "🌾",
    msp: 2275,
    historical: [2380, 2390, 2400, 2410, 2400, 2420, 2430, 2440, 2435, 2450, 2460, 2455, 2470, 2480],
    forecast:   [2490, 2500, 2510, 2520, 2515, 2530, 2540, 2550, 2560, 2570, 2580, 2590, 2600, 2610],
    signal: "HOLD PRODUCE (Steady Institutional Mill Demand)",
    signalType: "hold",
    advice: "Prices are trading ₹200+ above Statutory MSP. Private flour mill procurement from Khanna and Malwa continues strong."
  },
  "Tomato": {
    cropIcon: "🍅",
    msp: 1400,
    historical: [2600, 2550, 2480, 2400, 2350, 2280, 2200, 2150, 2100, 2050, 1980, 1900, 1850, 1800],
    forecast:   [1740, 1680, 1620, 1550, 1490, 1440, 1400, 1360, 1320, 1280, 1250, 1220, 1200, 1180],
    signal: "SELL NOW (Peak Arrival Window Approaching)",
    signalType: "sell",
    advice: "Heavy flush arriving from Kolar, Madanapalle, and Belagavi clusters will trigger severe supply saturation. Liquidate existing lots immediately."
  },
  "Soybean": {
    cropIcon: "🌱",
    msp: 4892,
    historical: [4720, 4750, 4780, 4800, 4820, 4850, 4870, 4892, 4920, 4950, 4980, 5010, 5040, 5080],
    forecast:   [5110, 5140, 5180, 5210, 5240, 5280, 5310, 5340, 5380, 5410, 5440, 5470, 5500, 5530],
    signal: "HOLD PRODUCE (Crushing Margins & Soya Meal High)",
    signalType: "hold",
    advice: "Soybean has crossed Statutory MSP. Solvent extraction plants in Indore, Ujjain, and Latur are aggressively sourcing quality yellow seed."
  },
  "Cotton": {
    cropIcon: "☁️",
    msp: 7121,
    historical: [7050, 7080, 7100, 7121, 7150, 7180, 7200, 7230, 7250, 7280, 7300, 7340, 7380, 7420],
    forecast:   [7450, 7480, 7520, 7550, 7580, 7620, 7650, 7690, 7720, 7750, 7780, 7810, 7850, 7880],
    signal: "HOLD PRODUCE (Global Lint Deficit & Spinning Demand)",
    signalType: "hold",
    advice: "BT medium and long staple cotton is fetching premium bids across Gujarat and Telangana mandis. CCI procurement offers solid price floor."
  },
  "Potato": {
    cropIcon: "🥔",
    msp: 1250,
    historical: [1650, 1630, 1620, 1600, 1590, 1580, 1570, 1560, 1550, 1540, 1530, 1520, 1510, 1500],
    forecast:   [1480, 1460, 1440, 1420, 1400, 1380, 1360, 1340, 1320, 1300, 1280, 1260, 1240, 1220],
    signal: "SELL NOW (Cold Storage Offloading in Progress)",
    signalType: "sell",
    advice: "Agra and Jalandhar cold storage units are releasing stored stocks ahead of early Kharif crop. Offload produce to prevent distress margins."
  }
};

window.selectedForecastCrop = "Onion";
let hoveredPointIndex = -1;

window.selectForecastCrop = function(cropName) {
  if (!FORECAST_COMMODITIES[cropName]) return;
  window.selectedForecastCrop = cropName;

  // Sync select dropdown if exists
  const select = document.getElementById('forecastCropSelect');
  if (select && select.value !== cropName) select.value = cropName;

  // Sync chip buttons
  document.querySelectorAll('.crop-btn-chip').forEach(btn => {
    if (btn.getAttribute('data-crop') === cropName) {
      btn.classList.add('chip-active');
    } else {
      btn.classList.remove('chip-active');
    }
  });

  window.renderForecastChart();
};

window.initForecastChart = function() {
  const canvas = document.getElementById('forecastCanvas');
  if (!canvas) return;

  const select = document.getElementById('forecastCropSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      window.selectForecastCrop(e.target.value);
    });
  }

  // Canvas Mouse Move for Tooltip
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 65, right: 40 };
    const chartW = rect.width - padding.left - padding.right;

    if (x >= padding.left && x <= rect.width - padding.right) {
      const pointIdx = Math.round(((x - padding.left) / chartW) * 27);
      if (pointIdx !== hoveredPointIndex) {
        hoveredPointIndex = Math.max(0, Math.min(27, pointIdx));
        window.renderForecastChart();
      }
    } else if (hoveredPointIndex !== -1) {
      hoveredPointIndex = -1;
      window.renderForecastChart();
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (hoveredPointIndex !== -1) {
      hoveredPointIndex = -1;
      window.renderForecastChart();
    }
  });

  window.renderForecastChart();
};

window.renderForecastChart = function() {
  const canvas = document.getElementById('forecastCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cropData = FORECAST_COMMODITIES[window.selectedForecastCrop] || FORECAST_COMMODITIES.Onion;

  // Update Advisory Signal Badge
  const signalBadge = document.getElementById('forecastActionBadge');
  const adviceText = document.getElementById('forecastAdviceText');
  const mspDisplay = document.getElementById('forecastMspValue');

  if (signalBadge) {
    signalBadge.textContent = cropData.signal;
    signalBadge.className = `signal-badge ${cropData.signalType === 'hold' ? 'signal-hold' : 'signal-sell'}`;
  }
  if (adviceText) {
    adviceText.textContent = cropData.advice;
  }
  if (mspDisplay) {
    mspDisplay.textContent = `₹${cropData.msp.toLocaleString('en-IN')} / Qtl`;
  }

  // Handle high-DPI crisp rendering
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = (rect.width || 800) * dpr;
  canvas.height = (rect.height || 380) * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width || 800;
  const h = rect.height || 380;

  ctx.clearRect(0, 0, w, h);

  const isNight = document.body.classList.contains('night-mode');
  ctx.fillStyle = isNight ? '#0f1c14' : '#f8fbf9';
  ctx.fillRect(0, 0, w, h);

  const padding = { top: 40, right: 45, bottom: 50, left: 70 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const allValues = [...cropData.historical, ...cropData.forecast, cropData.msp];
  const minY = Math.floor(Math.min(...allValues) * 0.9 / 50) * 50;
  const maxY = Math.ceil(Math.max(...allValues) * 1.08 / 50) * 50;

  function getY(val) {
    return padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;
  }

  function getX(idx) {
    return padding.left + (idx / 27) * chartW;
  }

  // Grid Lines
  ctx.strokeStyle = isNight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.font = '700 11px JetBrains Mono, monospace';
  ctx.fillStyle = isNight ? '#8fa397' : '#5c6b63';
  ctx.textAlign = 'right';

  const yStep = (maxY - minY) / 5;
  for (let i = 0; i <= 5; i++) {
    const val = Math.round(minY + yStep * i);
    const y = getY(val);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillText(`₹${val}`, padding.left - 10, y + 4);
  }

  // Division line between Historical & Forecast
  const splitX = getX(13);
  ctx.strokeStyle = isNight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(splitX, padding.top);
  ctx.lineTo(splitX, h - padding.bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.font = '800 11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isNight ? '#86efac' : '#046a38';
  ctx.fillText("← 14-Day Historical Modal Prices", padding.left + (splitX - padding.left) / 2, padding.top - 14);
  ctx.fillStyle = isNight ? '#38bdf8' : '#0284c7';
  ctx.fillText("14-Day AI Forecast Projections →", splitX + (w - padding.right - splitX) / 2, padding.top - 14);

  // 1. Statutory MSP Benchmark Line
  const mspY = getY(cropData.msp);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(padding.left, mspY);
  ctx.lineTo(w - padding.right, mspY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#ef4444';
  ctx.font = '800 11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Statutory MSP: ₹${cropData.msp}/Qtl`, padding.left + 10, mspY - 8);

  // 2. Gradient Fill Under Historical Curve
  const gradHist = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradHist.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  gradHist.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
  ctx.fillStyle = gradHist;
  ctx.beginPath();
  ctx.moveTo(getX(0), h - padding.bottom);
  for (let i = 0; i < 14; i++) {
    ctx.lineTo(getX(i), getY(cropData.historical[i]));
  }
  ctx.lineTo(getX(13), h - padding.bottom);
  ctx.closePath();
  ctx.fill();

  // Draw Historical Line
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (let i = 0; i < 14; i++) {
    const x = getX(i);
    const y = getY(cropData.historical[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Historical Points
  ctx.fillStyle = '#047857';
  for (let i = 0; i < 14; i++) {
    const x = getX(i);
    const y = getY(cropData.historical[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Gradient Fill Under Forecast Curve
  const gradFore = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradFore.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
  gradFore.addColorStop(1, 'rgba(37, 99, 235, 0.02)');
  ctx.fillStyle = gradFore;
  ctx.beginPath();
  ctx.moveTo(getX(13), h - padding.bottom);
  ctx.lineTo(getX(13), getY(cropData.historical[13]));
  for (let i = 0; i < 14; i++) {
    ctx.lineTo(getX(14 + i), getY(cropData.forecast[i]));
  }
  ctx.lineTo(getX(27), h - padding.bottom);
  ctx.closePath();
  ctx.fill();

  // Draw Forecast Line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(getX(13), getY(cropData.historical[13]));
  for (let i = 0; i < 14; i++) {
    ctx.lineTo(getX(14 + i), getY(cropData.forecast[i]));
  }
  ctx.stroke();

  // Forecast Points
  ctx.fillStyle = '#1d4ed8';
  for (let i = 0; i < 14; i++) {
    const x = getX(14 + i);
    const y = getY(cropData.forecast[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // X-Axis Labels
  ctx.fillStyle = isNight ? '#94a3b8' : '#475569';
  ctx.font = '700 10px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("Day -14", getX(0), h - padding.bottom + 20);
  ctx.fillText("Day -7", getX(7), h - padding.bottom + 20);
  ctx.fillText("Today (T)", getX(13), h - padding.bottom + 20);
  ctx.fillText("Day +7", getX(20), h - padding.bottom + 20);
  ctx.fillText("Day +14", getX(27), h - padding.bottom + 20);

  // 4. Interactive Hover Crosshair & HUD Tooltip
  if (hoveredPointIndex >= 0 && hoveredPointIndex <= 27) {
    const isHist = hoveredPointIndex < 14;
    const price = isHist ? cropData.historical[hoveredPointIndex] : cropData.forecast[hoveredPointIndex - 14];
    const hoverX = getX(hoveredPointIndex);
    const hoverY = getY(price);
    const mspDiff = price - cropData.msp;
    const pctDiff = ((mspDiff / cropData.msp) * 100).toFixed(1);

    // Vertical line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(hoverX, padding.top);
    ctx.lineTo(hoverX, h - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing target circle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(hoverX, hoverY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tooltip HUD Box
    const tipW = 160;
    const tipH = 55;
    let tipX = hoverX - tipW / 2;
    if (tipX < padding.left) tipX = padding.left;
    if (tipX + tipW > w - padding.right) tipX = w - padding.right - tipW;
    let tipY = hoverY - tipH - 12;
    if (tipY < padding.top) tipY = hoverY + 14;

    ctx.fillStyle = isNight ? 'rgba(15, 28, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = isNight ? '#2e5942' : '#86efac';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tipX, tipY, tipW, tipH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isNight ? '#e2e8f0' : '#0f2419';
    ctx.font = '800 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    const dayLabel = isHist ? `Day -${13 - hoveredPointIndex} (Historical)` : `Day +${hoveredPointIndex - 13} (AI Forecast)`;
    ctx.fillText(dayLabel, tipX + 10, tipY + 18);

    ctx.font = '800 13px JetBrains Mono, monospace';
    ctx.fillStyle = isHist ? '#059669' : '#2563eb';
    ctx.fillText(`₹${price} / Qtl`, tipX + 10, tipY + 35);

    ctx.font = '700 9.5px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = mspDiff >= 0 ? '#10b981' : '#ef4444';
    ctx.fillText(`${mspDiff >= 0 ? '+' : ''}₹${mspDiff} (${pctDiff}%) vs MSP`, tipX + 10, tipY + 48);
  }
};
