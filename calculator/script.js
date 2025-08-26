 document.addEventListener('DOMContentLoaded', function() {
            // Create particles
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.width = `${Math.random() * 3 + 1}px`;
                particle.style.height = particle.style.width;
                particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particlesContainer.appendChild(particle);
            }

            // Calculator functionality
            const calculator = {
                currentOperand: '0',
                previousOperand: '',
                operation: undefined,
                history: [],
                
                clear() {
                    this.currentOperand = '0';
                    this.previousOperand = '';
                    this.operation = undefined;
                },
                
                delete() {
                    this.currentOperand = this.currentOperand.toString().slice(0, -1);
                    if (this.currentOperand === '') {
                        this.currentOperand = '0';
                    }
                },
                
                appendNumber(number) {
                    if (number === '.' && this.currentOperand.includes('.')) return;
                    if (this.currentOperand === '0' && number !== '.') {
                        this.currentOperand = number;
                    } else {
                        this.currentOperand = this.currentOperand.toString() + number.toString();
                    }
                },
                
                chooseOperation(operation) {
                    if (this.currentOperand === '') return;
                    if (this.previousOperand !== '') {
                        this.compute();
                    }
                    this.operation = operation;
                    this.previousOperand = this.currentOperand;
                    this.currentOperand = '';
                },
                
                compute() {
                    let computation;
                    const prev = parseFloat(this.previousOperand);
                    const current = parseFloat(this.currentOperand);
                    if (isNaN(prev) || isNaN(current)) return;
                    
                    switch (this.operation) {
                        case '+':
                            computation = prev + current;
                            break;
                        case '-':
                            computation = prev - current;
                            break;
                        case '×':
                            computation = prev * current;
                            break;
                        case '÷':
                            computation = prev / current;
                            break;
                        case '%':
                            computation = prev % current;
                            break;
                        default:
                            return;
                    }
                    
                    // Add to history
                    const historyEntry = {
                        calculation: `${this.previousOperand} ${this.operation} ${this.currentOperand}`,
                        result: computation.toString()
                    };
                    this.history.unshift(historyEntry);
                    this.updateHistoryDisplay();
                    
                    this.currentOperand = computation;
                    this.operation = undefined;
                    this.previousOperand = '';
                },
                
                getDisplayNumber(number) {
                    const stringNumber = number.toString();
                    const integerDigits = parseFloat(stringNumber.split('.')[0]);
                    const decimalDigits = stringNumber.split('.')[1];
                    let integerDisplay;
                    
                    if (isNaN(integerDigits)) {
                        integerDisplay = '';
                    } else {
                        integerDisplay = integerDigits.toLocaleString('en', {
                            maximumFractionDigits: 0
                        });
                    }
                    
                    if (decimalDigits != null) {
                        return `${integerDisplay}.${decimalDigits}`;
                    } else {
                        return integerDisplay;
                    }
                },
                
                updateDisplay() {
                    const currentOperandElement = document.getElementById('currentOperand');
                    const previousOperandElement = document.getElementById('previousOperand');
                    
                    currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
                    
                    if (this.operation != null) {
                        previousOperandElement.innerText = 
                            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                    } else {
                        previousOperandElement.innerText = '';
                    }
                },
                
                updateHistoryDisplay() {
                    const historyList = document.getElementById('historyList');
                    historyList.innerHTML = '';
                    
                    this.history.slice(0, 10).forEach((item, index) => {
                        const li = document.createElement('li');
                        li.classList.add('history-item');
                        li.innerHTML = `
                            <div>${item.calculation} =</div>
                            <div><strong>${this.getDisplayNumber(item.result)}</strong></div>
                        `;
                        li.addEventListener('click', () => {
                            this.currentOperand = item.result;
                            this.updateDisplay();
                        });
                        historyList.appendChild(li);
                    });
                },
                
                clearHistory() {
                    this.history = [];
                    this.updateHistoryDisplay();
                }
            };
            
            // Button event listeners
            const numberButtons = document.querySelectorAll('[id^="one"], [id^="two"], [id^="three"], [id^="four"], [id^="five"], [id^="six"], [id^="seven"], [id^="eight"], [id^="nine"], [id^="zero"], [id^="decimal"]');
            const operationButtons = document.querySelectorAll('[id^="add"], [id^="subtract"], [id^="multiply"], [id^="divide"], [id^="percent"]');
            const equalsButton = document.getElementById('equals');
            const clearButton = document.getElementById('clear');
            const deleteButton = document.getElementById('delete');
            const historyButton = document.getElementById('historyBtn');
            const historyPanel = document.getElementById('historyPanel');
            const clearHistoryButton = document.getElementById('clearHistory');
            
            numberButtons.forEach(button => {
                button.addEventListener('click', () => {
                    createRipple(button);
                    calculator.appendNumber(button.innerText);
                    calculator.updateDisplay();
                });
            });
            
            operationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    createRipple(button);
                    calculator.chooseOperation(button.innerText);
                    calculator.updateDisplay();
                });
            });
            
            equalsButton.addEventListener('click', () => {
                createRipple(equalsButton);
                calculator.compute();
                calculator.updateDisplay();
            });
            
            clearButton.addEventListener('click', () => {
                createRipple(clearButton);
                calculator.clear();
                calculator.updateDisplay();
            });
            
            deleteButton.addEventListener('click', () => {
                createRipple(deleteButton);
                calculator.delete();
                calculator.updateDisplay();
            });
            
            historyButton.addEventListener('click', () => {
                createRipple(historyButton);
                historyPanel.classList.toggle('active');
            });
            
            clearHistoryButton.addEventListener('click', () => {
                createRipple(clearHistoryButton);
                calculator.clearHistory();
            });
            
            // Ripple effect
            function createRipple(button) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            }
            
            // Initialize display
            calculator.updateDisplay();
        });