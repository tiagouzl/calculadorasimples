const display = document.getElementById('display');
const history = document.getElementById('history');
let currentInput = '';
let previousInput = '';
let operation = null;
let error = '';

function updateDisplay() {
    if (error) {
        history.textContent = '';
        display.textContent = error;
        display.classList.add('error');
        return;
    }
    display.classList.remove('error');
    const preview = previewResult();
    if (preview !== null) {
        history.textContent = `${fmtDisplay(previousInput)} ${operation} ${fmtDisplay(currentInput)} = ${fmtDisplay(preview)}`;
    } else {
        history.textContent = operation ? `${fmtDisplay(previousInput)} ${operation}` : '';
    }
    display.textContent = fmtDisplay(currentInput);
}

// Formatação pt-BR só para exibição ("1250" → "1.250", "0.5" → "0,5").
// A precisão interna nunca muda: tudo continua parseFloat com ponto.
function fmtDisplay(s) {
    if (s === '' || s === null || s === undefined) return '0';
    if (/e/i.test(s) || !isFinite(Number(s))) return s; // erro ou exponencial: exibe cru
    let sign = '';
    let int = s;
    let dec;
    if (s.includes('.')) [int, dec] = s.split('.');
    if (int.startsWith('-')) { sign = '-'; int = int.slice(1); }
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let out = sign + (int === '' ? '0' : int);
    if (dec !== undefined) out += ',' + dec;
    else if (s.endsWith('.')) out += ',';
    return out;
}

// Preview vivo: calcula sobre os operandos atuais sem tocar no estado.
function previewResult() {
    if (!operation || previousInput === '' || currentInput === '') return null;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return null;
    const result = compute(prev, current, operation);
    return result.error ? null : result.value;
}

// Núcleo puro do cálculo; operate() e o preview usam o mesmo caminho.
function compute(prev, current, op) {
    switch (op) {
        case '+':
            return { value: fmt(prev + current) };
        case '-':
            return { value: fmt(prev - current) };
        case '×':
            return { value: fmt(prev * current) };
        case '÷':
            if (current === 0) return { error: 'Não é possível dividir por zero' };
            return { value: fmt(prev / current) };
        default:
            return null;
    }
}

// Corta o ruído binário (0.1 + 0.2 → "0.3", não "0.30000000000000004").
function fmt(n) {
    return parseFloat(n.toPrecision(12)).toString();
}

function clearError() {
    error = '';
}

function clear() {
    currentInput = '';
    previousInput = '';
    operation = null;
    error = '';
    updateDisplay();
}

function inputDigit(digit) {
    clearError();
    if (currentInput.length < 10) { // Limita o número de dígitos
        currentInput += digit;
        updateDisplay();
    }
}

function inputDecimal() {
    clearError();
    if (!currentInput.includes('.')) {
        if (currentInput === '') currentInput = '0';
        currentInput += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperation) {
    clearError();
    if (previousInput !== '' && currentInput !== '' && operation) {
        operate();
    }
    operation = nextOperation;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function operate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    const result = compute(prev, current, operation);
    if (!result) return; // operador desconhecido
    if (result.error) {
        currentInput = '';
        previousInput = '';
        operation = null;
        error = result.error;
        updateDisplay();
        return;
    }
    currentInput = result.value;
    previousInput = '';
    operation = null;
    updateDisplay();
}

function inputPercentage() {
    const value = parseFloat(currentInput);
    if (isNaN(value)) return; // ignora com display vazio
    currentInput = (value / 100).toString();
    updateDisplay();
}

function inputPlusMinus() {
    const value = parseFloat(currentInput);
    if (isNaN(value)) return; // ignora com display vazio
    currentInput = (value * -1).toString();
    updateDisplay();
}

function handleEnterKey() {
    operate();
}

function handleBackspaceKey() {
    if (error) {
        clear();
        return;
    }
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

document.querySelectorAll('.calculator-button').forEach(button => {
    button.addEventListener('click', () => {
        switch (button.textContent) {
            case 'C':
                clear();
                break;
            case '⌫':
                handleBackspaceKey();
                break;
            case '±':
                inputPlusMinus();
                break;
            case '%':
                inputPercentage();
                break;
            case '÷':
            case '×':
            case '+':
            case '-':
                handleOperator(button.textContent);
                break;
            case '.':
                inputDecimal();
                break;
            case '=':
                operate();
                break;
            default:
                inputDigit(button.textContent);
                break;
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        inputDigit(event.key);
    } else if (event.key === '.') {
        inputDecimal();
    } else if (event.key === 'Enter' || event.key === '=') {
        handleEnterKey();
    } else if (event.key === 'Backspace') {
        handleBackspaceKey();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        handleOperator(event.key.replace('*', '×').replace('/', '÷'));
    } else {
        return;
    }
    flashKey(event.key);
});

// Feedback tátil: a tecla física acende o botão correspondente na tela.
function flashKey(key) {
    const label = { '*': '×', '/': '÷', 'Enter': '=', 'Backspace': '⌫' }[key] ?? key;
    const button = [...document.querySelectorAll('.calculator-button')]
        .find(b => b.textContent === label);
    if (!button) return;
    button.classList.add('key-flash');
    setTimeout(() => button.classList.remove('key-flash'), 120);
}

window.onload = clear; // Inicializa a tela com limpeza

// Tema manual: padrão segue o sistema, escolha salva em localStorage.
const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'calculadora-tema';
const THEME_ICONS = {
    light: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    dark: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');

function loadTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

function effectiveTheme() {
    const saved = loadTheme();
    if (saved === 'light' || saved === 'dark') return saved;
    return mediaDark.matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.innerHTML = THEME_ICONS[theme === 'dark' ? 'light' : 'dark'];
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'mudar para tema claro' : 'mudar para tema escuro');
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

function initTheme() {
    applyTheme(effectiveTheme());
    themeToggle.addEventListener('click', () => {
        const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
        saveTheme(next);
        applyTheme(next);
    });
    mediaDark.onchange = () => { if (!loadTheme()) applyTheme(effectiveTheme()); };
}

initTheme();
