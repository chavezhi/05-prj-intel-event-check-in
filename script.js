// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

// Track attendance
let count = 0;
const maxCount = 10;

function getWinningTeam() {
  const teams = ["water", "zero", "power"];
  let winningTeam = teams[0];
  let highestCount = -1;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const teamCount = parseInt(
      document.getElementById(team + "Count").textContent,
      10,
    );

    if (teamCount > highestCount) {
      highestCount = teamCount;
      winningTeam = team;
    }
  }

  return winningTeam;
}

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
  attendeeCount.textContent = count;

  // Update progress bar width
  const percentage = Math.min(100, Math.round((count / maxCount) * 100));
  progressBar.style.width = percentage + "%";

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  // Show welcome or celebration message
  if (count >= maxCount) {
    const winningTeam = getWinningTeam();
    const winningTeamName = document
      .getElementById(winningTeam + "Count")
      .id.replace("Count", "");
    const winningLabel = teamSelect.querySelector(
      "option[value='" + winningTeam + "']",
    )?.text;

    greeting.innerHTML = `🎉 Goal reached! The winning team is <strong>${winningLabel || winningTeamName}</strong>!`;
  } else {
    greeting.textContent = `🎉Welcome, ${name} from ${teamName}!`;
  }

  greeting.className = "success-message";
  greeting.style.display = "block";

  form.reset();
});
