const result = document.querySelector('.result'); // pega o result
const buttons = document.querySelectorAll('.buttons button'); // pega todos os botões do HTML

let currentNumber = "";    // número atual
let firstOpe = null;       // primeiro número
let operador = null;       // operador
let restart = false;       // reiniciar

// se a origem do update for do clear C, ele vai limpar o resultado para zero, senão pega o número atual
function updateResultado(originClear = false) { 
    result.innerText = originClear ? 0 : currentNumber.replace(".", ",");
}

function addDigit(digit) { // função para adicionar o dígito ao visor
    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) { // verificar se já tem uma vírgula
        return;
    }

    if (restart) { 
        currentNumber = digit;
        restart = false;  // marca que o próximo dígito não é um reinício
    } else {
        currentNumber += digit; // se não, ele apenas segue concatenando um número no outro (ex: 123...)
    }

    updateResultado(); // atualiza na tela
}

function setOperador(newOpe) { // recebe o operador por parâmetro
    if(currentNumber) {        // verifica se tem algum número atual
        calculate();

        firstOpe = parseFloat(currentNumber.replace(",", ".")); // o que tiver vira o primeiro operador e o número atual fica vazio
        currentNumber = "";
    }

    operador = newOpe;
}

function calculate() { // aqui faz o cálculo
    if (operador === null || firstOpe === null) return; // verifica se tem o primeiro número e o operador para poder calcular
    let secondOpe = parseFloat(currentNumber.replace(",", ".")); // pega o segundo operador (número atual) e troca a vírgula para ponto
    let ValorFinal;  // onde vou guardar o resultado da operação

    // faço um switch para verificar os operadores e escolher o cálculo
    switch(operador) {
        case "+":
            ValorFinal = firstOpe + secondOpe;
            break;
        case "-":
            ValorFinal = firstOpe - secondOpe;
            break;
        case "x":
            ValorFinal = firstOpe * secondOpe;
            break;
        case "÷":
            ValorFinal = firstOpe / secondOpe;
            break;
        default:
            return;
    }

    // verificação se o resultado tiver mais de 5 casas decimais, uso toFixed para carregar até 5
    if(ValorFinal.toString().split(".")[1]?.length > 5) {
        currentNumber = parseFloat(ValorFinal.toFixed(5)).toString();
    } else {
        currentNumber = ValorFinal.toString(); // se não, ele só pega o resultado normal
    }

    // feito o cálculo, isso acontece: isso significa que após clicar em = o próximo número que clicar o visor já reinicia
    operador = null;
    firstOpe = null;
    restart = true; // isso permite que o próximo número seja iniciado após o cálculo
    updateResultado();  // atualiza no visor o resultado da operação
}

function clearCalculator() {
    currentNumber = "";   // número atual fica vazio
    firstOpe = null;      // tudo vazio
    operador = null;
    updateResultado(true);  // atualiza para zero
}

function setPercentage() {
    let result = parseFloat(currentNumber) / 100;
  
    if (["+", "-"].includes(operador)) {
      result = result * (firstOpe || 1);
    }
  
    if (result.toString().split(".")[1]?.length > 5) {
      result = result.toFixed(5).toString();
    }
  
    currentNumber = result.toString();
    updateResultado();
}

// Adiciona eventos para os botões
buttons.forEach((button) => { 
    button.addEventListener("click", () => {   // para cada botão, adiciono um evento de click
        const TextoBotao = button.innerText;    // var para pegar o texto do botão que estou clicando 
        if (/^[0-9]+$/.test(TextoBotao)) {         // verificação com regex, se o texto que estou clicando for de 0 a 9, ou for vírgula ele passa no test, e chama a função addDigit passando como parâmetro esse texto do botão 
            addDigit(TextoBotao);
        } else if (["+", "-", "x", "÷"].includes(TextoBotao)) {    // 1) coloca os operadores em um array  2) verificar se o botão clicado é um operador através do includes(), se sim, chama o setOperador()
            setOperador(TextoBotao);  // função que verifica se o botão que cliquei é um operador
        } else if (TextoBotao === "=") {   // clico no "=" e chama o calcular
            calculate();                // CÁLCULO REAL - alma da calculadora está aqui
        } else if (TextoBotao === "C") {
            clearCalculator();    // função para limpar o visor
        } else if (TextoBotao === "±") {
            currentNumber = (                // parte do código que muda o tipo do número (positivo ou negativo)
                parseFloat(currentNumber || firstOpe) * -1
            ).toString();
            updateResultado();
        } else if (TextoBotao === "%") {
            setPercentage();                // calcula a porcentagem
        }
    });
});

// Adiciona o evento de teclado
document.addEventListener("keydown", (event) => {
    event.preventDefault();
    const key = event.key;

    if (/[0-9]/.test(key)) { // se a tecla for um número (0-9)
        addDigit(key);
    } else if (key === "," || key === ".") { // se for vírgula ou ponto
        addDigit(",");
    } else if (key === "+" || key === "-" || key === "*" || key === "/") { // se for um operador
        setOperador(key === "*" ? "x" : key === "/" ? "÷" : key); // mapeando os operadores
    } else if (key === "=" || key === "Enter") { // se for igual ou enter
        calculate();
    } else if (key === "c" || key === "C") { // se for "C" ou "c" para limpar
        clearCalculator();
    } else if (key === "%") { // se for "%" para porcentagem
        setPercentage();
    } else if (key === "Escape") { // tecla Escape para limpar a calculadora
        clearCalculator();
    }
});
