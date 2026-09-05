/**
 * Multi-Account Manager & 1-Click Profile Switcher
 * Role Switcher: Farmer Entryway vs Corporate Buyer Entryway
 */

window.PRECONFIGURED_PROFILES = [
  {
    id: "farmer_ramesh",
    name: "Ramesh Patil",
    role: "farmer",
    roleTitle: "Farmer (Progressive Grape & Onion Grower)",
    location: "Nashik, Maharashtra",
    state: "Maharashtra",
    district: "Nashik",
    mobile: "+91 98220 14590",
    idType: "Aadhaar",
    idNumber: "XXXX-XXXX-8921",
    verified: true,
    rating: 4.9,
    reviewsCount: 38,
    bankStatus: "DBT Linked (SBI Nashik Branch)",
    avatar: "🌾"
  },
  {
    id: "farmer_gurpreet",
    name: "Gurpreet Singh",
    role: "farmer",
    roleTitle: "Farmer (Wheat & Basmati Specialist)",
    location: "Ludhiana, Punjab",
    state: "Punjab",
    district: "Ludhiana",
    mobile: "+91 98140 77213",
    idType: "Aadhaar",
    idNumber: "XXXX-XXXX-4512",
    verified: true,
    rating: 4.8,
    reviewsCount: 42,
    bankStatus: "DBT Linked (PNB Ludhiana Grain Market)",
    avatar: "🚜"
  },
  {
    id: "buyer_itc",
    name: "ITC Agri Business",
    role: "buyer",
    roleTitle: "Institutional Wholesale Buyer (e-Choupal Division)",
    location: "Mumbai, Maharashtra",
    state: "Maharashtra",
    district: "Mumbai",
    mobile: "+91 22 2831 8000",
    idType: "GSTIN",
    idNumber: "27AAACI1681G1Z0",
    verified: true,
    rating: 4.9,
    reviewsCount: 156,
    bankStatus: "Corporate Escrow Pre-Funded (HDFC Bank)",
    avatar: "🏢"
  },
  {
    id: "buyer_sahyadri",
    name: "Sahyadri Farmers Producer Co.",
    role: "buyer", // acts as FPO Aggregator & Buyer
    roleTitle: "FPO Aggregator & Institutional Buyer",
    location: "Mohadi, Nashik, Maharashtra",
    state: "Maharashtra",
    district: "Nashik",
    mobile: "+91 253 283 5000",
    idType: "CIN/FPO Reg",
    idNumber: "U01122MH2011PTC212345",
    verified: true,
    rating: 5.0,
    reviewsCount: 94,
    bankStatus: "FPO Multi-Commodity Escrow (ICICI Bank)",
    avatar: "🤝"
  }
];

// Active State
window.currentUser = null;
window.currentRole = 'farmer'; // 'farmer' or 'buyer'

window.initAuth = function() {
  const savedProfileId = localStorage.getItem('kisan_active_profile_id') || 'farmer_ramesh';
  const savedRole = localStorage.getItem('kisan_active_role') || 'farmer';

  let found = window.PRECONFIGURED_PROFILES.find(p => p.id === savedProfileId);
  if (!found) {
    found = window.PRECONFIGURED_PROFILES[0];
  }
  window.currentUser = found;
  window.currentRole = savedRole;

  window.renderProfileUI();
  window.applyRoleView(window.currentRole);
};

window.switchProfile = function(profileId) {
  const profile = window.PRECONFIGURED_PROFILES.find(p => p.id === profileId);
  if (profile) {
    window.currentUser = profile;
    localStorage.setItem('kisan_active_profile_id', profile.id);
    
    // Automatically switch entryway to match profile's native role
    window.setRole(profile.role);
    window.renderProfileUI();
    
    // Show toast
    if (typeof window.showToast === 'function') {
      window.showToast(`Switched profile to ${profile.name} (${profile.roleTitle})`);
    }

    // Trigger updates
    if (typeof window.renderLotsDashboard === 'function') {
      window.renderLotsDashboard();
    }
  }
};

window.setRole = function(role) {
  window.currentRole = role;
  localStorage.setItem('kisan_active_role', role);
  window.applyRoleView(role);
};

window.applyRoleView = function(role) {
  const farmerSection = document.getElementById('farmerCockpitSection');
  const buyerSection = document.getElementById('buyerPortalSection');
  const btnFarmerRole = document.getElementById('btnRoleFarmer');
  const btnBuyerRole = document.getElementById('btnRoleBuyer');

  if (role === 'farmer') {
    if (farmerSection) farmerSection.style.display = 'block';
    if (buyerSection) buyerSection.style.display = 'none';
    if (btnFarmerRole) {
      btnFarmerRole.classList.add('active-role');
      btnFarmerRole.classList.remove('inactive-role');
    }
    if (btnBuyerRole) {
      btnBuyerRole.classList.remove('active-role');
      btnBuyerRole.classList.add('inactive-role');
    }
  } else {
    if (farmerSection) farmerSection.style.display = 'none';
    if (buyerSection) buyerSection.style.display = 'block';
    if (btnFarmerRole) {
      btnFarmerRole.classList.remove('active-role');
      btnFarmerRole.classList.add('inactive-role');
    }
    if (btnBuyerRole) {
      btnBuyerRole.classList.add('active-role');
      btnBuyerRole.classList.remove('inactive-role');
    }
  }
};

window.renderProfileUI = function() {
  const profileBadge = document.getElementById('currentProfileBadge');
  const profileNameEl = document.getElementById('profileNameDisplay');
  const profileRoleEl = document.getElementById('profileRoleDisplay');
  const profileLocEl = document.getElementById('profileLocationDisplay');

  if (profileNameEl && window.currentUser) {
    profileNameEl.textContent = window.currentUser.name;
  }
  if (profileRoleEl && window.currentUser) {
    profileRoleEl.textContent = window.currentUser.roleTitle;
  }
  if (profileLocEl && window.currentUser) {
    profileLocEl.textContent = `${window.currentUser.avatar} ${window.currentUser.location}`;
  }

  // Synchronize dropdown switcher if present
  const profileSelector = document.getElementById('profileQuickSelect');
  if (profileSelector && window.currentUser) {
    profileSelector.value = window.currentUser.id;
  }
};

// Register New Account Modal Handler
window.registerNewAccount = function(event) {
  event.preventDefault();
  const form = document.getElementById('accountCreationForm');
  if (!form) return;

  const name = form.accountName.value.trim();
  const role = form.accountRole.value;
  const mobile = form.accountMobile.value.trim();
  const idNumber = form.accountIdNumber.value.trim();
  const state = form.accountState.value.trim();
  const district = form.accountDistrict.value.trim();

  if (!name || !mobile || !idNumber || !state || !district) {
    alert("Please fill in all required registration fields.");
    return;
  }

  const newId = `user_${Date.now()}`;
  const newProfile = {
    id: newId,
    name: name,
    role: role,
    roleTitle: role === 'farmer' ? `Farmer (${district})` : `Wholesale Buyer (${district})`,
    location: `${district}, ${state}`,
    state: state,
    district: district,
    mobile: `+91 ${mobile}`,
    idType: role === 'farmer' ? 'Aadhaar' : 'GSTIN',
    idNumber: idNumber,
    verified: true,
    rating: 5.0,
    reviewsCount: 1,
    bankStatus: "DBT Account Linked & Verified",
    avatar: role === 'farmer' ? "🌾" : "🏢"
  };

  window.PRECONFIGURED_PROFILES.push(newProfile);
  
  // Re-populate select options
  const profileSelector = document.getElementById('profileQuickSelect');
  if (profileSelector) {
    const opt = document.createElement('option');
    opt.value = newProfile.id;
    opt.textContent = `${newProfile.avatar} ${newProfile.name} (${newProfile.roleTitle})`;
    profileSelector.appendChild(opt);
  }

  window.switchProfile(newId);

  // Close modal
  window.closeModal('accountCreationModal');
  if (typeof window.showToast === 'function') {
    window.showToast(`Account registered successfully for ${newProfile.name}!`);
  }
};
