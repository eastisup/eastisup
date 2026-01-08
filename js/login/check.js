// Load shared cookie utilities
const script = document.createElement('script');
script.src = '/js/utils/cookies.js';
document.head.appendChild(script);

script.onload = function() {
  function logout() {
    deleteCookie("auth");
    window.location.href = "index.html";
  }

  window.onload = function () {
    const auth = getCookie("auth");
    if (auth !== "true") {
      window.location.href = "index.html";
    }
  };

  // Make logout function available globally
  window.logout = logout;
};
