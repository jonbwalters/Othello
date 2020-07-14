/*----------- Game State Data ----------*/

const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 4, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
]
    


// odds in the board will be black
// evens in the board will be white

/*---------- Variables ----------*/
let findPiece = function (pieceId) {
   for(m=0; m<8; m++)
    {
        for(j=0; j<8; j++)
        {
            if (board[m][j] == pieceId)
            return [m,j];
        }
    }
};

// DOM referenes
const cells = document.querySelectorAll("td");
let whitesPieces = document.querySelectorAll("w");
let blacksPieces = document.querySelectorAll("b")
let possiblePlaces = document.querySelectorAll("p")
const whiteTurnText = document.querySelectorAll(".white-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider")
let nextblackPieceId = 5;
let nextwhitePieceId = 6;


// player properties
let turn = true;
let whiteScore = 2;
let blackScore = 2;
let playerPieces;

// players whose turn it is properties
let player = {
    colorId: null,
    pieces:  null,
    //0 for false and 1 for true is space is a possible move for the current color
    possiblemoves: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
}


/*---------- Gameplay Logic ----------*/
// holds the length of the players piece count
function getPlayerPieces() {
    if (turn) {
        playerPieces = whitesPieces;
    } else {
        playerPieces = blacksPieces;
    }
    resetPlayerPossibleMoves()
    giveCellsClick()
}

// initialize event listeners on cells
function giveCellsClick() {
    cells.forEach(cell => {
        cell.addEventListener('click', () =>
        {    
            i = cell.closest('tr').rowIndex;
            j = cell.cellIndex;
            if(board[i][j] == 0 && player.possiblemoves[i][j] == 1)
            { 
                placePiece(i, j);
            }
        }); 
      });
}

// resets color turn properties
function resetPlayerPossibleMoves() 
{
    if(turn)
    {
        player.colorId = 0;
    }
    else{
        player.colorId = 1;
    }
    //0 for false and 1 for true is space is a possible move for the current color
    player.possiblemoves = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
    getAvailableMoves()
    
}


// gets the moves that the selected piece can make
// loop through all pieces of the current color and find possible moves
function getAvailableMoves() {
    // loop through the pieces of the current player
    
    for (i = 0; i<playerPieces.length; i++)
    {
        //console.log(i)
        cell = playerPieces[i];
        
        // get the location of the piece in the gameboard matrix

        indices = findPiece(cell.id);
        row = indices[0];
        col = indices[1];

        console.log("Row: " + row+ "| Column: " + col);
        //check the eight possible directions for opposing color's pieces
        
        //First Check left
        j = col;
        while(board[row][j-1]%2 != player.colorId && j>=0)
        {
            // check to see if spot two to the left piece is open or not    
            if ( board[row][j-2] == 0)
            {
                player.possiblemoves[row][j-2] = 1;
                cells[row*8+j-2].innerHTML = `<p class="validMoveHere" ></p>`;
                j--;
                
            }
            else if (((board[row][j-1])%2) == ((board[row][j-2])%2))
            {
                j--;
            }    
        }

        //Next Check Right
        j = col;
        while(board[row][j+1]%2 != player.colorId && j<80)
        {
            // check to see if spot two to the left piece is open or not    
            if ( board[row][j+2] == 0)
            {
                player.possiblemoves[row][j+2] = 1;
                cells[row*8+j+2].innerHTML = `<p class="validMoveHere" ></p>`;
                j++;
                
            }
            else if (((board[row][j-1])%2) == ((board[row][j-2])%2))
            {
                j++;
            }    
        }

        //check upwards 
        k = row;
        while(board[k-1][col]%2 != player.colorId && k>=0)
        {
            
            // check to see if spot two up is open or not   
            if ( board[k-2][col] == 0)
            {
                player.possiblemoves[k-2][col] = 1;
                cells[(k-2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
                k--;
                
            }
            else if (((board[k-1][col])%2) == ((board[k-2][col])%2))
            {
                k--;
            }    
        }

        // check downards
        k = row;
        while(board[k+1][col]%2 != player.colorId && k<8)
        {
            
            // check to see if spot two up is open or not   
            if ( board[k+2][col] == 0)
            {
                player.possiblemoves[k+2][col] = 1;
                cells[(k+2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
                k++; 
            }
            else if (((board[k+1][col])%2) == ((board[k+2][col])%2))
            {
                k++;
            }    
        }

        // check NorthWest
        k = row;
        j = col;
        while(board[k-1][j-1]%2 != player.colorId && k>=0 && j >= 0)
        {
            
            // check to see if spot two up is open or not   
            if ( board[k-1][j-1] == 0)
            {
                player.possiblemoves[k-2][j-1] = 1;
                cells[(k-2)*8+col-2].innerHTML = `<p class="validMoveHere" ></p>`;
                console.log( cells[(k-22)*8+col-2].innerHTML)
                k--;
                j--;
                
            }
            else if (((board[k-1][j-1])%2) == ((board[k-2][j-2])%2))
            {
                k--;
                j--;
            }    

        }

    }
    possiblePlaces = document.querySelectorAll("p")
            
}

// testing placement of pieces onto the board
function placePiece(row, col){
    if(turn)
    {
        cells[row*8+col].innerHTML = '<w class="white-piece" id="'+nextwhitePieceId+'"></w>';
        //console.log("THIS IS CELL:" + cells[row*8+col])
        whitesPieces = document.querySelectorAll("w");
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId++;
        //replaceMiddlePieces()
        changePlayer()
    }
    else{
        cells[row*8+col].innerHTML = '<b class="black-piece" id="'+nextblackPieceId+'"></b>';
        blacksPieces = document.querySelectorAll("b");
        board[row][col] = nextblackPieceId;
        nextblackPieceId++;
        //replaceMiddlePieces()
        changePlayer()
    } 
}

// This Method Replaces all Pieces in the Middle of Two With New Color


/*

// gives the cells on the board a 'click' based on the possible moves
function giveCellsClick() {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "makeMove(7)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "makeMove(9)");
    }
    if (selectedPiece.fourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 14].setAttribute("onclick", "makeMove(14)");
    }
    if (selectedPiece.eighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 18].setAttribute("onclick", "makeMove(18)");
    }
    if (selectedPiece.minusSeventhSpace) {
        cells[selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "makeMove(-7)");
    }
    if (selectedPiece.minusNinthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "makeMove(-9)");
    }
    if (selectedPiece.minusFourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 14].setAttribute("onclick", "makeMove(-14)");
    }
    if (selectedPiece.minusEighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 18].setAttribute("onclick", "makeMove(-18)");
    }
}

/* v when the cell is clicked v */
/*
// makes the move that was clicked
function makeMove(number) {
    document.getElementById(selectedPiece.pieceId).remove();
    cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    if (turn) {
        cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
        redsPieces = document.querySelectorAll("p");
    }

    let indexOfPiece = selectedPiece.indexOfBoardPiece
    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    } else {
        changeData(indexOfPiece, indexOfPiece + number);
    }
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    }
    if (removePiece) {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
    }
    resetSelectedPieceProperties();
    removeCellonclick();
    removeEventListeners();
}

// Checks for a win
function checkForWin() {
    if (blackScore === 0) {
        divider.style.display = "none";
        for (let i = 0; i < whiteTurnText.length; i++) {
            whiteTurnText[i].style.color = "black";
            blackTurntext[i].style.display = "none";
            redTurnText[i].textContent = "White WINS!";
        }
    } else if (redScore === 0) {
        divider.style.display = "none";
        for (let i = 0; i < blackTurntext.length; i++) {            
            blackTurntext[i].style.color = "black";
            redTurnText[i].style.display = "none";
            blackTurntext[i].textContent = "BLACK WINS!";
        }
    }
    changePlayer();
}
*/
 //Switches player's turn
function changePlayer() {
    if (turn) {
        turn = false;
        for (let i = 0; i < whiteTurnText.length; i++) {
            whiteTurnText[i].style.color = "lightGrey";
            blackTurntext[i].style.color = "black";
            console.log("Running Through Change Player Once")
        }
        //removeEventListener();
        //getPlayerPieces();
    } else {
        turn = true;
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "lightGrey";
            whiteTurnText[i].style.color = "black";
        }
        //removeEventListener();
        //getPlayerPieces();
    }
    
    //getPlayerPieces();
    
}

getPlayerPieces();
