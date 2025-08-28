// ===== PART 1: VARIABLE DECLARATIONS =====

// Array to store mood entries
let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

// Object mapping mood types to emojis and colors
const moodData = {
  lit: {
    emoji: "😎",
    color: "#ffdd59",
    message: "Feeling lit! Today is absolutely fire! 🔥",
  },
  good: {
    emoji: "😊",
    color: "#78e08f",
    message: "Good vibes only! You're slaying! 💅",
  },
  meh: {
    emoji: "😐",
    color: "#f6b93b",
    message: "It's a meh day. That's valid. 🤷‍♀️",
  },
  sad: {
    emoji: "😔",
    color: "#546de5",
    message: "Sending virtual hugs! It's okay to not be okay. 🫂",
  },
  angy: {
    emoji: "😠",
    color: "#ff6b6b",
    message: "Big angy energy! Let's channel that into something positive. 💪",
  },
};

// Current selected mood
let currentMood = null;

// DOM elements
const moodOptions = document.querySelectorAll(".mood-option");
const logMoodBtn = document.getElementById("logMood");
const analyzeBtn = document.getElementById("analyze");
const clearBtn = document.getElementById("clear");
const moodHistoryContainer = document.getElementById("moodHistory");
const vibeMessage = document.getElementById("vibeMessage");
const statsSection = document.getElementById("statsSection");

// ===== PART 2: CUSTOM FUNCTIONS =====

function logMood() {
  if (!currentMood) {
    vibeMessage.textContent = "Please select a mood first!";
    vibeMessage.style.color = "#ff6b6b";
    return;
  }

  const newEntry = {
    mood: currentMood,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
  };

  moodHistory.push(newEntry);
  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

  updateMoodHistory();
  updateStats();

  vibeMessage.innerHTML = `Your <strong>${currentMood}</strong> vibe has been logged! ${moodData[currentMood].emoji}`;
  vibeMessage.style.color = moodData[currentMood].color;

  resetSelection();
}

function analyzeMoods() {
  if (moodHistory.length === 0) {
    vibeMessage.textContent = "No mood data to analyze. Log some moods first!";
    return;
  }

  const moodCounts = {};
  for (let i = 0; i < moodHistory.length; i++) {
    const mood = moodHistory[i].mood;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  }

  let mostCommonMood = null;
  let maxCount = 0;

  for (const mood in moodCounts) {
    if (moodCounts[mood] > maxCount) {
      mostCommonMood = mood;
      maxCount = moodCounts[mood];
    }
  }

  const analysisMessage = `Based on ${moodHistory.length} entries, your most common vibe is <strong>${mostCommonMood}</strong> ${moodData[mostCommonMood].emoji}. `;
  let advice = "";

  switch (mostCommonMood) {
    case "lit":
      advice =
        "You're consistently vibing! Keep spreading that positive energy! ✨";
      break;
    case "good":
      advice =
        "Your energy is mostly positive! Remember to hydrate and slay! 💅";
      break;
    case "meh":
      advice =
        "Lots of meh days. Maybe try something new to spice things up? 🌶️";
      break;
    case "sad":
      advice =
        "You've had some tough times. Remember, it's okay to ask for help. 🫂";
      break;
    case "angy":
      advice =
        "You've been feeling frustrated. Channel that energy into something creative! 🎨";
      break;
  }

  vibeMessage.innerHTML = analysisMessage + advice;
  vibeMessage.style.color = moodData[mostCommonMood].color;
}

function updateMoodHistory() {
  moodHistoryContainer.innerHTML = "";

  if (moodHistory.length === 0) {
    moodHistoryContainer.innerHTML =
      "<p>No vibe history yet. Log your first vibe!</p>";
    return;
  }

  for (let i = moodHistory.length - 1; i >= 0; i--) {
    const entry = moodHistory[i];
    const entryElement = document.createElement("div");
    entryElement.className = "mood-entry";
    entryElement.innerHTML = `
            <div class="mood-emoji">${moodData[entry.mood].emoji}</div>
            <div>
                <div>${entry.mood.toUpperCase()} vibe</div>
                <div style="font-size: 0.8rem; opacity: 0.7;">${
                  entry.date
                }</div>
            </div>
        `;
    moodHistoryContainer.appendChild(entryElement);
  }
}

function updateStats() {
  statsSection.innerHTML = "";

  if (moodHistory.length === 0) return;

  const moodCounts = {};
  for (let i = 0; i < moodHistory.length; i++) {
    const mood = moodHistory[i].mood;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  }

  for (const mood in moodData) {
    if (moodCounts[mood] > 0) {
      const percentage = Math.round(
        (moodCounts[mood] / moodHistory.length) * 100
      );
      const statBox = document.createElement("div");
      statBox.className = "stat-box";
      statBox.innerHTML = `
                <div style="font-size: 1.8rem;">${moodData[mood].emoji}</div>
                <div>${percentage}%</div>
                <div style="font-size: 0.8rem;">${moodCounts[mood]} entries</div>
            `;
      statBox.style.backgroundColor = moodData[mood].color;
      statBox.style.color = "#000";
      statsSection.appendChild(statBox);
    }
  }

  const totalBox = document.createElement("div");
  totalBox.className = "stat-box";
  totalBox.innerHTML = `
        <div style="font-size: 1.8rem;">📊</div>
        <div>Total</div>
        <div style="font-size: 1.2rem;">${moodHistory.length}</div>
    `;
  statsSection.appendChild(totalBox);
}

// ===== PART 3: DOM INTERACTIONS =====

moodOptions.forEach((option) => {
  option.addEventListener("click", function () {
    moodOptions.forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");
    currentMood = this.getAttribute("data-mood");
    vibeMessage.textContent = moodData[currentMood].message;
    vibeMessage.style.color = moodData[currentMood].color;
  });
});

logMoodBtn.addEventListener("click", logMood);
analyzeBtn.addEventListener("click", analyzeMoods);

clearBtn.addEventListener("click", function () {
  if (
    confirm(
      "Are you sure you want to clear your vibe history? This cannot be undone."
    )
  ) {
    moodHistory = [];
    localStorage.removeItem("moodHistory");
    updateMoodHistory();
    updateStats();
    vibeMessage.textContent =
      "Vibe history cleared! Start fresh with a new vibe.";
    vibeMessage.style.color = "#f8f8f2";
  }
});

// ===== HELPER =====
function resetSelection() {
  currentMood = null;
  moodOptions.forEach((opt) => opt.classList.remove("selected"));
}

// ===== INIT =====
updateMoodHistory();
updateStats();
