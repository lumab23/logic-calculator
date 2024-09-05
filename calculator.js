// pega o elemento do display pelo ID 
const display = document.getElementById("display");

// função para limpar o display
function clearDisplay() {
    display.value = ""; // define o valor do display
    const tabela = document.getElementById("tabela-verdade");
    const checarTautologia = document.getElementById("provar-tautologia");

    // limpa e oculta a tabela, assim como a verificação da tautologia
    tabela.innerHTML = "";
    checarTautologia.innerText = "";
}

// função para deletar o último caractere do display
function deleteChar() {
    display.value = display.value.slice(0, -1); // remove o último caractere
}

// função para adicionar um caractere ao display
// sem que viole as regras de entrada
function appendToDisplay(char) {
    // obtém o valor atual do display
    const displayValue = display.value;
    // captura o último caractere do valor do display para verificar o que está no final
    const lastChar = displayValue.slice(-1);
    // conta quantos parênteses abertos existem no display. se não, retorna 0
    const openParentheses = (displayValue.match(/\(/g) || []).length;
    // conta quantos parênteses fechados existem no display. se não, retorna 0
    const closeParentheses = (displayValue.match(/\)/g) || []).length;

    // define pares de operadores inválidos que podem aparecer um após o outro
    const invalidPairs = [
        ["^", "v"], // conjunção seguida de disjunção
        ["v", "^"], // disjunção seguida de conjunção
        ["^", "→"], // conjunção seguida de implicação
        ["v", "→"], // disjunção seguida de implicação
        ["→", "^"], // implicação seguidade de conjunção
        ["→", "v"], // implicação seguida de disjunção
        ["→", "↔"], // implicação seguida de bicondicional
        ["↔", "→"], // bicondicional seguida de implicação
        ["↔", "^"], // bicondicional seguida de conjunção
        ["↔", "v"], // bicondicional seguida de disjunção
        ["^", "↔"], // conjunção seguida de bicondicional
        ["v", "↔"] // disjunção seguidad de bicondicional
    ];

    // define caracteres inválidos que não podem aparecer após variáveis
    const invalidAfterVars = ["P", "Q", "R"];
    // define caracteres inválidos que não podem ser o primeiro na fórmula
    const invalidStartChars = [")", "↔", "→", "v", "^"];
    // define caracteres inválidos que não podem aparecer após um parêntese aberto
    const invalidAfterOpenParen = [")", "v", "^", "→", "↔"];
    // define caracteres inválidos que não podem aparecer após um parêntese fechado
    const invalidAfterCloseParen = ["P", "Q", "R", "~", "("];

    // vai checar operadores duplicados consecutivos
    if (lastChar === char && /[↔→^v~]/.test(char)) {
        return;
    }

    // verifica se o par de caracteres (último caractere e caractere atual) está na lista de pares inválidos
    // se estiver, retorna sem adicionar o caractere ao display
    if (invalidPairs.some(pair => pair[0] === lastChar && pair[1] == char)) {
        return;
    }

    // se o display está vazio e o caractere atual é um caractere inválido para o início,
    // retorna sem adicionar o caractere ao display
    if (displayValue == "" && invalidStartChars.includes(char)) {
        return;
    }

    // se o último caractere é um parêntese aberto e o caractere atual é inválido após um parêntese,
    // retorna sem adicionar o caractere ao display
    if (lastChar == "(" && invalidAfterOpenParen.includes(char)) {
        return;
    }

    // se o último caractere é um parêntese fechado e o caractere atual é inválido após um parêntese fechado,
    // retorna sem adicionar o caractere ao display
    if (lastChar === ")" && invalidAfterCloseParen.includes(char)) {
        return;
    }

    // se o último caractere é um parêntese fechado e o caractere atual é inválido após um parêntese fechado,
    // retorna sem adicionar o caractere ao display
    if (closeParentheses >= openParentheses && char === ")") {
        return;
    }

    // se o último caractere é uma variável inválida e o caractere atual é inválido após variáveis 
    // ou um parêntese aberto, retorna sem adicionar o caractere ao display.
    if (invalidAfterVars.includes(lastChar) && (invalidAfterVars.includes(char) || char === "(")) {
        return;
    }

    // se nenhuma regra for violada, adiciona o caractere ao display
    display.value += char;   

}

function evaluateProposition() {
    const proposition = display.value; 

    const tabela = document.getElementById("tabela-verdade");
    const checarTautologia = document.getElementById("provar-tautologia");

    if (proposition === "") {
        display.value = "Error: No proposition entered"; // exibe um erro se o display estiver vazio
        // oculata a tabela e a prova de tautologia quando tem um erro
        tabela.innerHTML = "";
        checarTautologia.innerText = "";
    } else {
        createTruthTable(proposition);
    }
}

function createTruthTable(proposition) {
    // divide a proposição em caracteres individuais e usa reduce para acumular letras maiúsculas únicas
    const chars = proposition.split('').reduce((acc, char) => {
        // verifica se o caractere atual é uma letra maiúscula (A-Z)
        if (/[A-Z]/.test(char) && !acc.includes(char)) {
            // se for uma letra maiúscula e não estiver no acumulador,
            // adiciona o caractere ao array do acumulador
            acc.push(char);
        }
        // retorna o acumulador para a próxima iteração
        return acc;
    }, []); // inicializa o acumulador como um array vazio

    // arrays para armazenar os resultados finais 
    // e a combinação de valores verdadeiros/falso
    const resultadosFinais = [];
    const combinacoes = [];
    // calcula a quantidade de linhas da tabela
    const rows = Math.pow(2, chars.length); 

    // itera sobre o num de linhas da tabela verdade 
    // representa todas as combinações possíveis de valores
    for (let i = 0; i < rows; i++) {
        // cria um objeto para armazenar a combinação atual de valores verdadeiros/falsos
        const combinacaoAtual = {}; 

        // gera todas as combinações de valores verdadeiros/falsos para as variáveis
        for (let j = 0; j < chars.length; j++) {
            // obtem o char atual da lista de varáveis
            const c = chars[j];

            // usa o operador de deslocamento de bits para determinar o valor da variável
            // verifica se o bit correspondente está definido como 1 ou 0
            if ((i >> (chars.length - j - 1)) & 1) {
                // se o bit é 1, atribui 'F' à variável
                combinacaoAtual[c] = 'F';
            } else {
                // se o bit é 0, atribui 'V' à variável
                combinacaoAtual[c] = 'V';
            }
        }

        // adiciona a combinação atual ao array de combinações
        combinacoes.push(combinacaoAtual);

        // inicia uma string vazia para armazenar os resultados da avaliação da proposição
        let resultados = "";

        // itera sobre cada caractere da proposição
        for (let k = 0; k < proposition.length; k++) {
            // obtém o caractere atual da proposição
            let char = proposition[k];
            // verifica se o char é uma letra maiúscula
            if (/[A-Z]/.test(char)) {  
                // se for uma letra, adiciona o valor correspondente da combinação atual
                // ao resultado (V ou F)
                resultados += combinacaoAtual[char];  
            } else {
                // se não for uma letra
                // adiciona o operador ou outro caractere ao resultado
                resultados += char;  
            }
        }

        // avalia a fórmula, resolvendo parênteses e calculando o resultado final
        const resultado = resolverParenteses(resultados);

        // adiciona o resultado final da avaliação ao array
        resultadosFinais.push(resultado);
    }

    // exibe a tabela verdade
    exibirTabela(chars, combinacoes, resultadosFinais)
}

function resolverParenteses(proposition) {
    // define uma expressão regular para encontrar a subexpressão mais interna entre parênteses
    const regexParenteses = /\(([^()]+)\)/; 

    // enquanto existirem parenteses na expressão, ele subistitui a subexpressão mais interna pelo seu resultado avaliados
    while(regexParenteses.test(proposition)){
        proposition = proposition.replace(regexParenteses, (match, subExpressao) => {
            let resultadoSubExpressao = evaluateExpression(subExpressao); // Chama o método para calcular o resultado da subexpressão
            return resultadoSubExpressao ? 'V' : 'F'; // Substitui por 'V' ou 'F' baseado no resultado
        });
    }

    return evaluateExpression(proposition);
}

// Cálculo da tabela-verdade
function evaluateExpression(proposition) {
    // Substituição da negação (~V ou ~F)
    let resultadoNegacao = proposition.replace(/~(V|F)/g, function(_, p1) {
        if (p1 === 'V') {
            return 'F'; // se for 'v', a negação se torna 'f'
        } else {
            return 'V'; // se for 'f', a negação se torna 'v'
        }
    });

    // Substituição de 'V' por '1' e 'F' por '0' para fazer uso das funções do JavaScript
    let resultadoValores = resultadoNegacao.replace(/V/g, '1').replace(/F/g, '0');

    // Substituição de operadores lógicos
    let resultadoOperadores = resultadoValores
        .replace(/\^/g, '&&')  // Conjunção (∧)
        .replace(/v/g, '||')   // Disjunção (∨)
        .replace(/↔/g, '==='); // Bicondicional (↔)

    // Adaptação da operação para a condicional
    if (resultadoOperadores.includes("→")) {
        // divide a proposição na condicional
        let componentes = resultadoOperadores.split("→");

        for (let i = 0; i < componentes.length; i++) {
            if (i == 0) {
                aux = componentes[i].trim(); // armazena o antecedente
            } else {
                antecedente = aux; // anterior armazenado
                consequente = componentes[i].trim(); // armazena o consequente
                 // Adapta a expressão condicional para JavaScrip
                aux = `!(${antecedente}) || (${consequente})` // forma padrão da implicação
            }
        }
        resultadoOperadores = aux; // atualiza com a nova expressão condicional
        
    }

    // avalia a expressão final utilizando eval
    return eval(resultadoOperadores);
}

// Função para exibir a tabela verdade em formato de tabela HTML
function exibirTabela(chars, combinacoes, resultados) {
    const tabelaDiv = document.getElementById("tabela-verdade"); // Obtém o elemento da tabela verdade
    let tabelaHTML = "<table border='1'><thead><tr>";

    // Adiciona o cabeçalho da tabela com as variáveis e a fórmula completa
    tabelaHTML += chars.map(v => `<th>${v}</th>`).join("") + `<th>${display.value}</th></tr></thead><tbody>`;

    // Adiciona cada linha com os valores das combinações e o resultado
    combinacoes.forEach((valores, index) => {
        const linha = chars.map(v => `<td>${valores[v]}</td>`).join("") + `<td>${resultados[index] ? 'V' : 'F'}</td>`;
        tabelaHTML += `<tr>${linha}</tr>`; // Adiciona a linha à tabela HTML
    });

    tabelaHTML += "</tbody></table>"; // Fecha a tabela HTML

    // Exibe a tabela no elemento HTML
    tabelaDiv.innerHTML = tabelaHTML;
    verificarTipoFormula(resultados);
}


function verificarTipoFormula(resultados) {
    // Obtém o elemento HTML onde será exibido o tipo da fórmula (tautologia, contradição ou contingência)
    const tautologyCheck = document.getElementById("provar-tautologia");

    // Verifica se todos os resultados na lista são Verdadeiros (V)
    const allTrue = resultados.every(result => result); // Retorna true se todos os elementos de resultados forem verdadeiros

    // Verifica se todos os resultados na lista são Falsos (F)
    const allFalse = resultados.every(result => !result); // Retorna true se todos os elementos de resultados forem falsos

    // Condição para verificar o tipo da fórmula
    if (allTrue) {
        // Se todos os resultados são verdadeiros, a fórmula é uma tautologia
        tautologyCheck.innerText = "Esta fórmula é uma Tautologia."; // Exibe a mensagem correspondente
        tautologyCheck.style.color = "green"; // Define a cor do texto como verde
    } else if (allFalse) {
        // Se todos os resultados são falsos, a fórmula é uma contradição
        tautologyCheck.innerText = "Esta fórmula é uma Contradição."; // Exibe a mensagem correspondente
        tautologyCheck.style.color = "red"; // Define a cor do texto como vermelho
    } else {
        // Se houver uma combinação de resultados verdadeiros e falsos, a fórmula é uma contingência
        tautologyCheck.innerText = "Esta fórmula é uma Contingência."; // Exibe a mensagem correspondente
        tautologyCheck.style.color = "orange"; // Define a cor do texto como laranja
    }
}
