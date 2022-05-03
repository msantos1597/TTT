'use strict'

var Board;
const Human1 = 'O';
const Human2 = 'X';
var player = Human2;
var count = 0;
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

function playerRand() {
  if(count%2 == 0){
    player = Human1;
    
    return Human1;
  }
  else{
    player = Human2;
    
    return Human2;
  }
}
const boxes = document.querySelectorAll('.box');
startGame();
//function to start game
function startGame() {
    document.querySelector('.end').style.display = "None";
    document.querySelector('button').style.display = "None";
    Board = Array.from(Array(9).keys());
    gameWon = false;
    for(var i = 0; i < boxes.length; i++) {
        document.querySelector(".pturn").innerText = playerRand() + "'s turn'";
        boxes[i].innerText = '';
        boxes[i].style.removeProperty('background-color');
        console.log(player);
        document.querySelector(".pturn").style.display = "block";
        boxes[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {

    count++;
    if(typeof Board[square.target.id] == 'number') {
        console.log(square.target.id);
        turn(square.target.id, player);
    }
}
    
function turn(squareId, player) {
    document.getElementById(squareId).innerText = player;
    Board[squareId] = player;
    let gameWon = checkWin(Board, player);
    checkTie();
    document.querySelector(".pturn").innerText = playerRand() + "'s turn'";
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
            gameWon.player == Human1 ? "lightskyblue" : "pink";
    }

    for(var i = 0; i < boxes.length; i++) {
        boxes[i].removeEventListener('click', turnClick, false);
    }

    declareWinner(gameWon.player == "O" ? "Player O wins!" : "Player X wins!");
}

function bestSpot() {
    return minimax(Board, Human2
               ).index;
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
    
    if(checkWin(newBoard, Human1)) {
        return {score: 10};
    } else if(checkWin(newBoard, Human2
                   )) {
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

        if(player == Human2
       ) {
            var result = minimax(newBoard, Human1);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, Human2
                             );
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player == Human1) {
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