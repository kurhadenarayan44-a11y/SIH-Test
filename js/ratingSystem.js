/**
 * js/ratingSystem.js
 * 2-Way Trust & Mutual Rating Protocol
 * - Buyer Rates Farmer On:
 *   1. Produce Quality & Grading Accuracy (1-5 Stars)
 *   2. Moisture & Sorting Standards (1-5 Stars)
 *   3. Packaging & On-Time Loading (1-5 Stars)
 * - Farmer Rates Buyer On:
 *   1. Instant DBT Payment Settlement (1-5 Stars)
 *   2. Fair Weighment Practices (1-5 Stars)
 *   3. Contract Honor & Professional Conduct (1-5 Stars)
 * - Live Verified Badges:
 *   Calculates cumulative star ratings and renders verified green badges next to high-reputation participants.
 */

window.REPUTATION_DATABASE = {
  farmers: {
    "farmer_ramesh": {
      name: "Ramesh Patil",
      overallRating: 4.9,
      totalReviews: 48,
      verified: true,
      criteria: { quality: 4.9, moisture: 4.8, packaging: 5.0 },
      reviews: [
        { reviewer: "ITC Agri Business", score: 5, date: "02 Sep 2026", comment: "Excellent Nashik Red Onions. Moisture strictly within 11%. Fast weighbridge dispatch." },
        { reviewer: "Sahyadri FPO", score: 5, date: "24 Aug 2026", comment: "Consistently top-tier Grade A export grade. Highly professional grower." }
      ]
    },
    "farmer_gurpreet": {
      name: "Gurpreet Singh",
      overallRating: 4.8,
      totalReviews: 36,
      verified: true,
      criteria: { quality: 4.8, moisture: 4.9, packaging: 4.7 },
      reviews: [
        { reviewer: "ITC Aashirvaad", score: 5, date: "29 Aug 2026", comment: "Clean Sharbati wheat, zero foreign matter. Direct rail silo delivery." }
      ]
    }
  },
  buyers: {
    "buyer_itc": {
      name: "ITC Agri Business",
      overallRating: 4.9,
      totalReviews: 124,
      verified: true,
      criteria: { dbtPayment: 5.0, weighment: 4.9, contractHonor: 4.9 },
      reviews: [
        { reviewer: "Ramesh Patil (Farmer)", score: 5, date: "02 Sep 2026", comment: "Payment cleared directly in SBI account within 10 minutes of APMC weighbridge clearance!" },
        { reviewer: "Gurpreet Singh (Farmer)", score: 5, date: "30 Aug 2026", comment: "Zero dispute on moisture deduction. 100% fair digital scale weights." }
      ]
    },
    "buyer_sahyadri": {
      name: "Sahyadri Farmers Producer Co.",
      overallRating: 5.0,
      totalReviews: 88,
      verified: true,
      criteria: { dbtPayment: 5.0, weighment: 5.0, contractHonor: 5.0 },
      reviews: [
        { reviewer: "Vithalrao Shinde", score: 5, date: "01 Sep 2026", comment: "Best FPO in Maharashtra. Prompt assistance and zero distress cuts." }
      ]
    }
  }
};

window.initRatingSystem = function() {
  window.renderReputationDashboard();
};

window.renderReputationDashboard = function() {
  const container = document.getElementById('reputationReviewsContainer');
  if (!container) return;

  container.innerHTML = '';

  // Render Farmers Reputation Cards
  const sectionTitle = document.createElement('h4');
  sectionTitle.className = 'rep-group-title';
  sectionTitle.innerHTML = `🌾 Verified Producer Star Ratings`;
  container.appendChild(sectionTitle);

  Object.values(window.REPUTATION_DATABASE.farmers).forEach(f => {
    const card = document.createElement('div');
    card.className = 'rep-card';
    card.innerHTML = `
      <div class="rep-card-header">
        <div class="rep-user-info">
          <span class="user-avatar">👨‍🌾</span>
          <div>
            <strong>${f.name}</strong>
            <div class="verified-tag">
              <span class="green-shield">🛡️ 100% Verified e-NAM Farmer</span>
              <span>(${f.totalReviews} Institutional Reviews)</span>
            </div>
          </div>
        </div>
        <div class="rep-overall-score">
          <span class="gold-star">★</span>
          <span class="score-num">${f.overallRating.toFixed(1)}</span>
        </div>
      </div>
      <div class="rep-criteria-bars">
        <div class="crit-row">
          <span>Produce Quality & Grading Accuracy</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(f.criteria.quality / 5) * 100}%"></div></div>
          <strong>${f.criteria.quality}</strong>
        </div>
        <div class="crit-row">
          <span>Moisture & Sorting Standards</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(f.criteria.moisture / 5) * 100}%"></div></div>
          <strong>${f.criteria.moisture}</strong>
        </div>
        <div class="crit-row">
          <span>Packaging & On-Time Loading</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(f.criteria.packaging / 5) * 100}%"></div></div>
          <strong>${f.criteria.packaging}</strong>
        </div>
      </div>
      <div class="rep-recent-comments">
        <em>"${f.reviews[0]?.comment || 'Reliable and verified producer.'}"</em>
        <small class="text-muted">— ${f.reviews[0]?.reviewer || 'APMC Auditor'}</small>
      </div>
    `;
    container.appendChild(card);
  });

  // Render Buyers Reputation Cards
  const buyerTitle = document.createElement('h4');
  buyerTitle.className = 'rep-group-title';
  buyerTitle.style.marginTop = '24px';
  buyerTitle.innerHTML = `🏢 Institutional Buyer Trust Ratings`;
  container.appendChild(buyerTitle);

  Object.values(window.REPUTATION_DATABASE.buyers).forEach(b => {
    const card = document.createElement('div');
    card.className = 'rep-card';
    card.innerHTML = `
      <div class="rep-card-header">
        <div class="rep-user-info">
          <span class="user-avatar">🏢</span>
          <div>
            <strong>${b.name}</strong>
            <div class="verified-tag">
              <span class="green-shield">🛡️ Verified Corporate Buyer</span>
              <span>(${b.totalReviews} Farmer Reviews)</span>
            </div>
          </div>
        </div>
        <div class="rep-overall-score">
          <span class="gold-star">★</span>
          <span class="score-num">${b.overallRating.toFixed(1)}</span>
        </div>
      </div>
      <div class="rep-criteria-bars">
        <div class="crit-row">
          <span>Instant DBT Payment Settlement</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(b.criteria.dbtPayment / 5) * 100}%"></div></div>
          <strong>${b.criteria.dbtPayment}</strong>
        </div>
        <div class="crit-row">
          <span>Fair Weighment Practices</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(b.criteria.weighment / 5) * 100}%"></div></div>
          <strong>${b.criteria.weighment}</strong>
        </div>
        <div class="crit-row">
          <span>Contract Honor & Professional Conduct</span>
          <div class="crit-bar-track"><div class="crit-bar-fill" style="width: ${(b.criteria.contractHonor / 5) * 100}%"></div></div>
          <strong>${b.criteria.contractHonor}</strong>
        </div>
      </div>
      <div class="rep-recent-comments">
        <em>"${b.reviews[0]?.comment || 'Prompt settlement and professional conduct.'}"</em>
        <small class="text-muted">— ${b.reviews[0]?.reviewer || 'Farmer Reviewer'}</small>
      </div>
    `;
    container.appendChild(card);
  });
};

// Open Rating Modal
window.openRateFarmerModal = function() {
  window.openModal('rateFarmerModal');
};

window.openRateBuyerModal = function() {
  window.openModal('rateBuyerModal');
};

window.submitFarmerRating = function(event) {
  event.preventDefault();
  const farmerId = document.getElementById('rateFarmerSelect').value;
  const qScore = parseFloat(document.getElementById('rateFarmerQuality').value);
  const mScore = parseFloat(document.getElementById('rateFarmerMoisture').value);
  const pScore = parseFloat(document.getElementById('rateFarmerPackaging').value);
  const comment = document.getElementById('rateFarmerComment').value.trim();

  const avg = ((qScore + mScore + pScore) / 3).toFixed(1);
  const farmer = window.REPUTATION_DATABASE.farmers[farmerId];
  if (farmer) {
    farmer.totalReviews += 1;
    farmer.reviews.unshift({
      reviewer: window.currentUser ? window.currentUser.name : "Institutional Buyer",
      score: parseFloat(avg),
      date: "Today",
      comment: comment || "Produce inspected and verified up to standard specifications."
    });
  }

  window.closeModal('rateFarmerModal');
  window.renderReputationDashboard();
  if (typeof window.showToast === 'function') {
    window.showToast("Farmer rating submitted and verified badge updated!");
  }
};

window.submitBuyerRating = function(event) {
  event.preventDefault();
  const buyerId = document.getElementById('rateBuyerSelect').value;
  const dScore = parseFloat(document.getElementById('rateBuyerDbt').value);
  const wScore = parseFloat(document.getElementById('rateBuyerWeighment').value);
  const cScore = parseFloat(document.getElementById('rateBuyerConduct').value);
  const comment = document.getElementById('rateBuyerComment').value.trim();

  const avg = ((dScore + wScore + cScore) / 3).toFixed(1);
  const buyer = window.REPUTATION_DATABASE.buyers[buyerId];
  if (buyer) {
    buyer.totalReviews += 1;
    buyer.reviews.unshift({
      reviewer: window.currentUser ? window.currentUser.name : "Local Farmer",
      score: parseFloat(avg),
      date: "Today",
      comment: comment || "Payment settled via direct bank transfer without delay."
    });
  }

  window.closeModal('rateBuyerModal');
  window.renderReputationDashboard();
  if (typeof window.showToast === 'function') {
    window.showToast("Buyer rating submitted successfully!");
  }
};
