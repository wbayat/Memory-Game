document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn").addEventListener("click", startGame);
});

var level = 4;
function startGame() {
  var mistakes = 0;
  var time = 2;
  var timer = 1000 * time;
  var tileId = 0;
  var selected = [];
  var secret = generatePattern(level);
  const message = document.getElementById("message");
  const container = document.getElementById("container");
  const btn = document.getElementById("btn");
  btn.removeEventListener("click", startGame);
  btn.innerHTML = "Submit";

  container.style.gridTemplateColumns = `repeat(${level}, auto)`;
  container.innerHTML = "";

  for (let i = 0; i < level ** 2; i++) {
    var tile = document.createElement("div");
    tile.id = tileId.toString();
    tileId++;
    tile.classList.add("tile");
    container.appendChild(tile);
  }

  message.innerHTML = time;
  time--;
  var interval = setInterval(() => {
    message.innerHTML = time;
    time--;
    if (time == -1) {
      message.innerHTML = "Enter the pattern!";
      clearInterval(interval);
      for (let i = 0; i < level ** 2; i++) {
        var tile = document.getElementById(i.toString());
        tile.addEventListener("click", tileClick);
      }
      btn.addEventListener("click", evaluate);
    }
  }, 1000);

  secret.map((id) => {
    document.getElementById(id.toString()).classList.add("tile-on");
  });
  setTimeout(() => {
    secret.map((id) => {
      document.getElementById(id.toString()).classList.remove("tile-on");
    });
  }, timer);

  /**
   * turns the tiles on or off
   * @param {Event} e
   */
  const tileClick = (e) => {
    if (selected.includes(e.target.id)) {
      selected = selected.filter((item) => item !== e.target.id);
      document.getElementById(e.target.id).classList.remove("tile-on");
    } else {
      selected.push(e.target.id);
      document.getElementById(e.target.id).classList.add("tile-on");
    }
  };

  const evaluate = () => {
    btn.removeEventListener("click", evaluate);
    for (let i = 0; i < level ** 2; i++) {
      var tile = document.getElementById(i.toString());
      tile.removeEventListener("click", tileClick);
    }
    for (let i = 0; i < selected.length; i++) {
      if (!secret.includes(selected[i])) {
        document.getElementById(selected[i]).classList.add("wrong");
        mistakes++;
      } else {
        document.getElementById(selected[i]).classList.add("correct");
      }
    }
    for (let i = 0; i < secret.length; i++) {
      if (!selected.includes(secret[i])) {
        document.getElementById(secret[i]).classList.add("miss");
        mistakes++;
      }
    }
    if (mistakes < 4) {
      message.innerHTML = `You WON with ${mistakes} mistakes!`;
      level++;
      btn.innerHTML = "Next Level";
    } else {
      message.innerHTML = `You LOST with ${mistakes} mistakes!`;
      level = 4;
      btn.innerHTML = "Restart";
    }
    btn.addEventListener("click", startGame);
    tileId = 0;
    selected = [];
  };
}

/**
 *
 * @param {Number} n
 * @returns an array of size (2/3 n^2) which contains integers between 0 and n^2
 */
function generatePattern(n) {
  var secret = [];
  for (let i = 0; i < n ** 2 / 3; i++) {
    var num = Math.floor(Math.random() * n ** 2);
    if (!secret.includes(num.toString())) {
      secret.push(num.toString());
    } else {
      i--;
    }
  }
  return secret;
}
