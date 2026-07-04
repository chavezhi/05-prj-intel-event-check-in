// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const storageKey = "intelEventCheckInData";

// Track attendance
let count = 0;
const maxCount = 50;

function getWinningTeam() {
  const teams = ["water", "zero", "power"];
  let winningTeam = teams[0];
  let highestCount = -1;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const teamCounter = document.getElementById(team + "Count");
    const teamCount = parseInt(teamCounter.textContent, 10);

    if (teamCount > highestCount) {
      highestCount = teamCount;
      winningTeam = team;
    }
  }

  return winningTeam;
}

function updateProgress() {
  attendeeCount.textContent = count;

  const percentage = Math.min(100, Math.round((count / maxCount) * 100));
  progressBar.style.width = percentage + "%";
}

function saveCounts() {
  const storageData = {
    total: count,
    water: parseInt(document.getElementById("waterCount").textContent, 10),
    zero: parseInt(document.getElementById("zeroCount").textContent, 10),
    power: parseInt(document.getElementById("powerCount").textContent, 10),
  };

  localStorage.setItem(storageKey, JSON.stringify(storageData));
}

function loadCounts() {
  const savedData = localStorage.getItem(storageKey);

  if (savedData) {
    const parsedData = JSON.parse(savedData);
    count = parseInt(parsedData.total, 10) || 0;

    const teams = ["water", "zero", "power"];

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const teamCounter = document.getElementById(team + "Count");
      const savedTeamCount = parseInt(parsedData[team], 10) || 0;
      teamCounter.textContent = savedTeamCount;
    }

    updateProgress();

    if (count >= maxCount) {
      const winningTeam = getWinningTeam();
      const winningOption = teamSelect.querySelector(
        "option[value='" + winningTeam + "']",
      );
      let winningLabel = winningTeam;

      if (winningOption) {
        winningLabel = winningOption.text;
      }

      greeting.innerHTML =
        "🎉 Goal reached! The winning team is <strong>" +
        winningLabel +
        "</strong>!";
      greeting.className = "success-message";
      greeting.style.display = "block";
    }
  } else {
    updateProgress();
  }
}

loadCounts();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Increment count
  count++;

  // Update attendee count on the page
  updateProgress();

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  // Show welcome or celebration message
  if (count >= maxCount) {
    const winningTeam = getWinningTeam();
    const winningOption = teamSelect.querySelector(
      "option[value='" + winningTeam + "']",
    );
    let winningLabel = winningTeam;

    if (winningOption) {
      winningLabel = winningOption.text;
    }

    greeting.innerHTML =
      "🎉 Goal reached! The winning team is <strong>" +
      winningLabel +
      "</strong>!";
  } else {
    greeting.textContent = "🎉Welcome, " + name + " from " + teamName + "!";
  }

  greeting.className = "success-message";
  greeting.style.display = "block";

  saveCounts();
  form.reset();
});
