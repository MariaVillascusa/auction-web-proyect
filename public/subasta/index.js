const DATE = new Date("05/21/2021 0:01 AM");
const DAYS = document.getElementById("days");
const HOURS = document.getElementById("hours");
const MINUTES = document.getElementById("minutes");
const SECONDS = document.getElementById("seconds");
const MILLISECONDS_OF_A_SECOND = 1000;
const MILLISECONDS_OF_A_MINUTE = MILLISECONDS_OF_A_SECOND * 60;
const MILLISECONDS_OF_A_HOUR = MILLISECONDS_OF_A_MINUTE * 60;
const MILLISECONDS_OF_A_DAY = MILLISECONDS_OF_A_HOUR * 24;

var currentBid;
var nextBid = currentBid + currentBid * 0.1;
var bidlist = [];
const spanCurrentBid = document.getElementById("price");
const spanNextBid = document.getElementById("next");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btnDirectBid = document.getElementById("direct-bid-btn");
const inputBid = document.getElementById("direct-input");
const bodyTableBids = document.getElementById("table-bids-body");
const alert = document.getElementById("alert");
const confirmPanel = document.getElementById("confirm");
const confirmBtn = document.getElementById("confirmbtn");
const cancelBtn = document.getElementById("cancelbtn");
const loading = document.getElementById("loading");

const h3 = document.getElementById("name-article");
const img = document.getElementById("img");
const description = document.getElementById("description");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnPurchase = document.getElementById("btn-purchase");
var counter = 12;

const le = 37;
const up = 38;
const ri = 39;
const down = 40;

const HOST = "http://localhost:9200/index.php?articleId=";
let id = 0001;

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

request();

function request() {
  let direction = HOST + id;

  fetch(direction, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      showArticle(data);
      getStorage();
      getList();
      setCurrentBid();
      loading.style.display = "none";
      buttonsClick();
      keysChange();

      updateCountdown();
      setInterval(updateCountdown, MILLISECONDS_OF_A_SECOND);
      clickFastBid();
      directBid();
    });
}
function showArticle(data) {
  h3.textContent = data.name;
  img.src = data.image;

  description.innerHTML = `
        <p id="pdescription"><strong>Descripción:</strong> ${data.description}</p>
        `;
  directPurchase(data);
  setCurrentBid();
}

function directPurchase(data) {
  var price = Math.ceil(data.price / 14);
  var purchasePrice = Math.ceil(data.price + data.price * 0.14);
  btnPurchase.textContent = `Compra por:\n ${purchasePrice}€`;
  currentBid = price;
  if (currentBid >= data.price) {
    btnPurchase.syle.display = "none";
  }
}

function setCurrentBid() {
  spanCurrentBid.textContent = currentBid;
  nextBid = Math.ceil(parseFloat(currentBid) + parseFloat(currentBid * 0.1));
  spanNextBid.textContent = nextBid;
  inputBid.value = Math.ceil(nextBid);

  btn1.textContent = Math.ceil(nextBid) + "€";
  btn2.textContent = Math.ceil(nextBid + nextBid * 0.05) + "€";
  btn3.textContent = Math.ceil(nextBid + nextBid * 0.1) + "€";
}

function clickFastBid() {
  document.querySelectorAll(".click").forEach((element) => {
    element.addEventListener("click", (e) => {
      const id = e.target.getAttribute("id");
      const button = document.getElementById(id);
      fastBid(button);
    });
  });
}

function fastBid(button) {
  currentBid = button.textContent.slice(0, button.textContent.length - 1);
  confirm();
}

let counterStorage = 1;

function updateList() {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();

  recordStorage = {
    user: "user",
    bid: currentBid,
    time: time,
    date: date,
  };
  localStorage.setItem(id + "" + counterStorage, JSON.stringify(recordStorage));
  counterStorage++;
  alert.classList.add("d-none");
  getList();
  //setCurrentBid();
}

function getList() {
  bodyTableBids.innerHTML = "";
  for (var i = localStorage.length; i >= 0; i--) {
    let key = id + "" + i;
    var local = JSON.parse(localStorage.getItem(key));
    if (local != null) {
      var tdUser = document.createElement("td");
      let tdBid = document.createElement("td");
      let tdTime = document.createElement("td");
      let tdDate = document.createElement("td");
      tdUser.textContent = local["user"];
      tdBid.textContent = local["bid"];
      tdTime.textContent = local["time"];
      tdDate.textContent = local["date"];
      let row = document.createElement("tr");
      row.appendChild(tdUser);
      row.appendChild(tdBid);
      row.appendChild(tdTime);
      row.appendChild(tdDate);
      bodyTableBids.appendChild(row);
    }
  }
}

function getStorage() {
  for (var i = 1; i <= localStorage.length; i++) {
    let key = id + "" + i;
    var local = JSON.parse(localStorage.getItem(key));
    if (local != null) {
      currentBid = local["bid"];
    }
  }
}

function directBid() {
  keysInput();
  btnDirectBid.onclick = () => {
    validate();
  };
}

function keysInput() {
  inputBid.onclick = () => {
    document.onkeydown = (tecla) => {
      var keyPress = tecla.keyCode;
      if (keyPress == up) {
        inputBid.value++;
      } else if (keyPress == down) {
        inputBid.value--;
      }
    };
  };
}

function validate() {
  switch (true) {
    case inputBid.value == "":
      alert.classList.remove("d-none");
      alert.textContent = "Error. El campo no puede estar vacío.";
      inputBid.value = nextBid;
      break;
    case inputBid.value < nextBid:
      alert.classList.remove("d-none");
      alert.textContent =
        "Error. El valor introducido debe ser mayor que el precio establecido para la próxima puja.";
      inputBid.value = nextBid;
      break;
    case inputBid.value % 1 != 0:
      alert.classList.remove("d-none");
      alert.textContent = "Error. Introduce un número entero.";
      inputBid.value = nextBid;
      break;
    case !Number(inputBid.value):
      alert.classList.remove("d-none");
      alert.textContent = "Error. Introduce un número entero.";
      inputBid.value = nextBid;
      break;
    default:
      alert.classList.add("d-none");
      currentBid = inputBid.value;
      confirm();
      break;
  }
}

function confirm() {
  confirmPanel.style.display = "block";
  clickCancel();
  clickConfirm();
}

function clickCancel() {
  cancelBtn.onclick = () => {
    confirmPanel.style.display = "none";
  };
}

function clickConfirm() {
  confirmBtn.onclick = () => {
    confirmPanel.style.display = "none";
    setCurrentBid();
    updateList();
  };
}

function buttonsClick(articles) {
  var articles = articles;

  btnPrev.onclick = () => {
    left(articles);
  };
  btnNext.onclick = () => {
    rigth(articles);
  };
}

function rigth() {
  if (id < 4) {
    counter++;
    id++;
    request();
  }
}

function left() {
  if (id > 1) {
    counter--;
    id--;
    request();
  }
}

function keysChange() {
  document.onkeydown = (key) => {
    var pressKey = key.keyCode;
    if (pressKey == ri) {
      rigth();
    } else if (pressKey == le) {
      left();
    }
  };
}

function updateCountdown() {
  const NOW = new Date();
  const DURATION = DATE - NOW;
  const RESULT_DAYS = Math.floor(DURATION / MILLISECONDS_OF_A_DAY);
  const RESULT_HOURS = Math.floor(
    (DURATION % MILLISECONDS_OF_A_DAY) / MILLISECONDS_OF_A_HOUR
  );
  const RESULT_MINUTES = Math.floor(
    (DURATION % MILLISECONDS_OF_A_HOUR) / MILLISECONDS_OF_A_MINUTE
  );
  const RESULT_SECONDS = Math.floor(
    (DURATION % MILLISECONDS_OF_A_MINUTE) / MILLISECONDS_OF_A_SECOND
  );

  DAYS.textContent = RESULT_DAYS;
  HOURS.textContent = RESULT_HOURS;
  MINUTES.textContent = RESULT_MINUTES;
  SECONDS.textContent = RESULT_SECONDS;
}
