// Tentei explicar cada linha do JavaScript com comentários ... Espero que você entenda

// selecionando todos os elementos necessários
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ // uma vez que a janela é carregada
    for (let i = 0; i < allBox.length; i++) { // adiciona o atributo onclick em todo o intervalo disponível
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); // ocultar a caixa de seleção
    playBoard.classList.add("show"); // mostra a seção do playboard
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); // ocultar a caixa de seleção
    playBoard.classList.add("show"); // mostra a seção do playboard
    players.setAttribute("class", "players active player");// definir o atributo de classe em jogadores com valores de jogadores ativos
}

let playerXIcon = "fas fa-times"; // nome da classe do ícone de cruz incrível
let playerOIcon = "far fa-circle"; // nome da classe do ícone do círculo incrível
let playerSign = "X"; // esta é uma variável global porque usamos esta variável dentro de várias funções
let runBot = true; // esta também é uma variável global com valor boolen .. usamos esta variável para parar o bot uma vez que a partida foi vencida por alguém ou empatada

// função de clique do usuário
function clickedBox(element){
    if(players.classList.contains("player")){
        playerSign = "O"; // se o jogador escolher (O), altere playerSign para O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; // adicionando etiqueta de ícone de círculo dentro do elemento / caixa clicado pelo usuário
        players.classList.remove("active"); /// adicionar classe ativa nos jogadores
        element.setAttribute("id", playerSign);// define o atributo id em span / box com o sinal escolhido pelo jogador
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside user clicked element/box
        element.setAttribute("id", playerSign);// define o atributo id em span / box com o sinal escolhido pelo jogador
        players.classList.add("active"); /// adicionar classe ativa nos jogadores
    }
    selectWinner(); // chamando a função selectWinner
    element.style.pointerEvents = "none"; // assim que o usuário selecionar qualquer caixa, essa caixa poderá ser clicada novamente
    playBoard.style.pointerEvents = "none";// adiciona pointerEvents none ao playboard para que o usuário não possa clicar imediatamente em qualquer outra caixa até que o bot selecione
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); // gerando um número aleatório para que o bot atrase aleatoriamente para selecionar a caixa não selecionada
    setTimeout(()=>{
        bot(runBot); // chamando a função bot
    }, randomTimeDelay); // passando o valor de atraso aleatório
}

// bot auto select function
function bot(){
    let array = []; // função de seleção automática de bot
    if(runBot){ //if runBot is true
        playerSign = "O"; // mude o playerSign para O, então se o jogador tiver escolhido X, o bot irá O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ // se a caixa / extensão não tem filhos significa tag <i>
                array.push(i); // inserindo caixas não clicadas número / índice dentro da matriz
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; // obtendo índice aleatório do array para que o bot selecione a caixa não selecionada aleatória
        if(array.length > 0){ // se o comprimento da matriz for maior que 0
            if(players.classList.contains("player")){ 
                playerSign = "X"; // se o jogador escolheu O, então o bot irá X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;// adicionando a marca do ícone de cruz dentro do elemento selecionado do bot
                allBox[randomBox].setAttribute("id", playerSign);// define o atributo id em span / box com o sinal escolhido pelo jogador
                players.classList.add("active"); /// adicionar classe ativa nos jogadores
            }else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;// adicionando etiqueta de ícone de círculo dentro do elemento selecionado do bot
                players.classList.remove("active"); // remove classe ativa em jogadores
                allBox[randomBox].setAttribute("id", playerSign);// define o atributo id em span / box com o sinal escolhido pelo jogador
            }
            selectWinner(); // chamando a função selectWinner
        }
        allBox[randomBox].style.pointerEvents = "none";// uma vez que o bot selecione qualquer caixa, o usuário não poderá clicar nessa caixa
        playBoard.style.pointerEvents = "auto"; // adiciona pointerEvents auto no playboard para que o usuário possa clicar novamente na caixa
        playerSign = "X"; // se o jogador escolheu X então o bot será O certo, então mudamos o playerSign novamente para X, então o usuário irá X porque acima nós mudamos o playerSign para O para bot
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id;// retorna o valor do id
}
function checkIdSign(val1, val2, val3, sign){ //checking all id value is equal to sign (X or O) or not if yes then return true
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ // verificar se todos os valores de id são iguais ao sinal (X ou O) ou não, se sim, retorne verdadeiro
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        runBot = false; // passando o valor boolen falso para runBot para que o bot não execute novamente
        bot(runBot);// chamando a função bot
        setTimeout(()=>{ // após a partida vencida por alguém, oculte o playboard e mostre a caixa de resultado após 700 ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); // 1s = 1000ms
        wonText.innerHTML = `Player <p>${playerSign}</p> Ganhou o Game!`; // exibindo o texto vencedor com a passagem de playerSign (X ou O)
    }else{ // se todas as caixas / elemento tiverem valor de id e ainda assim ninguém ganhar, empate a partida
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; // passando o valor boolen falso para runBot para que o bot não execute novamente
            bot(runBot); // chamando a função bot
            setTimeout(()=>{ // após o sorteio da partida, oculte o playboard e mostre a caixa de resultado após 700 ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);// 1s = 1000ms
            wonText.textContent = "Match has been drawn!";// exibindo texto de correspondência de desenho
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload();// recarregar a página atual ao clicar no botão de repetição
}