'use strict'

var Board;
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

const boxes = document.querySelectorAll('.box');
startGame();

//function to start game
function startGame() {
    document.querySelector('.end').style.display = "None";
    document.querySelector('button').style.display = "None";
    Board = Array.from(Array(9).keys());
    gameWon = false;
    for(var i = 0; i < boxes.length; i++) {
        boxes[i].innerText = '';
        boxes[i].style.removeProperty('background-color');
        boxes[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if(typeof Board[square.target.id] == 'number') {
        console.log(square.target.id);
        turn(square.target.id, Human);

        if(!gameWon) { setTimeout(() => {
            if(!checkTie()) turn(bestSpot(), Ai); }, 200);
        }
    }
}

function turn(squareId, player) {
    Board[squareId] = player;
    document.getElementById(squareId).innerText = player;;
    let gameWon = checkWin(Board, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
      (e === player) ? a.concat(i) : a, []);

    let gameWon = null;

    for (let [index, win] of winCombos.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            // player has won
            gameWon = {index, player, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == Human ? "lightskyblue" : "pink";
    }

    for(var i = 0; i < boxes.length; i++) {
        boxes[i].removeEventListener('click', turnClick, false);
    }

    declareWinner(gameWon.player == Human ? "You win!" : "You lose!");
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