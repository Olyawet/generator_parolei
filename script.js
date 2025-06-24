// Символы для генерации
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{},.<>?/|~';

function getRandomChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function generatePassword(opts) {
  let chars = '';
  if (opts.lowercase) chars += LOWER;
  if (opts.uppercase) chars += UPPER;
  if (opts.numbers) chars += NUMBERS;
  if (opts.symbols) chars += SYMBOLS;
  if (!chars) return '';
  let pwd = '';
  for (let i = 0; i < opts.length; i++) {
    pwd += getRandomChar(chars);
  }
  return pwd;
}

function estimateStrength(pwd, opts) {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (opts.lowercase && opts.uppercase) score++;
  if (opts.numbers) score++;
  if (opts.symbols) score++;
  if (pwd.length >= 18) score++;
  if (score <= 1) return {text: 'Слабый', class: 'weak'};
  if (score <= 3) return {text: 'Средний', class: 'medium'};
  return {text: 'Сильный', class: 'strong'};
}

// DOM элементы
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const lowercase = document.getElementById('lowercase');
const uppercase = document.getElementById('uppercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const generateBtn = document.getElementById('generate');
const generateMultiBtn = document.getElementById('generate-multi');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const multiPasswords = document.getElementById('multi-passwords');
const themeToggle = document.getElementById('theme-toggle');

function getOptions() {
  return {
    length: +lengthInput.value,
    lowercase: lowercase.checked,
    uppercase: uppercase.checked,
    numbers: numbers.checked,
    symbols: symbols.checked
  };
}

function updatePassword() {
  const opts = getOptions();
  const pwd = generatePassword(opts);
  passwordInput.value = pwd;
  updateStrength(pwd, opts);
  multiPasswords.classList.add('hidden');
}

function updateStrength(pwd, opts) {
  const res = estimateStrength(pwd, opts);
  strengthBar.className = res.class;
  strengthText.textContent = 'Надёжность: ' + res.text;
}

lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
  // updatePassword(); // убрано
});
[lowercase, uppercase, numbers, symbols].forEach(el => {
  el.addEventListener('change', () => {
    // updatePassword(); // убрано
  });
});
generateBtn.addEventListener('click', updatePassword);

copyBtn.addEventListener('click', () => {
  passwordInput.select();
  document.execCommand('copy');
  copyBtn.textContent = 'Скопировано!';
  setTimeout(() => copyBtn.textContent = 'Скопировать', 1200);
});

generateMultiBtn.addEventListener('click', () => {
  const opts = getOptions();
  let count = 5;
  let pwds = [];
  for (let i = 0; i < count; i++) {
    pwds.push(generatePassword(opts));
  }
  multiPasswords.innerHTML = pwds.map(p => `<input type="text" readonly value="${p}">`).join('');
  multiPasswords.classList.remove('hidden');
});

// Тема
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark'));
});
(function initTheme() {
  const saved = localStorage.getItem('theme');
  setTheme(saved === 'dark');
})();
