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
    history.textContent = operation ? `${previousInput} ${operation}` : '';
    display.textContent = currentInput === '' ? '0' : currentInput;
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
    switch (operation) {
        case '+':
            currentInput = (prev + current).toString();
            break;
        case '-':
            currentInput = (prev - current).toString();
            break;
        case '×':
            currentInput = (prev * current).toString();
            break;
        case '÷':
            if (current === 0) {
                currentInput = '';
                previousInput = '';
                operation = null;
                error = 'Não é possível dividir por zero';
                updateDisplay();
                return;
            }
            currentInput = (prev / current).toString();
            break;
        default:
            return;
    }
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
