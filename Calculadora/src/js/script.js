// JavaScript para a funcionalidade da calculadora
const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operation = null;

function updateDisplay() {
    display.textContent = currentInput;
}

function clear() {
    currentInput = '';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function inputDigit(digit) {
    if (currentInput.length < 10) { // Limita o número de dígitos
        currentInput += digit;
        updateDisplay();
    }
}

function inputDecimal() {
    if (!currentInput.includes('.')) {
        if (currentInput === '') currentInput = '0';
        currentInput += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperation) {
    if (previousInput !== '' && currentInput !== '' && operation) {
        operate();
    }
    operation = nextOperation;
    previousInput = currentInput;
    currentInput = '';
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
                alert("Não é possível dividir por zero");
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
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

function inputPlusMinus() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

document.querySelectorAll('.calculator-button').forEach(button => {
    button.addEventListener('click', () => {
        switch (button.textContent) {
            case 'C':
                clear();
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
    if ((event.key >= '0' && event.key <= '9') || event.key === '.') {
        inputDigit(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        operate();
    } else if (event.key === 'Backspace') {
        clear();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        handleOperator(event.key.replace('*', '×').replace('/', '÷'));
    }
});

window.onload = clear; // Inicializa a tela com limpeza
