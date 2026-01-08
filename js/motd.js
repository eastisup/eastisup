fetch("/js/motd.json")
  .then((response) => response.json())
  .then((data) => {
    const text = data.text;
    let randomMessage = "";

    randomMessage = text[Math.floor(Math.random() * text.length)];

    const randomDiv = document.getElementById("random");
    randomDiv.textContent = randomMessage;
  });
