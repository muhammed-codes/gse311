class Timer {
  constructor() {
    this.timeDisplay = document.getElementById("time-display");
    this.toggleBtn = document.getElementById("toggle-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.statusLabel = document.getElementById("status-label");
    this.modeBtns = document.querySelectorAll(".mode-btn");
    this.circle = document.querySelector(".progress-ring__circle");

    this.radius = this.circle.r.baseVal.value;
    this.circumference = 2 * Math.PI * this.radius;

    // Setup circle
    this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.style.strokeDashoffset = 0;

    this.timeLeft = 25 * 60;
    this.initialTime = 25 * 60;
    this.timerId = null;
    this.isRunning = false;

    this.modes = {
      focus: { time: 25 * 60, label: "FOCUS", color: "#5e6ad2" },
      "short-break": { time: 5 * 60, label: "SHORT BREAK", color: "#2ecc71" },
      "long-break": { time: 15 * 60, label: "LONG BREAK", color: "#e74c3c" },
    };

    this.currentMode = "focus";

    this.initEventListeners();
    this.updateDisplay();
  }

  initEventListeners() {
    this.toggleBtn.addEventListener("click", () => this.toggleTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());

    this.modeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mode = e.target.dataset.mode;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    if (this.currentMode === mode) return;

    // UI updates
    this.modeBtns.forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

    // Stop current timer
    this.stopTimer();

    // Update state
    this.currentMode = mode;
    const modeData = this.modes[mode];

    this.initialTime = modeData.time;
    this.timeLeft = this.initialTime;
    this.statusLabel.textContent = modeData.label;

    // Update styling
    document.documentElement.style.setProperty(
      "--accent-color",
      modeData.color
    );
    document.querySelector(".bg-gradient-1").style.background = modeData.color;

    this.updateDisplay();
    this.setProgress(1); // Full circle
  }

  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.toggleBtn.textContent = "Pause";
    this.toggleBtn.style.background = "var(--surface-color)"; // Dim button when running
    this.toggleBtn.style.color = "var(--text-primary)";

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();

      const progress = this.timeLeft / this.initialTime;
      this.setProgress(progress);

      if (this.timeLeft <= 0) {
        this.timerFinished();
      }
    }, 1000);
  }

  stopTimer() {
    if (!this.isRunning) return;

    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;

    this.toggleBtn.textContent = "Start";
    this.toggleBtn.style.background = "var(--accent-color)";
    this.toggleBtn.style.color = "white";
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.initialTime;
    this.updateDisplay();
    this.setProgress(1);
  }

  timerFinished() {
    this.stopTimer();
    this.timeLeft = 0;
    this.updateDisplay();

    // Simple notification sound or alert could be added here
    // For now, just a visual reset after a delay
    setTimeout(() => {
      this.resetTimer();
    }, 1000);
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;

    const displayString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    this.timeDisplay.textContent = displayString;
    document.title = `${displayString} - Focus`;
  }

  setProgress(percent) {
    const offset = this.circumference - percent * this.circumference;
    this.circle.style.strokeDashoffset = offset;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const timer = new Timer();
});
