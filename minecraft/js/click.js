document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".button");
  const audio = new Audio("audio/click.wav");
  audio.volume = 0.05;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });
  });
});
