// Load shared cookie utilities
const script = document.createElement('script');
script.src = '/js/utils/cookies.js';
document.head.appendChild(script);

script.onload = function() {
  window.onload = function () {
    const visited = getCookie("visited");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (visited) {
      welcomeMessage.textContent = "Welcome back to Trench";
    } else {
      welcomeMessage.textContent = "Welcome to Trench";
      setCookie("visited", "true", 365);
    }
  };
};
