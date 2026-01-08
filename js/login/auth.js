// Load shared cookie utilities
const script = document.createElement('script');
script.src = '/js/utils/cookies.js';
document.head.appendChild(script);

const correctHash =
  "f21422b8132869d93946efa33085637491db338d569c987e41cc0b81634502aa";

async function sha256(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  const inputHash = await sha256(input);

  if (inputHash === correctHash) {
    setCookie("auth", "true", 7);
    window.location.href = "loggedin.html";
  } else {
    alert("Incorrect password");
  }
}

document
  .getElementById("passwordInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      checkPassword();
    }
  });
