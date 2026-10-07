let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;

const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    display.textContent = currentInput;
    historyDisplay.textContent = previousInput + (operation ? ` ${operation} ` : '');
}

function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal(dot) {
    if (resetScreen) {
        currentInput = '0.';
        resetScreen = false;
        updateDisplay();
        return;
    }
    const parts = currentInput.split(/[\+\−\×\÷]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes('.')) {
        currentInput += dot;
        updateDisplay();
    }
}

function appendOperator(op) {
    if (operation !== null && !resetScreen) {
        calculate(true);
    }
    previousInput = currentInput;
    operation = op;
    resetScreen = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetScreen = false;
    updateDisplay();
}

function backspace() {
    if (resetScreen) return;
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate(chained = false) {
    if (operation === null || resetScreen) return;

    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result = 0;

 
    if (operation === '÷' && current === 0) {
        currentInput = 'Ошибка: деление на 0';
        previousInput = '';
        operation = null;
        resetScreen = true;
        updateDisplay();
        return;
    }

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '−':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default:
            return;
    }

 
    result = Math.round(result * 100000000) / 100000000;

    if (!chained) {
        previousInput = `${previousInput} ${operation} ${currentInput} =`;
        operation = null;
    }

    currentInput = result.toString();
    resetScreen = true;
    updateDisplay();
}

window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9')) {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal('.');
    } else if (e.key === '+') {
        appendOperator('+');
    } else if (e.key === '-') {
        appendOperator('−');
    } else if (e.key === '*') {
        appendOperator('×');
    } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll();
    }
});


updateDisplay();