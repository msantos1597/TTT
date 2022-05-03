'use strict'
var Board = [-1, -1, -1, -1 -1, -1,-1 -1, -1];
const Human = 'O';
const Ai = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //horizontal
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8], //vertical
    [0, 4, 8],
    [6, 4, 2] //diagonal
]
var gameWon = false;
startGame();

function randomMove(){
  var rand =0
  rand = Math.floor((Math.random() * 9));
  console.log("random -------> " + rand)
  return rand;

}
//function to start game
function startGame() {
    while(!isFull() && !checkWin())
        turn(randomMove(), Human);
        console.log("move 0")
        turn(bestSpot(), Ai);
        console.log("move X")
        if(checkWin())
            console.log("AI WINS")
        
}

function turn(squareId, player) {
    Board[squareId] = player;
}

function checkWin(board, player) {
    if(Board[0] == Board[1] && Board[1] == Board[2] && Board[2] == Board[0])
         return true;
    if(Board[3] == Board[4] && Board[4] == Board[5] && Board[5] == Board[3])
         return true;
    if(Board[6] == Board[7] && Board[7] == Board[8] && Board[8] == Board[6])
         return true;
    if(Board[0] == Board[3] && Board[3] == Board[6] && Board[6] == Board[0])
         return true;
    if(Board[1] == Board[4] && Board[4] == Board[7] && Board[7] == Board[1])
         return true;
    if(Board[6] == Board[4] && Board[4] == Board[2] && Board[6] == Board[2])
         return true;
    if(Board[2] == Board[5] && Board[5] == Board[8] && Board[8] == Board[2])
         return true;
    if(Board[0] == Board[4] && Board[4] == Board[8] && Board[8] == Board[0])
         return true;
    else
        return false;
}

function isFull() {
    for(var i = 0; i < Board.length; i++){
        console.log(i)
        if(Board[i] != -1)
            return false;
    }
    return true;
    
}

function bestSpot() {
    return minimax(Board, Ai).index;
}

function emptySquares() {
    return Board.filter(s => typeof s == 'number');
}

function checkTie() {
    if(emptySquares().length == 0) {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].style.backgroundColor = "grey";
            boxes[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Its A Tie!");
        return true;
    }
    return false;
}

function declareWinner(who) {
    gameWon = true;
    console.log(who);
    document.querySelector(".end").style.display = "block";
    document.querySelector(".end .text").innerText = who;
    document.querySelector("button").style.display = "block";
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);
    
    if(checkWin(newBoard, Human)) {
        return {score: 10};
    } else if(checkWin(newBoard, Ai)) {
        return {score: -20};
    } 
    else if(availSpots.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == Ai) {
            var result = minimax(newBoard, Human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, Ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player == Human) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if(moves[i].score <= bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        
        }
        return moves[bestMove];
    
}