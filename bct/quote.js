const quotes = [
  "Be yourself; everyone else is already taken. – Oscar Wilde",
  "In the middle of difficulty lies opportunity. – Albert Einstein",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "Life is what happens when you're busy making other plans. – John Lennon",
  "The best way to get started is to quit talking and begin doing. – Walt Disney"
];

const quoteText = document.getElementById("quoteText");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// Pick and display a random quote
function generateQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  quoteText.innerText = quotes[index];
}

// Toggle dark/light mode
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeButtonText(isDark);
}

// Update the button text based on theme
function updateThemeButtonText(isDark) {
  themeToggleBtn.textContent = isDark ? "Light Theme" : "Dark Theme";
}

// Apply saved theme on load
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  if (isDark) {
    document.body.classList.add("dark-mode");
  }

  updateThemeButtonText(isDark);
};
