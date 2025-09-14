const feedback = document.getElementById("feedback");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const submitBtn = document.getElementById("submitBtn");

feedback.addEventListener("input", () => {
  const text = feedback.value;
  charCount.innerText = text.length;

  const words = text.trim().split(/\s+/);
  wordCount.innerText = text.trim() === "" ? 0 : words.length;

  submitBtn.disabled = text.trim() === "";
});

submitBtn.addEventListener("click", () => {
  alert(" Feedback submitted! Thank you.");
  feedback.value = "";
  charCount.innerText = 0;
  wordCount.innerText = 0;
  submitBtn.disabled = true;
});