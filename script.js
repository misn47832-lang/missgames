const moneyEl = document.getElementById('money');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const orderText = document.getElementById('orderText');
const restartButton = document.getElementById('restartButton');
const shopCards = Array.from(document.querySelectorAll('.shop-card'));

let money = 25000;
let score = 0;
let timeLeft = 60;
let currentOrder = null;
let timerInterval = null;

const orders = [
  { text: 'Pelanggan butuh wortel segar!', match: 'Wortel', bonus: 15 },
  { text: 'Tolong bawa bayam hijau.', match: 'Bayam', bonus: 12 },
  { text: 'Saya ingin tomat manis.', match: 'Tomat', bonus: 10 },
  { text: 'Butuh kubis untuk sup.', match: 'Kubis', bonus: 14 },
  { text: 'Jagung bakar, ya!', match: 'Jagung', bonus: 18 },
  { text: 'Terong untuk sayur lodeh.', match: 'Terong', bonus: 11 }
];

function formatMoney(value) {
  return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function updateStatus() {
  moneyEl.textContent = formatMoney(money);
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      clearInterval(timerInterval);
      orderText.textContent = 'Waktu habis! Klik mulai ulang untuk bermain lagi.';
      shopCards.forEach(card => card.querySelector('button').disabled = true);
    }
    updateStatus();
  }, 1000);
}

function nextOrder() {
  const random = orders[Math.floor(Math.random() * orders.length)];
  currentOrder = random;
  orderText.textContent = random.text;
}

function resetGame() {
  money = 25000;
  score = 0;
  timeLeft = 60;
  updateStatus();
  nextOrder();
  shopCards.forEach(card => card.querySelector('button').disabled = false);
  startTimer();
}

function showMessage(text) {
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  document.body.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1300);
}

shopCards.forEach(card => {
  card.querySelector('button').addEventListener('click', () => {
    if (timeLeft <= 0) return;
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const value = Number(card.dataset.value);

    if (money < price) {
      showMessage('Uangnya kurang kawan!');
      return;
    }

    money -= price;
    score += value;
    updateStatus();

    if (currentOrder && name === currentOrder.match) {
      score += currentOrder.bonus;
      money += 1500;
      showMessage('Yess! Pesanan cocok + bonus');
      nextOrder();
    } else {
      showMessage('Wah, salah pesanan. Coba lagi!');
    }
  });
});

restartButton.addEventListener('click', resetGame);

resetGame();
