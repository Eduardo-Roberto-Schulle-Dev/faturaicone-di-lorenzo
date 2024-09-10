var isDarkModeActive = false;
var lastCalculation = null;
let currentInput = '';
let operator = null;
let firstOperand = null;

function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateScreen();
}

function setOperator(op) {
    if (operator !== null) {
        calculateResult();
    }
    firstOperand = parseFloat(currentInput);
    operator = op;
    currentInput = '';
}

function calculateResult() {
    if (operator === null || currentInput === '') return;
    const secondOperand = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operator = null;
    firstOperand = null;
    updateScreen();
}

function clearScreen() {
    currentInput = '';
    operator = null;
    firstOperand = null;
    updateScreen();
}

function updateScreen() {
    document.getElementById('calculator-screen').innerText = currentInput || '0';
}

function toggleCalculator() {
    const calculator = document.getElementById('calculator');
    const isVisible = calculator.style.display === 'block';
    calculator.style.display = isVisible ? 'none' : 'block';
}

function showAboutModal() {
    var aboutModal = document.getElementById('modalSobre');
    aboutModal.style.display = 'block';
}

function closeAboutModal() {
    var aboutModal = document.getElementById('modalSobre');
    aboutModal.style.display = 'none';
}

function loadLastCalculation() {
    var storedLastCalculation = localStorage.getItem('lastCalculation');
    if (storedLastCalculation !== null) {
        lastCalculation = storedLastCalculation;
        displayPreviousResult();
    }
}

function saveLastCalculation(resultHTML) {
    lastCalculation = resultHTML;
    localStorage.setItem('lastCalculation', resultHTML);
}

function showModal() {
    var modal = document.getElementById('modal');
    var previousResult = document.getElementById('previousResult');

    if (lastCalculation) {
        previousResult.innerHTML = lastCalculation;
    } else {
        previousResult.innerHTML = 'You have not made any calculations yet.';
    }

    modal.style.display = 'block';
}

function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function displayPreviousResult() {
    if (lastCalculation) {
        document.getElementById('previousResult').innerHTML = lastCalculation;
    }
}

function exportToExcel() {
    var pisValue = parseFloat(document.getElementById('pisValue').value.replace('.', '').replace(',', '.'));
    var cofinsValue = parseFloat(document.getElementById('cofinsValue').value.replace('.', '').replace(',', '.'));
    var siscomexValue = parseFloat(document.getElementById('siscomexValue').value.replace('.', '').replace(',', '.'));
    var cashValue = parseFloat(document.getElementById('cashValue').value.replace('.', '').replace(',', '.'));
    var variationValue = parseFloat(document.getElementById('variationValue').value.replace('.', '').replace(',', '.'));
    var supplierCount = parseInt(document.getElementById('supplierCount').value);

    if (isNaN(pisValue) || isNaN(cofinsValue) || isNaN(siscomexValue) || isNaN(cashValue) || isNaN(variationValue) || supplierCount === 0) {
        alert('Please fill in all fields correctly.');
        return;
    }

    var data = [];
    for (var i = 1; i <= supplierCount; i++) {
        var supplierName = document.getElementById('supplierName' + i).value;
        var supplierPercentage = parseFloat(document.getElementById('supplierPercentage' + i).value.replace(',', '.'));

        if (supplierName.trim() === '' || isNaN(supplierPercentage)) {
            alert('Please fill in the information for supplier ' + i + ' correctly.');
            return;
        }

        var pisSupplier = (supplierPercentage / 100) * pisValue;
        var cofinsSupplier = (supplierPercentage / 100) * cofinsValue;
        var siscomexSupplier = (supplierPercentage / 100) * siscomexValue;
        var cashSupplier = (supplierPercentage / 100) * cashValue;
        var variationSupplier = (supplierPercentage / 100) * variationValue;

        data.push({
            'Supplier Name': supplierName,
            'Percentage (%)': supplierPercentage + '%',
            'PIS': pisSupplier.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'COFINS': cofinsSupplier.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'SISCOMEX': siscomexSupplier.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'CASH': cashSupplier.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'VARIATION': variationSupplier.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        });
    }

    var wb = XLSX.utils.book_new();
    var wsData = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, wsData, 'Calculation Results');

    wsData['!cols'] = [{ wpx: 200 }, { wpx: 120 }, { wpx: 110 }, { wpx: 110 }, { wpx: 110 }, { wpx: 110 }, { wpx: 110 }];

    var wsSummary = XLSX.utils.json_to_sheet([{
        'Total PIS': pisValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total COFINS': cofinsValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total SISCOMEX': siscomexValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total CASH': cashValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Total VARIATION': variationValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Supplier Count': supplierCount
    }]);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Input Information');

    wsSummary['!cols'] = [{ wpx: 110 }, { wpx: 110 }, { wpx: 110 }, { wpx: 110 }, { wpx: 110 }, { wpx: 160 }];

    var fileName = 'Calculation_Input_Results.xlsx';
    XLSX.writeFile(wb, fileName);
}

function calculateValues() {
    var pisValue = parseFloat(document.getElementById('pisValue').value.replace(',', '.'));
    var cofinsValue = parseFloat(document.getElementById('cofinsValue').value.replace(',', '.'));
    var siscomexValue = parseFloat(document.getElementById('siscomexValue').value.replace(',', '.'));
    var cashValue = parseFloat(document.getElementById('cashValue').value.replace(',', '.'));
    var variationValue = parseFloat(document.getElementById('variationValue').value.replace(',', '.'));

    var distributions = [];
    var supplierCount = parseInt(document.getElementById('supplierCount').value);
    for (var i = 1; i <= supplierCount; i++) {
        var name = document.getElementById('supplierName' + i).value;
        var percentage = parseFloat(document.getElementById('supplierPercentage' + i).value.replace(',', '.'));
        if (name.trim() === '' || isNaN(percentage)) {
            alert('Please fill in the supplier information ' + i + ' correctly.');
            return;
        }
        distributions.push({ name: name, percentage: percentage });
    }

    var resultHTML = '';
    for (var j = 0; j < distributions.length; j++) {
        var distribution = distributions[j];
        var pisSupplier = (distribution.percentage / 100) * pisValue;
        var cofinsSupplier = (distribution.percentage / 100) * cofinsValue;
        var siscomexSupplier = (distribution.percentage / 100) * siscomexValue;
        var cashSupplier = (distribution.percentage / 100) * cashValue;
        var variationSupplier = (distribution.percentage / 100) * variationValue;

        pisSupplier = pisSupplier.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        cofinsSupplier = cofinsSupplier.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        siscomexSupplier = siscomexSupplier.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        cashSupplier = cashSupplier.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        variationSupplier = variationSupplier.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        resultHTML += '<p><strong>' + distribution.name + ' (' + distribution.percentage.toFixed(2) + '%)</strong><br>';
        resultHTML += 'PIS: ' + pisSupplier + '<br>';
        resultHTML += 'COFINS: ' + cofinsSupplier + '<br>';
        resultHTML += 'SISCOMEX: ' + siscomexSupplier + '<br>';
        resultHTML += 'CASH: ' + cashSupplier + '<br>';
        resultHTML += 'VARIATION: ' + variationSupplier + '</p>';
    }

    document.getElementById('result').innerHTML = resultHTML;
    saveLastCalculation(resultHTML);
}


document.getElementById('quantidadeFornecedores').addEventListener('change', function() {
    var fornecedoresFields = document.getElementById('fornecedoresFields');
    fornecedoresFields.innerHTML = '';
    var quantidadeFornecedores = parseInt(this.value);
    for (var i = 1; i <= quantidadeFornecedores; i++) {
        var nomeInput = document.createElement('input');
        nomeInput.type = 'text';
        nomeInput.id = 'fornecedorNome' + i;
        nomeInput.placeholder = 'Nome do fornecedor ' + i;
        fornecedoresFields.appendChild(nomeInput);
        
        var percentualInput = document.createElement('input');
        percentualInput.type = 'text';
        percentualInput.id = 'fornecedorPercentual' + i;
        percentualInput.placeholder = 'Porcentagem do fornecedor ' + i + ' (em %)';
        fornecedoresFields.appendChild(percentualInput);
    }
    fornecedoresFields.style.display = quantidadeFornecedores > 0 ? 'block' : 'none';
});

function carregarModoEscuro() {
  var modoEscuroSalvo = localStorage.getItem('modoEscuro');
  if (modoEscuroSalvo !== null) {
    modoEscuroAtivado = JSON.parse(modoEscuroSalvo);
    aplicarModoEscuro();
  }
}

function salvarModoEscuro() {
  localStorage.setItem('modoEscuro', modoEscuroAtivado);
}

function aplicarModoEscuro() {
  var body = document.body;
  body.classList.toggle('dark-mode', modoEscuroAtivado);

  var modoEscuroBtn = document.querySelector('.modo-escuro-btn');
  modoEscuroBtn.textContent = modoEscuroAtivado ? 'Modo Claro' : 'Modo Escuro';
}

function alternarModo() {
  modoEscuroAtivado = !modoEscuroAtivado;
  salvarModoEscuro();
  aplicarModoEscuro();
}

document.addEventListener('DOMContentLoaded', (event) => {
  carregarModoEscuro();
    carregarUltimoCalculo(); 
});
