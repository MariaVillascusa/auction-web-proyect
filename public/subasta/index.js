const DATE = new Date('05/14/2021 0:01 AM');
const DAYS = document.getElementById('days');
const HOURS = document.getElementById('hours');
const MINUTES = document.getElementById('minutes');
const SECONDS = document.getElementById('seconds');
const MILLISECONDS_OF_A_SECOND = 1000;
const MILLISECONDS_OF_A_MINUTE = MILLISECONDS_OF_A_SECOND * 60;
const MILLISECONDS_OF_A_HOUR = MILLISECONDS_OF_A_MINUTE * 60;
const MILLISECONDS_OF_A_DAY = MILLISECONDS_OF_A_HOUR * 24

var currentBid;
var nextBid = currentBid + (currentBid * 0.10);
var bidlist = [];
const spanCurrentBid = document.getElementById('price');
const spanNextBid = document.getElementById('next');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btnDirectBid = document.getElementById('direct-bid-btn');
const inputBid = document.getElementById('direct-input');
const bodyTableBids = document.getElementById('table-bids-body');
const alert = document.getElementById('alert');
const confirmPanel = document.getElementById('confirm');
const confirmBtn = document.getElementById('confirmbtn');
const cancelBtn = document.getElementById('cancelbtn');
const loading = document.getElementById('loading');

const h3 = document.getElementById('name-article');
const img = document.getElementById('img');
const description = document.getElementById('description');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnPurchase = document.getElementById('btn-purchase');
var counter = 12;

const le = 37;
const up = 38;
const ri = 39;
const down = 40;

const HOST = "http://localhost:9200/index.php?";
let id = 1;
let direction = HOST + id;
console.log(direction);
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
fetch(direction, requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        //.catch(error => console.log('error', error))
        //.then(res => res.json())
        // .then(data => {

        showArticle(counter, data);
        loading.style.display = 'none';
        buttonsClick(data);
        keysChange(data);

        updateCountdown();
        setInterval(updateCountdown, MILLISECONDS_OF_A_SECOND);
        clickFastBid();
        directBid();
    });

function showArticle(counter, data) {
    h3.textContent = data[counter].title;
    img.src = data[counter].image;

    description.innerHTML = `
        <p id="pcategory"><strong>Categoría:</strong> ${data[counter].category}</p><br/>
        <p id="pdescription"><strong>Descripción:</strong> ${data[counter].description}</p>
        `
    directPurchase(data);
    setCurrentBid();
}

function directPurchase(data) {
    var price = Math.ceil((data[counter].price) / 14);
    var purchasePrice = Math.ceil(data[counter].price + (data[counter].price * 0.14))
    btnPurchase.textContent = `Compra por:\n ${purchasePrice}€`
    currentBid = price;
    if (currentBid >= data[counter].price) {
        btnPurchase.syle.display = 'none';
    }
}

function setCurrentBid() {

    spanCurrentBid.textContent = currentBid;
    nextBid = Math.ceil(parseFloat(currentBid) + parseFloat(currentBid * 0.10));
    spanNextBid.textContent = nextBid;
    inputBid.value = Math.ceil(nextBid);

    btn1.textContent = Math.ceil(nextBid) + "€";
    btn2.textContent = (Math.ceil(nextBid + (nextBid * 0.05))) + "€";
    btn3.textContent = (Math.ceil(nextBid + (nextBid * 0.1))) + "€";
}

function clickFastBid() {
    document.querySelectorAll(".click").forEach(element => {
        element.addEventListener("click", e => {
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

function updateList() {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    var tdUser = document.createElement('td').textContent = "user";
    var tdBid = document.createElement('td').textContent = currentBid;
    var tdTime = document.createElement('td').textContent = time;
    var tdDate = document.createElement('td').textContent = date;
    let record = [tdUser, tdBid, tdTime, tdDate];

    alert.classList.add('d-none');
    bidlist.reverse();
    bidlist.push(record);
    bodyTableBids.innerHTML = "";
    updateRecords(bidlist);
}

function updateRecords(bidlist) {
    bidlist.reverse();
    for (var records of bidlist) {
        let row = document.createElement('tr')
        for (var r of records) {
            var td = document.createElement('td')
            td.textContent = r;
            row.appendChild(td)
        }
        bodyTableBids.appendChild(row);
    }
}

function directBid() {
    keysInput();
    btnDirectBid.onclick = () => {
        validate();
    }
}

function keysInput() {
    inputBid.onclick = () => {
        document.onkeydown = (tecla) => {
            var keyPress = tecla.keyCode;
            if (keyPress == up) {
                inputBid.value++;
            }
            else if (keyPress == down) {
                inputBid.value--;
            }
        }
    }
}

function validate() {

    switch (true) {
        case (inputBid.value == ""):
            alert.classList.remove('d-none');
            alert.textContent = 'Error. El campo no puede estar vacío.';
            inputBid.value = nextBid;
            break;
        case (inputBid.value < nextBid):
            alert.classList.remove('d-none');
            alert.textContent = 'Error. El valor introducido debe ser mayor que el precio establecido para la próxima puja.';
            inputBid.value = nextBid;
            break;
        case (inputBid.value % 1 != 0):
            alert.classList.remove('d-none');
            alert.textContent = 'Error. Introduce un número entero.';
            inputBid.value = nextBid;
            break;
        case (!Number(inputBid.value)):
            alert.classList.remove('d-none');
            alert.textContent = 'Error. Introduce un número entero.';
            inputBid.value = nextBid;
            break;
        default:
            alert.classList.add('d-none');
            currentBid = inputBid.value
            confirm();
            break;
    }
}

function confirm() {
    confirmPanel.style.display = 'block';
    clickCancel();
    clickConfirm();
}

function clickCancel() {
    cancelBtn.onclick = () => {
        confirmPanel.style.display = 'none';
    }
}

function clickConfirm() {
    confirmBtn.onclick = () => {
        confirmPanel.style.display = 'none';
        setCurrentBid();
        updateList();
    }
}

function buttonsClick(articles) {
    var articles = articles;

    btnPrev.onclick = () => {
        left(articles);
    }
    btnNext.onclick = () => {
        rigth(articles);
    }
}

function rigth(articles) {
    if (counter <= articles.length - 2) {
        counter++;
        id++;
        showArticle(counter, articles);
    }
}

function left(articles) {
    if (counter > 0) {
        counter--;
        id--;
        showArticle(counter, articles);
    }
}

function keysChange(articles) {
    var articles = articles;
    document.onkeydown = (key) => {

        var pressKey = key.keyCode;
        if (pressKey == ri) {
            rigth(articles);
        }
        else if (pressKey == le) {
            left(articles);
        }
    }
}

function updateCountdown() {

    const NOW = new Date()
    const DURATION = DATE - NOW;
    const RESULT_DAYS = Math.floor(DURATION / MILLISECONDS_OF_A_DAY);
    const RESULT_HOURS = Math.floor((DURATION % MILLISECONDS_OF_A_DAY) / MILLISECONDS_OF_A_HOUR);
    const RESULT_MINUTES = Math.floor((DURATION % MILLISECONDS_OF_A_HOUR) / MILLISECONDS_OF_A_MINUTE);
    const RESULT_SECONDS = Math.floor((DURATION % MILLISECONDS_OF_A_MINUTE) / MILLISECONDS_OF_A_SECOND);

    DAYS.textContent = RESULT_DAYS;
    HOURS.textContent = RESULT_HOURS;
    MINUTES.textContent = RESULT_MINUTES;
    SECONDS.textContent = RESULT_SECONDS;
}
