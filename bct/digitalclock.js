const clock = document.getElementById("clock");
const greeting = document.getElementById("greeting");

function updateTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let greetText = "";

  if (hours >= 5 && hours < 12) {
    greetText = "Good Morning";
    document.body.classList.remove("dark");
  } else if (hours >= 12 && hours < 18) {
    greetText = "Good Afternoon";
    document.body.classList.remove("dark");
  } else {
    greetText = "Good Evening";
    document.body.classList.add("dark");
  }

  greeting.textContent = greetText;

  // Format with leading 0s
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  clock.textContent = formattedTime;
}

// Update every 1 sec
setInterval(updateTime, 1000);

// Run immediately once on load 
updateTime();