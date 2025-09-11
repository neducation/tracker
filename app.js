// Betta Breeding Tracker - Main Application
class BettaTracker {
  constructor() {
    this.batches = [];
    this.currentBatch = null;
    this.editingBatchId = null;

    this.init();
  }

  init() {
    this.loadData();
    this.initializeEventListeners();
    this.updateCurrentDate();
    this.renderDashboard();

    // Hide loading screen and show app
    setTimeout(() => {
      document.getElementById("loading-screen").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("app").classList.add("loaded");
      }, 300);
    }, 1500);
  }

  // Data Management
  loadData() {
    const saved = localStorage.getItem("bettaTracker");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.batches = data.batches || [];
      } catch (e) {
        console.error("Error loading data:", e);
        this.batches = [];
      }
    }
  }

  saveData() {
    try {
      const data = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        batches: this.batches,
      };
      localStorage.setItem("bettaTracker", JSON.stringify(data));
    } catch (e) {
      console.error("Error saving data:", e);
      this.showToast("Error saving data", "error");
    }
  }

  // Event Listeners
  initializeEventListeners() {
    // Navigation
    document.getElementById("add-batch-btn").addEventListener("click", () => {
      this.showAddBatchForm();
    });

    document
      .getElementById("back-to-dashboard")
      .addEventListener("click", () => {
        this.showScreen("dashboard");
      });

    document
      .getElementById("back-to-dashboard-detail")
      .addEventListener("click", () => {
        this.showScreen("dashboard");
      });

    // Form handling
    document.getElementById("batch-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveBatch();
    });

    document.getElementById("cancel-form").addEventListener("click", () => {
      this.showScreen("dashboard");
    });

    document.getElementById("edit-batch-btn").addEventListener("click", () => {
      this.editCurrentBatch();
    });

    // Import/Export
    document.getElementById("export-btn").addEventListener("click", () => {
      this.exportData();
    });

    document.getElementById("import-btn").addEventListener("click", () => {
      document.getElementById("import-file").click();
    });

    document.getElementById("import-file").addEventListener("change", (e) => {
      this.importData(e.target.files[0]);
    });

    // Auto-calculate dates
    document.getElementById("eggs-laid").addEventListener("change", () => {
      this.autoCalculateDates();
    });
  }

  // Navigation
  showScreen(screenName) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(`${screenName}-screen`).classList.add("active");
  }

  showAddBatchForm() {
    this.editingBatchId = null;
    document.getElementById("form-title").textContent = "Add New Batch";
    document.getElementById("batch-form").reset();

    // Set today as default eggs laid date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("eggs-laid").value = today;
    this.autoCalculateDates();

    this.showScreen("batch-form");
  }

  showBatchDetail(batchId) {
    const batch = this.batches.find((b) => b.id === batchId);
    if (!batch) return;

    this.currentBatch = batch;
    this.renderBatchDetail(batch);
    this.showScreen("batch-detail");
  }

  editCurrentBatch() {
    if (!this.currentBatch) return;

    this.editingBatchId = this.currentBatch.id;
    document.getElementById("form-title").textContent = "Edit Batch";
    this.populateForm(this.currentBatch);
    this.showScreen("batch-form");
  }

  // Date Calculations
  autoCalculateDates() {
    const eggsLaidInput = document.getElementById("eggs-laid");
    const hatchInput = document.getElementById("hatch-date");
    const freeSwimInput = document.getElementById("free-swim-date");

    if (eggsLaidInput.value && !hatchInput.value) {
      const eggsDate = new Date(eggsLaidInput.value);
      const hatchDate = new Date(eggsDate);
      hatchDate.setDate(hatchDate.getDate() + 2);
      hatchInput.value = hatchDate.toISOString().split("T")[0];
    }

    if (eggsLaidInput.value && !freeSwimInput.value) {
      const eggsDate = new Date(eggsLaidInput.value);
      const freeSwimDate = new Date(eggsDate);
      freeSwimDate.setDate(freeSwimDate.getDate() + 4);
      freeSwimInput.value = freeSwimDate.toISOString().split("T")[0];
    }
  }

  updateCurrentDate() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("current-date").textContent =
      now.toLocaleDateString("en-US", options);
  }

  // Batch Calculations
  calculateBatchAge(batch) {
    const today = new Date();
    const eggsDate = new Date(batch.eggsLaidDate);
    const hatchDate = new Date(batch.hatchDate);

    const daysSinceEggs = Math.floor(
      (today - eggsDate) / (1000 * 60 * 60 * 24)
    );
    const daysSinceHatch = Math.floor(
      (today - hatchDate) / (1000 * 60 * 60 * 24)
    );

    return {
      daysSinceEggs,
      daysSinceHatch: daysSinceHatch >= 0 ? daysSinceHatch : 0,
      isHatched: today >= hatchDate,
    };
  }

  getBatchPhase(batch) {
    const age = this.calculateBatchAge(batch);
    const today = new Date();
    const hatchDate = new Date(batch.hatchDate);
    const freeSwimDate = new Date(batch.freeSwimDate);

    if (today < hatchDate) {
      return { name: "Incubation", icon: "🥚", phase: "incubation" };
    } else if (today < freeSwimDate) {
      return { name: "Hatch/Yolk", icon: "🐣", phase: "hatch" };
    } else if (age.daysSinceHatch < 4) {
      return { name: "Free-swim", icon: "🌊", phase: "freeswim" };
    } else if (age.daysSinceHatch < 15) {
      return { name: "Fry (BBS)", icon: "🐟", phase: "fry" };
    } else {
      return { name: "Juvenile", icon: "🧒", phase: "juvenile" };
    }
  }

  getTodaysActions(batch) {
    const age = this.calculateBatchAge(batch);
    const phase = this.getBatchPhase(batch);
    const today = new Date();
    const actions = [];

    switch (phase.phase) {
      case "incubation":
        actions.push({
          icon: "🤫",
          text: "Keep surface calm; do not feed",
          urgent: false,
        });
        break;

      case "hatch":
        actions.push({
          icon: "👀",
          text: "Observe tails hanging; no feeding yet",
          urgent: false,
        });
        break;

      case "freeswim":
        if (!batch.maleRemoved) {
          actions.push({
            icon: "🚫♂️",
            text: "Remove male today if still present",
            urgent: true,
          });
        }
        actions.push({
          icon: "🍽️",
          text: "Start first foods (infusoria/vinegar eels) 3-4× daily",
          urgent: false,
        });
        break;

      case "fry":
        actions.push({
          icon: "🦐",
          text: "Feed BBS morning & evening (watch orange bellies)",
          urgent: false,
        });

        // Water change every other day from DPH 4
        if (age.daysSinceHatch >= 4) {
          const daysSinceChange = this.getDaysSinceLastWaterChange(batch);
          if (daysSinceChange >= 2) {
            actions.push({
              icon: "💧",
              text: "10-20% gentle water change with pre-warmed water",
              urgent: daysSinceChange > 3,
            });
          }
        }
        break;

      case "juvenile":
        actions.push({
          icon: "🥘",
          text: "Trial micro-pellets; maintain frequent small changes",
          urgent: false,
        });

        // Weekly size sorting
        const weeksSinceHatch = Math.floor(age.daysSinceHatch / 7);
        const hatchDay = new Date(batch.hatchDate).getDay();
        const todayDay = today.getDay();

        if (weeksSinceHatch >= 4 && hatchDay === todayDay) {
          actions.push({
            icon: "📏",
            text: "Size sort juveniles weekly",
            urgent: false,
          });
        }

        // Jarring males
        if (age.daysSinceHatch >= 42) {
          // 6 weeks
          actions.push({
            icon: "🫙",
            text: "Monitor for male aggression; jar when needed",
            urgent: false,
          });
        }
        break;
    }

    return actions;
  }

  getDaysSinceLastWaterChange(batch) {
    // For demo purposes, assume last change was 2 days ago
    // In a real app, you'd track this per batch
    return 2;
  }

  // Form Handling
  populateForm(batch) {
    document.getElementById("batch-name").value = batch.name;
    document.getElementById("eggs-laid").value = batch.eggsLaidDate;
    document.getElementById("hatch-date").value = batch.hatchDate;
    document.getElementById("free-swim-date").value = batch.freeSwimDate;
    document.getElementById("notes").value = batch.notes || "";
    document.getElementById("male-removed").checked =
      batch.maleRemoved || false;

    // Parent info
    if (batch.male) {
      document.getElementById("male-color").value = batch.male.color || "";
      document.getElementById("male-pattern").value = batch.male.pattern || "";
      document.getElementById("male-fin").value = batch.male.finType || "";
    }

    if (batch.female) {
      document.getElementById("female-color").value = batch.female.color || "";
      document.getElementById("female-pattern").value =
        batch.female.pattern || "";
      document.getElementById("female-fin").value = batch.female.finType || "";
    }
  }

  saveBatch() {
    const formData = new FormData(document.getElementById("batch-form"));

    const batch = {
      id: this.editingBatchId || Date.now().toString(),
      name: document.getElementById("batch-name").value,
      eggsLaidDate: document.getElementById("eggs-laid").value,
      hatchDate: document.getElementById("hatch-date").value,
      freeSwimDate: document.getElementById("free-swim-date").value,
      notes: document.getElementById("notes").value,
      maleRemoved: document.getElementById("male-removed").checked,
      male: {
        color: document.getElementById("male-color").value,
        pattern: document.getElementById("male-pattern").value,
        finType: document.getElementById("male-fin").value,
      },
      female: {
        color: document.getElementById("female-color").value,
        pattern: document.getElementById("female-pattern").value,
        finType: document.getElementById("female-fin").value,
      },
      createdAt: this.editingBatchId
        ? this.batches.find((b) => b.id === this.editingBatchId)?.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.editingBatchId) {
      const index = this.batches.findIndex((b) => b.id === this.editingBatchId);
      if (index !== -1) {
        this.batches[index] = batch;
      }
    } else {
      this.batches.push(batch);
    }

    this.saveData();
    this.renderDashboard();
    this.showScreen("dashboard");
    this.showToast(
      this.editingBatchId
        ? "Batch updated successfully"
        : "Batch added successfully",
      "success"
    );
  }

  // Genetics Predictions
  getGeneticsPredictions(batch) {
    const male = batch.male;
    const female = batch.female;

    if (!male.color || !female.color) {
      return {
        "3 days": "Transparent/grey; no true color visible yet",
        "3 weeks": "Hints of pigment may appear at fin edges",
        "3 months": "Basic color patterns should be visible",
      };
    }

    const predictions = {};

    // 3 days (DPH 3)
    predictions["3 days"] = "Transparent/grey; no true color visible yet";

    // 3 weeks
    let threeWeekColor = "";
    if (male.color === "red" && female.color === "white") {
      threeWeekColor = "Hints of pink/red wash may appear";
    } else if (male.color === "red" && female.color === "red") {
      threeWeekColor = "Subtle red pigment may show at fin edges";
    } else if (male.color === "blue" && female.color === "red") {
      threeWeekColor = "Mixed metallic hints possible";
    } else {
      threeWeekColor = "Subtle pigment hints at fins/body edges";
    }
    predictions["3 weeks"] = threeWeekColor;

    // 3 months
    let threeMonthColor = "";
    if (male.color === "red" && female.color === "white") {
      threeMonthColor =
        "Likely pastel/cellophane with red wash. Red may fade over time.";
    } else if (male.color === "red" && female.color === "red") {
      threeMonthColor =
        "Mostly reds with varying intensity. Some copper tones possible.";
    } else if (male.color === "blue" && female.color === "red") {
      threeMonthColor = "Mixed metallics. Butterfly patterns possible.";
    } else {
      threeMonthColor = "Color patterns should be mostly visible.";
    }

    // Add marble warning
    if (
      male.pattern === "marble" ||
      female.pattern === "marble" ||
      male.color === "marble" ||
      female.color === "marble"
    ) {
      threeMonthColor +=
        " ⚠️ Marble genetics present - colors may continue changing.";
    }

    // Add fin type prediction
    if (male.finType && female.finType) {
      if (male.finType === "halfmoon" || female.finType === "halfmoon") {
        threeMonthColor += ` Fin distribution: ~60% delta/HM-leaning, ~40% ${
          male.finType === "halfmoon" ? female.finType : male.finType
        }-leaning.`;
      }
    }

    predictions["3 months"] = threeMonthColor;

    return predictions;
  }

  // Rendering
  renderDashboard() {
    const container = document.getElementById("batches-container");
    const emptyState = document.getElementById("empty-state");

    if (this.batches.length === 0) {
      container.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    container.style.display = "block";
    emptyState.style.display = "none";

    container.innerHTML = this.batches
      .map((batch) => {
        const age = this.calculateBatchAge(batch);
        const phase = this.getBatchPhase(batch);
        const actions = this.getTodaysActions(batch);

        return `
                <div class="batch-card" onclick="app.showBatchDetail('${
                  batch.id
                }')">
                    <div class="batch-header">
                        <div class="batch-name">${batch.name}</div>
                        <div class="batch-phase">
                            <span>${phase.icon}</span>
                            <span>${phase.name}</span>
                        </div>
                    </div>
                    
                    <div class="batch-info">
                        <span>Age: ${
                          age.isHatched
                            ? `${age.daysSinceHatch} DPH`
                            : `D+${age.daysSinceEggs}`
                        }</span>
                        <span>•</span>
                        <span>${this.formatDate(batch.eggsLaidDate)}</span>
                    </div>
                    
                    <div class="batch-timeline">
                        ${this.renderMiniTimeline(batch)}
                    </div>
                    
                    <div class="batch-actions">
                        <h4>Today's Actions:</h4>
                        <ul class="action-list">
                            ${actions
                              .slice(0, 3)
                              .map(
                                (action) => `
                                <li class="action-item ${
                                  action.urgent ? "urgent" : ""
                                }">
                                    <span class="action-icon">${
                                      action.icon
                                    }</span>
                                    <span>${action.text}</span>
                                </li>
                            `
                              )
                              .join("")}
                        </ul>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderMiniTimeline(batch) {
    const today = new Date();
    const eggsDate = new Date(batch.eggsLaidDate);
    const hatchDate = new Date(batch.hatchDate);
    const freeSwimDate = new Date(batch.freeSwimDate);

    const steps = [
      { icon: "🥚", date: eggsDate, label: "Eggs" },
      { icon: "🐣", date: hatchDate, label: "Hatch" },
      { icon: "🌊", date: freeSwimDate, label: "Free-swim" },
    ];

    return steps
      .map((step) => {
        let className = "timeline-step";
        if (today >= step.date) {
          className += " completed";
        } else if (today.toDateString() === step.date.toDateString()) {
          className += " current";
        } else {
          className += " future";
        }

        return `
                <div class="${className}">
                    <span>${step.icon}</span>
                    <span>${step.label}</span>
                </div>
            `;
      })
      .join(" → ");
  }

  renderBatchDetail(batch) {
    // Update header
    document.getElementById("detail-batch-name").textContent = batch.name;

    // Render timeline
    this.renderDetailTimeline(batch);

    // Update status
    const age = this.calculateBatchAge(batch);
    const phase = this.getBatchPhase(batch);

    document.getElementById("current-phase-icon").textContent = phase.icon;
    document.getElementById("current-phase-name").textContent = phase.name;
    document.getElementById("current-age-info").textContent = `Age: ${
      age.isHatched
        ? `${age.daysSinceHatch} DPH`
        : `D+${age.daysSinceEggs} (${age.daysSinceHatch} DPH)`
    }`;

    // Render actions
    const actions = this.getTodaysActions(batch);
    const actionsContainer = document.getElementById("detail-actions-list");
    actionsContainer.innerHTML = actions
      .map(
        (action) => `
            <div class="action-card ${action.urgent ? "urgent" : ""}">
                <div class="action-icon">${action.icon}</div>
                <div class="action-text">${
                  action.urgent
                    ? "<strong>" + action.text + "</strong>"
                    : action.text
                }</div>
            </div>
        `
      )
      .join("");

    // Render genetics
    const predictions = this.getGeneticsPredictions(batch);
    const geneticsContainer = document.getElementById("genetics-predictions");
    geneticsContainer.innerHTML = Object.entries(predictions)
      .map(
        ([age, prediction]) => `
            <div class="genetics-age-group">
                <h4>At ${age}:</h4>
                <div class="genetics-prediction">${prediction}</div>
            </div>
        `
      )
      .join("");

    // Render parents
    const parentsContainer = document.getElementById("parents-info");
    parentsContainer.innerHTML = `
            <div class="parents-grid">
                <div class="parent-card">
                    <h4>♂️ Male</h4>
                    ${
                      batch.male.color
                        ? `<div class="parent-trait"><span class="trait-label">Color:</span><span class="trait-value">${this.formatTraitValue(
                            batch.male.color
                          )}</span></div>`
                        : ""
                    }
                    ${
                      batch.male.pattern
                        ? `<div class="parent-trait"><span class="trait-label">Pattern:</span><span class="trait-value">${this.formatTraitValue(
                            batch.male.pattern
                          )}</span></div>`
                        : ""
                    }
                    ${
                      batch.male.finType
                        ? `<div class="parent-trait"><span class="trait-label">Fin Type:</span><span class="trait-value">${this.formatTraitValue(
                            batch.male.finType
                          )}</span></div>`
                        : ""
                    }
                </div>
                <div class="parent-card">
                    <h4>♀️ Female</h4>
                    ${
                      batch.female.color
                        ? `<div class="parent-trait"><span class="trait-label">Color:</span><span class="trait-value">${this.formatTraitValue(
                            batch.female.color
                          )}</span></div>`
                        : ""
                    }
                    ${
                      batch.female.pattern
                        ? `<div class="parent-trait"><span class="trait-label">Pattern:</span><span class="trait-value">${this.formatTraitValue(
                            batch.female.pattern
                          )}</span></div>`
                        : ""
                    }
                    ${
                      batch.female.finType
                        ? `<div class="parent-trait"><span class="trait-label">Fin Type:</span><span class="trait-value">${this.formatTraitValue(
                            batch.female.finType
                          )}</span></div>`
                        : ""
                    }
                </div>
            </div>
        `;

    // Render notes
    document.getElementById("batch-notes").textContent = batch.notes || "";
  }

  renderDetailTimeline(batch) {
    const today = new Date();
    const eggsDate = new Date(batch.eggsLaidDate);
    const hatchDate = new Date(batch.hatchDate);
    const freeSwimDate = new Date(batch.freeSwimDate);

    const timeline = document.getElementById("batch-timeline");

    const timelineItems = [
      {
        icon: "🥚",
        label: `Eggs Laid\n${this.formatDate(batch.eggsLaidDate)}`,
        date: eggsDate,
      },
      {
        icon: "🐣",
        label: `Hatch\n${this.formatDate(batch.hatchDate)}`,
        date: hatchDate,
      },
      {
        icon: "🌊",
        label: `Free-swim\n${this.formatDate(batch.freeSwimDate)}`,
        date: freeSwimDate,
      },
    ];

    timeline.innerHTML = timelineItems
      .map((item) => {
        let className = "timeline-item";
        if (today > item.date) {
          className += " completed";
        } else if (today.toDateString() === item.date.toDateString()) {
          className += " current";
        } else {
          className += " future";
        }

        return `
                <div class="${className}">
                    <div class="timeline-icon">${item.icon}</div>
                    <div class="timeline-label">${item.label}</div>
                </div>
            `;
      })
      .join("");
  }

  // Import/Export
  exportData() {
    const data = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      batches: this.batches,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `betta-tracker-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast("Data exported successfully", "success");
  }

  importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.batches && Array.isArray(data.batches)) {
          this.batches = data.batches;
          this.saveData();
          this.renderDashboard();
          this.showToast("Data imported successfully", "success");
        } else {
          this.showToast("Invalid file format", "error");
        }
      } catch (error) {
        this.showToast("Error reading file", "error");
      }
    };
    reader.readAsText(file);
  }

  // Utilities
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  formatTraitValue(value) {
    return (
      value.charAt(0).toUpperCase() + value.slice(1).replace(/([A-Z])/g, " $1")
    );
  }

  showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = document.querySelector(".toast-icon");
    const messageEl = document.querySelector(".toast-message");

    // Set content
    messageEl.textContent = message;

    // Set icon based on type
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
    };
    icon.textContent = icons[type] || icons.success;

    // Set classes
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new BettaTracker();
});

// Service Worker registration for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
