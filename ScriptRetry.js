/* Jonathan Walters (101 - 77 - 508)
CSC 475/550 - Winter 2021
Assignment 2 - Program the Othello Game and Implement the MiniMax Algorithm 
Also implement Alpha-Beta Pruning*/
/*----------------------------------------------------------------------------------*/
/* Restarting the script to separate out the HTML updates from the Back End Program */
/* Gameplay mechanics reimplemented as of January 28
However, HTML now updates after every move instead of with the moves
Essentially, HTML and Backend Javascript have been separated as much as possible to allow for
back end to make moves on boards that are not the gameboard that is attached to HTML elements
/*----------------------------------------------------------------------------------*/
/*Things which still need to be done: 
4. Heuristic works fine
5. MiniMax and Alpha Beta are working  */

/* HTML Contacts for Javascript Use*/
const whiteTurnText = document.querySelectorAll(".white-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const whiteScoretext = document.querySelectorAll(".white-score-text")
const blackScoretext = document.querySelectorAll(".black-score-text")
const depthText = document.querySelectorAll(".depth-text");
const divider = document.querySelector("#divider")

/* Global Variables which will be accessed by almost every function as needed */
let HumanIsWhite = true;
let GameOver = false;
let Depth = 2;
let DEBUG = false;
let PRUNE;
let PLAYAI = true;
let RECORD = true;
let NumberConsidered = 0;
let gameTrace = [];

/* We'll turn on Pruning if depth is greater than 6 by default */
if (Depth >=6)
{
    PRUNE = true;
}
else
{
    PRUNE = false;
}

let WhitesTurn = true;

/* The following are buttons for HTML attachment*/
const refreshButton = document.querySelector('.refresh-button');
refreshButton.addEventListener('click',function(){location.reload()});

const debugButton = document.querySelector('.debug-button');
debugButton.addEventListener('click',function(){
    DEBUG = !DEBUG;
    updateHTML();
});

const depthButton = document.querySelector('.depth-button');
depthButton.addEventListener('click', function(){changeDepth();});

const playAIButton = document.querySelector('.playAI-button');
playAIButton.addEventListener('click', function(){
    PLAYAI = !PLAYAI; 
    updateHTML();
});

const swapColorButton = document.querySelector('.color-button');
swapColorButton.addEventListener('click', function(){
    HumanIsWhite = !HumanIsWhite; 
    updateHTML();
    PlayGame();
});

const pruneButton = document.querySelector('.prune-button');
pruneButton.addEventListener("click", function (){
    if(PRUNE){
        document.getElementById('prune').style.background = "rgb(238,138,107)";
    }
    else
    {
        document.getElementById('prune').style.background = "rgb(163, 228, 166)";
        
    }
    PRUNE = !PRUNE;
    updateHTML();
});




const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,"b","w",0,0, 0],
    [0, 0, 0,"w","b",0,0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],]


const cells = document.querySelectorAll("td");

// players whose turn it is properties
let whitePlayer = {
    colorId: "w",   /* white player will have even number pieces */
    score: 2,
    //0 for false and 1 for true is space is a possible move for the current color
    possiblemoves: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0,"p",0, 0, 0, 0],
        [0, 0,"p",0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0,"p",0, 0],
        [0, 0, 0, 0,"p",0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    numberOfPossible: 4
}

let blackPlayer = 
{
    colorId: "b",
    score: 2,
    //0 for false and 1 for true is space is a possible move for the current color
    possiblemoves: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0,"p",0, 0, 0],
        [0, 0, 0, 0, 0,"p",0, 0],
        [0, 0,"p", 0, 0, 0,0, 0],
        [0, 0, 0,"p", 0,0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    numberOfPossible: 4
}

function AlphaBetaPrune(board, depth, alpha, beta, maximizingPlayer)
{
    let bestMoveRow;
    let bestMoveCol;
    let Search;
    Search = true;
    let gameBoard;
    let maxEval;
    let minEval;
    let eval;
    let possibleMoves;
    if (maximizingPlayer)
    {
        possibleMoves = getPossibleMoves(board, "white");
    }
    else
    {
        possibleMoves = getPossibleMoves(board, "black");
    }
    numberOfPossibleMoves = getPossibleCount(possibleMoves);
    if(depth == 0 || isGameOver(board) || numberOfPossibleMoves == 0)
    {
        /*console.log("reached depth 0")
        console.log(Heuristic(board));*/
        /*console.log(board)*/
        if(DEBUG)
        {
            console.log("reached depth 0");
            console.log(board);
            console.log("Heuristic Value for above board Is: "+Heuristic(board));
        }
        return [Heuristic(board), -1, -1];     
    }
    else if(maximizingPlayer)
    {
        
        maxEval = -1000000000000000;
        /* loop through every move and recursively call miniMax */
        let i = 0;
        if(DEBUG)
        {
            gameBoard = copyBoard(board);
            console.log("Depth of the board below is: " + depth);
            console.log(gameBoard);
        }
        while(Search && i < 8)
        {
            for (let j = 0; j < 8; j++)
            {
                if( possibleMoves[i][j] == "p")
                {
                    NumberConsidered++;
                    gameBoard = copyBoard(board);
                    placePiece(i, j, gameBoard, "white")
                    changeMiddlePieces(i, j, gameBoard, "white")
                    eval = AlphaBetaPrune(gameBoard, depth-1, alpha, beta, false);
                    if( eval[0] > maxEval )
                    {
                        maxEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;
                        /*console.log(bestMoveRow + ", " + bestMoveCol);*/
                    }
                    if( eval[0] > alpha)
                    {
                        alpha = eval[0];
                    }
                    if( beta <= alpha)
                    {
                        j = 9; /*will break out of the inner for loop*/
                        Search = false;
                        
                    }

                }
            }
            i++;
        }
        return [maxEval, bestMoveRow, bestMoveCol]
    }
    else
    {
        /*console.log("running minimax for black at depth " + depth);*/
        minEval = 100000000000000;
        /* loop through every move and recursively call miniMax */
        let i = 0;
        if(DEBUG)
        {
            gameBoard = copyBoard(board);
            console.log("Depth of the board below is: " + depth);
            console.log(gameBoard);
        }
        while(Search && i < 8)
        {
            for (let j = 0; j < 8; j++)
            {
                /*console.log(possibleMoves[i][j] + " At "+ i + ", "+ j);*/
                if( possibleMoves[i][j] == "p")
                {
                    NumberConsidered++;
                    /*console.log(i+", "+j);*/
                    gameBoard = copyBoard(board);
                    /*console.log(board)*/
                    placePiece(i, j, gameBoard, "black")
                    changeMiddlePieces(i, j, gameBoard, "black")
                    eval = AlphaBetaPrune(gameBoard, depth-1, alpha, beta, true);
                    /*console.log("recursive call done");*/
                    /*console.log(i+", "+j + " Black to Choose Value is: " + eval[0]);*/
                    
                    if(eval[0] < minEval)
                    {
                        minEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;
                        /*console.log(bestMoveRow+", "+bestMoveCol);*/
                    }
                    if( eval[0] < beta)
                    {
                        beta = eval[0];
                    }
                    if( beta <= alpha)
                    {
                        j=9; /*will break out of the inner for loop*/
                        Search = false;
                        
                    }
                    /*console.log("Best move is: " + bestMoveRow+", "+bestMoveCol);*/
                }
            }
            i++;
        }
        return [minEval, bestMoveRow, bestMoveCol]
    }
}

/* Here we will change the depth of the MiniMax search */
function changeDepth()
{
    if(Depth < 8)
    {
        Depth = Depth + 2;
    }
    else
    {
        Depth = 2;
    }
    if (Depth >=6)
    {
        PRUNE = true;
    }
    else
    {
        PRUNE = false;
    }
    updateHTML();
}

function changeMiddlePieces(row, col, board, color)
{
     // row is the current row number of the new piece
    // col is the current column number of the new piece
    // need to check all directions for pieces that might need to be changed based on this placement.
    let colorId;
    if(color == "white")
    {
        colorId = "w";
    }
    else{
        colorId = "b";
    }


     //First Check left
     let j = col;
     let k = row;
     let endcol = j;
     let endrow = k;
     while(j>=2 && board[row][j-1]!= 0 && board[row][j-1] != colorId)
     {
         // check to see if spot two to the left piece is same color or not    
         if ( board[row][j-2] == colorId && board[row][j-2] != 0 )
         {
             endcol = j-2;
             for (let n=col-1; n>endcol; n--)
             {
                 changePiece(row, n, board, color);
             }
             break;
             
         }
         else
         {
             j--;
         } 
     }

     //Check right
     j = col;
     k = row;
     endcol = j;
     endrow = k;
     while(j<6 && board[row][j+1]!= 0 && board[row][j+1] != colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[row][j+2] == colorId && board[row][j+2] != 0)
         {
             endcol = j+2;
             for (let n = col+1; n<endcol; n++)
             {
                 changePiece(row, n, board, color);
             }
             break;
             
         }
         else
         {
             j++;
         } 
     }

     //Check down
     j = col;
     k = row;
     endcol = j;
     endrow = k;
     while(k<6 && board[k+1][col]!= 0 && board[k+1][col] != colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[k+2][col] == colorId && board[k+2][col]!=0)
         {
             endrow = k+2;
             for (let n = row+1; n < endrow; n++)
             {
                 changePiece(n, col, board, color);
             }
             break;
             
         }
         else
         {
             k++;
         } 
     }

    //Check up
    j = col;
    k = row;
    endcol = j;
    endrow = k;
    while(k>=2 && board[k-1][col]!= 0 && board[k-1][col] != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][col] == colorId &&  board[k-2][col]!=0 )
        {
            endrow = k-2;
            for (let n = row-1; n > endrow; n--)
            {
                changePiece(n, col, board, color);
            }
            break;
            
        }
        else
        {
            k--;
        } 
    }

    //Check northWest
    j = col;
    k = row;
    endcol = j;
    endrow = k;
    while(k>=2 && j>=2 && board[k-1][j-1]!= 0 && board[k-1][j-1] != colorId)
    {
        // check to see if spot two away is same color as player or not    
        if ( board[k-2][j-2] == colorId && board[k-2][j-2]!=0 )
        {
            endrow = k-2;
            endcol = j-2;
            m = col-1; 
            for (let n = row-1; n > endrow; n--)
            {
                changePiece(n, m, board, color);
                m--;
            }
            break;    
        }
        else
        {
            k--;
            j--;
        } 
    }
    
     //Check northEast
    j = col;
    k = row;
    endcol = j;
    endrow = k;
    while(k>=2 && j<6 && board[k-1][j+1]!= 0 && board[k-1][j+1] != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][j+2] == colorId && board[k-2][j+2]!= 0 )
        {
            endrow = k-2;
            endcol = j+2;
            m = col+1;
            for (let n = row-1; n > endrow; n--)
            { 
                changePiece(n, m, board, color);
                m+=1;
            }
            break;
        }
        else
        {
            k--;
            j++;
        } 
    }

    //Check southEast
    j = col;
    k = row;
    endcol = j;
    endrow = k;
    while(k<6 && j<6 && board[k+1][j+1]!= 0 && board[k+1][j+1] != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j+2] == colorId && board[k+2][j+2]!= 0 )
        {
            endrow = k+2;
            endcol = j+2;
            m = col+1; 
            for (let n = row+1; n < endrow; n++)
            {
                changePiece(n, m, board, color);
                m+=1;
            }
            break;
        }
        else
        {
            k++;
            j++;
        } 
    }

     //Check southWest
    j = col;
    k = row;
    endcol = j;
    endrow = k;
    while(k<6 && j>=2 && board[k+1][j-1]!= 0 && board[k+1][j-1] != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j-2] == colorId && board[k+2][j-2]!= 0 )
        {
            endrow = k+2;
            endcol = j-2;
            m = col-1;
            for (let n = row+1; n < endrow; n++)
            { 
                changePiece(n, m, board, color);
                m-=1;
            }
            break;
        }
        else
        {
            k++;
            j--;
        } 
    }
}

function changePiece(row, col, board, color){
    //row and col are the position in the matrix to be changed
    if(color == "white")
    {   
        board[row][col] = "w"; 
    }
    else{
        board[row][col] = "b";
    } 
}

function copyBoard(board)
{
    let copy = [[0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]];
    let i;
    let j;
    for(i = 0; i < 8; i++)
    {
        for(j = 0; j < 8; j++)
        {
            copy[i][j] = board[i][j];
        }
    }
    return copy;
}

function getCorners(board, color)
{
    let count = 0;
    if(color == "white")
    {
        if(board[0][0]== "w")
        {
            count++;
        }
        if(board[0][7]== "w")
        {
            count++;
        }
        if(board[7][0]== "w")
        {
            count++;
        }
        if(board[7][7]== "w")
        {
            count++;
        }
    }
    if(color == "black")
    {
        if(board[0][0]== "b")
        {
            count++;
        }
        if(board[0][7]== "b")
        {
            count++;
        }
        if(board[7][0]== "b")
        {
            count++;
        }
        if(board[7][7]== "b")
        {
            count++;
        }
    }
    return count;
}

function getScore(board, color)
{
    let count = 0;
    let colorId;
    if(color == "white")
    {
        colorId = "w";
    }
    else
    {
        colorId = "b";
    }
    for(let i = 0; i < 8; i++)
    {
        for(let j = 0; j < 8; j++)
        {
            if (board[i][j] == colorId)
            {
                count++
            }
        }
    }
    return count;

}

function getPossibleMoves(board, color)
{
    let possible = [[0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],]

    let playerId;
    // loop through the pieces of the current player
    if (color == "white")
    {
        playerId = "w"; 
    }
    else
    {
        playerId = "b"; 
    }

    let row;
    let col;
    let j;
    let k;
    for (row = 0; row<8; row++)
    {
        for(col = 0; col<8; col++)
        {
            if(board[row][col] == playerId)
            {
                j = col;
                while(j>=2 && board[row][j-1]!= 0 && board[row][j-1] != playerId)
                {
                    // check to see if next spot to the left is open or not    
                    if ( board[row][j-2] == 0)
                    {
                        possible[row][j-2] = "p";
                        break
                    }
                    else
                    {
                        j--;
                    } 
                }

                //Next Check Right
                j = col;
                while(j<6 && board[row][j+1]!=0 && board[row][j+1] != playerId)
                {
                    // check to see if spot two to the left piece is open or not    
                    if ( board[row][j+2] == 0)
                    {
                        
                        possible[row][j+2] = "p";
                        
                        break  
                    }
                    else
                    {
                        j++;
                    } 
                }

                //check upwards 
                k = row;
                while( k>=2 && board[k-1][col]!=0 && board[k-1][col] != playerId)
                {
                    // check to see if spot two up is open or not   
                    if ( board[k-2][col] == 0)
                    {
                        possible[k-2][col] = "p";
                        break 
                    }
                    else
                    {
                        k--;
                    }  
                }

                // check downards
                k = row;
                while(k<6 && board[k+1][col] !=0 && board[k+1][col] != playerId )
                {
                    // check to see if spot two down is open or not   
                    if ( board[k+2][col] == 0)
                    {
                        possible[k+2][col] = "p";
                        break
                    }
                    else
                    {
                        k++;
                    } 
                }

                // check NorthWest
                k = row;
                j = col;
                while(k>=2 && j >= 2 && board[k-1][j-1]!=0 && board[k-1][j-1] != playerId)
                {
                    // check to see if spot two northwest is open or not   
                    if ( board[k-2][j-2] == 0)
                    {
                        possible[k-2][j-2] = "p";
                        break 
                    }
                    else
                    {
                        k--;
                        j--;
                    }   
                }

                // check NorthEast
                k = row;
                j = col;
                while( k>=2 && j < 6 && board[k-1][j+1]!=0 && board[k-1][j+1] != playerId)
                {
                    // check to see if spot two northwest is open or not   
                    if ( board[k-2][j+2] == 0)
                    {
                        possible[k-2][j+2] = "p";
                        break  
                    }
                    else
                    {
                        k--;
                        j++;
                    }    
                }

                // check SouthEast
                k = row;
                j = col;
                while(k<6 && j < 6 && board[k+1][j+1]!=0 && board[k+1][j+1] != playerId )
                {
                    
                    // check to see if spot two northwest is open or not   
                    if ( board[k+2][j+2] == 0)
                    {
                        possible[k+2][j+2] = "p";
                        break
                    }
                    else
                    {
                        k++;
                        j++;
                    }    
                }

                // check SouthWest
                k = row;
                j = col;
                while(k<6 && j >= 2 && board[k+1][j-1]!=0 && board[k+1][j-1] != playerId )
                {
                    // check to see if spot two northwest is open or not   
                    if ( board[k+2][j-2] == 0)
                    {
                        possible[k+2][j-2] = "p";
                        break
                        
                    }
                    else
                    {
                        k++;
                        j--;
                    }    
                }
            }
        }
    }
    return possible;
}

function getPossibleCount(PossibleBoard)
{
    let count = 0;
    let i;
    let j;
    for( let i = 0; i < 8; i++)
    {
        for (let j = 0; j< 8 ; j++)
        {
            if(PossibleBoard[i][j] == "p")
            {
                count++;
            }
        }
    }
    return count;
}

// initialize event listeners on cells
function giveCellsClick() {
    console.log("Give Cells Click")
    let player;
    if(WhitesTurn)
    {
        player = whitePlayer;
    }
    else
    {
        player = blackPlayer;
    }
    cells.forEach(cell => {
        cell.addEventListener('click', () =>
        {    
            let i = cell.closest('tr').rowIndex;
            let j = cell.cellIndex;
            if(board[i][j] == 0 && player.possiblemoves[i][j] == "p")
            { 
                if(WhitesTurn)
                {
                   
                    placePiece(i, j, board, "white");
                    changeMiddlePieces(i,j, board, "white")
                }
                else
                {
                    placePiece(i, j, board, "black");
                    changeMiddlePieces(i, j, board, "black")
                }
                WhitesTurn = !WhitesTurn;
                whitePlayer.possiblemoves = getPossibleMoves(board, "white");
                blackPlayer.possiblemoves = getPossibleMoves(board, "black");
                whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves);
                blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves);
                /* The following will skip a player if they have no moves available */
                if(WhitesTurn && whitePlayer.numberOfPossible == 0)
                {
                    WhitesTurn = !WhitesTurn
                }
                if(!WhitesTurn && blackPlayer.numberOfPossible == 0)
                {
                    WhitesTurn = !WhitesTurn
                }
                GameOver = isGameOver(board);
                updateHTML();
                if(!GameOver)
                {
                    PlayGame();
                }
            }
            
        }); 
      });
}

function Heuristic(board)
{
    if(isWinningBoard(board, "white"))
    {
        return 10000000;
    }
    else if(isWinningBoard(board, "black"))
    {
        return -10000000;
    }
    else
    {
        let whiteCount = getPossibleCount(getPossibleMoves(board, "white"));
        let blackCount = getPossibleCount(getPossibleMoves(board, "black"));

        let whiteCornerCount = getCorners(board, "white")
        let blackCornerCount = getCorners(board, "black")

        let whiteScore = getScore(board, "white");
        let blackScore = getScore(board, "black");

        return ((whiteCount - blackCount)/(whiteCount+1)*4 + (whiteScore - blackScore)/(whiteScore + 1) + (whiteCornerCount - blackCornerCount)/(whiteCornerCount + 1)*20);
        /*return( (whiteCornerCount-blackCornerCount)/4 * 10)*/
    }

}

/* will check to see if game is over in current board state */
function isGameOver(board)
{
    let whiteScore = getScore(board, "white");
    let blackScore = getScore(board, "black");
    let whiteMoveCount;
    whiteMoveCount = getPossibleCount(getPossibleMoves(board, "white"));
    let blackMoveCount;
    blackMoveCount = getPossibleCount(getPossibleMoves(board, "black"));
    if( (whiteMoveCount == 0 && blackMoveCount == 0) || (whiteScore + blackScore == 64) || whiteScore == 0 || blackScore == 0 )
    {
        return true;
    }
    else 
    {
        return false;
    }

}

/* This function will check if the board is a winner for the current color */
function isWinningBoard(board, color)
{
    let whiteScore = getScore(board, "white");
    let blackScore = getScore(board, "black");
    if(isGameOver(board) && (whiteScore > blackScore))
    {
        if(color == "white")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else if(isGameOver(board) && (whiteScore < blackScore))
    {
        if(color == "white")
        {
            return false;
        }
        else
        {
            return true;
        }
    }

}

function makeAImove()
{
    NumberConsidered = 0;
    if(!PRUNE)
    {
        let minimaxmove;
        if (HumanIsWhite)
        {
            if (blackPlayer.numberOfPossible > 1)
            {
                minimaxmove = miniMax(board, Depth, false)
                console.log(minimaxmove);
                console.log("Placing Piece for black after considering " + NumberConsidered + " possible moves.")
                /*setTimeout(function(){placePiece(minimaxmove[1], minimaxmove[2], board, "black")}, 200);*/
                placePiece(minimaxmove[1], minimaxmove[2], board, "black");
                changeMiddlePieces(minimaxmove[1], minimaxmove[2], board, "black");
            }
            else
            {
                let i;
                let j;
                for(i=0; i<8; i++)
                {
                    for(j=0; j<8; j++)
                    {
                        if(blackPlayer.possiblemoves[i][j] == "p")
                        {
                            console.log("Making Black's Only Possible Move");
                            placePiece(i, j, board, "black");
                            changeMiddlePieces(i, j, board, "black");
                        }
                    }
                }
            }
            whitePlayer.possiblemoves = getPossibleMoves(board, "white");
            blackPlayer.possiblemoves = getPossibleMoves(board, "black");
            whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves);
            blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves);
            WhitesTurn =! WhitesTurn;
            GameOver = isGameOver(board);
            updateHTML();
            if(!GameOver)
            {
                PlayGame();
            }
        }
        else  /* if human is black */
        {
            if (blackPlayer.numberOfPossible > 1)
            {
                minimaxmove = miniMax(board, Depth, true)
                console.log(minimaxmove);
                console.log("Placing Piece for black after considering " + NumberConsidered + " possible moves.")
                /*setTimeout(function(){placePiece(minimaxmove[1], minimaxmove[2], board, "black")}, 200);*/
                placePiece(minimaxmove[1], minimaxmove[2], board, "white");
                changeMiddlePieces(minimaxmove[1], minimaxmove[2], board, "white");
            }
            else
            {
                let i;
                let j;
                for(i=0; i<8; i++)
                {
                    for(j=0; j<8; j++)
                    {
                        if(blackPlayer.possiblemoves[i][j] == "p")
                        {
                            console.log("Making Whites's Only Possible Move");
                            placePiece(i, j, board, "white");
                            changeMiddlePieces(i, j, board, "white");
                        }
                    }
                }
            }
            whitePlayer.possiblemoves = getPossibleMoves(board, "white");
            blackPlayer.possiblemoves = getPossibleMoves(board, "black");
            whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves);
            blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves);
            WhitesTurn =! WhitesTurn;
            GameOver = isGameOver(board);
            updateHTML();
            if(!GameOver)
            {
                PlayGame();
            }
        }
    }
    else
    {
        let AlphaBetaMove;
        if (HumanIsWhite)
        {
            if (blackPlayer.numberOfPossible > 1)
            {
                AlphaBetaMove = AlphaBetaPrune(board, Depth, -100000000000000000, 100000000000000000, false)
                console.log(AlphaBetaMove);
                console.log("Placing Piece for white after considering " + NumberConsidered + " possible moves.")
                /*setTimeout(function(){placePiece(minimaxmove[1], minimaxmove[2], board, "black")}, 200);*/
                placePiece(AlphaBetaMove[1], AlphaBetaMove[2], board, "black");
                changeMiddlePieces(AlphaBetaMove[1], AlphaBetaMove[2], board, "black");
            }
            else
            {
                let i;
                let j;
                for(i=0; i<8; i++)
                {
                    for(j=0; j<8; j++)
                    {
                        if(blackPlayer.possiblemoves[i][j] == "p")
                        {
                            console.log("Making Black's Only Possible Move");
                            placePiece(i, j, board, "black");
                            changeMiddlePieces(i, j, board, "black");
                        }
                    }
                }
            }
            whitePlayer.possiblemoves = getPossibleMoves(board, "white");
            blackPlayer.possiblemoves = getPossibleMoves(board, "black");
            whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves);
            blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves);
            WhitesTurn =! WhitesTurn;
            GameOver = isGameOver(board);
            updateHTML();
            if(!GameOver)
            {
                PlayGame();
            }
        }
        else /* If Human is Black */
        {
            if (blackPlayer.numberOfPossible > 1)
            {
                AlphaBetaMove = AlphaBetaPrune(board, Depth, -100000000000000000, 100000000000000000, true)
                console.log(AlphaBetaMove);
                console.log("Placing Piece for white after considering " + NumberConsidered + " possible moves.")
                /*setTimeout(function(){placePiece(minimaxmove[1], minimaxmove[2], board, "black")}, 200);*/
                placePiece(AlphaBetaMove[1], AlphaBetaMove[2], board, "white");
                changeMiddlePieces(AlphaBetaMove[1], AlphaBetaMove[2], board, "white");
            }
            else
            {
                let i;
                let j;
                for(i=0; i<8; i++)
                {
                    for(j=0; j<8; j++)
                    {
                        if(blackPlayer.possiblemoves[i][j] == "p")
                        {
                            console.log("Making Whites's Only Possible Move");
                            placePiece(i, j, board, "white");
                            changeMiddlePieces(i, j, board, "white");
                        }
                    }
                }
            }
            whitePlayer.possiblemoves = getPossibleMoves(board, "white");
            blackPlayer.possiblemoves = getPossibleMoves(board, "black");
            whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves);
            blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves);
            WhitesTurn =! WhitesTurn;
            GameOver = isGameOver(board);
            updateHTML();
            if(!GameOver)
            {
                PlayGame();
            }
        }
    }
}

/* Below we implement the MiniMax algorithm */
function miniMax(board, depth, maximizingPlayer)
{
    let bestMoveRow;
    let bestMoveCol;
    let Search;
     Search = true;
    let gameBoard;
    let maxEval;
    let minEval;
    let eval;
    let possibleMoves;
    if (maximizingPlayer)
    {
        possibleMoves = getPossibleMoves(board, "white");
    }
    else
    {
        possibleMoves = getPossibleMoves(board, "black");
    }
    numberOfPossibleMoves = getPossibleCount(possibleMoves);
    /* Calculate Heuristic if at the bottom of search or if can't go further down */
    if(depth == 0 || isGameOver(board) || numberOfPossibleMoves == 0)
    {
        if(DEBUG)
        {
            console.log("reached depth 0")
            console.log("Heuristic Value for the board below is: "+Heuristic(board));
            console.log(board)
        }
        
        return [Heuristic(board), -1, -1];
    }
    else if(maximizingPlayer)
    {
        
        maxEval = -1000000000000000;
        if(DEBUG)
        {
            gameBoard = copyBoard(board);
            console.log("Depth of the board below is: " + depth);
            console.log(gameBoard);
        }
        /* loop through every move and recursively call miniMax */
        let i = 0;
        while(Search && i < 8)
        {
            for (let j = 0; j < 8; j++)
            {
                if( possibleMoves[i][j] == "p")
                {
                    NumberConsidered++;
                    gameBoard = copyBoard(board);
                    placePiece(i, j, gameBoard, "white")
                    changeMiddlePieces(i, j, gameBoard, "white")
                    eval = miniMax(gameBoard, depth-1, false);
                    /* We will now essentially implement maxEval = max(eval, maxEval) */
                    if( eval[0] > maxEval )
                    {
                        maxEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;
                    }
                }
            }
            i++;
        }
        return [maxEval, bestMoveRow, bestMoveCol]
    }
    else
    {
        
        minEval = 100000000000000;
        if(DEBUG)
        {
            gameBoard = copyBoard(board);
            console.log("Depth of the board below is: " + depth);
            console.log(gameBoard);
        }
        /* loop through every move and recursively call miniMax */
        let i = 0;
        while(Search && i < 8)
        {
            for (let j = 0; j < 8; j++)
            {
                if( possibleMoves[i][j] == "p")
                {
                    NumberConsidered++;
                    gameBoard = copyBoard(board);
                    /*console.log(board)*/
                    placePiece(i, j, gameBoard, "black")
                    changeMiddlePieces(i, j, gameBoard, "black")
                    eval = miniMax(gameBoard, depth-1, true);
                    /* We will now essentially implement minEval = min(eval, minEval) */
                    if(eval[0] < minEval)
                    {
                        minEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;   
                    }
                }
            }
            i++;
        }
        return [minEval, bestMoveRow, bestMoveCol]
    }
}

function placePiece(row, col, grid, color)
{
    
    if(color == "white")
    {
        grid[row][col] = "w";
    }
    else if(color == "black")
    {
        grid[row][col] = "b";
    }
}

function PlayGame()
{
    
    if(RECORD)
    {
        pushBoard();
    }
    if(WhitesTurn && whitePlayer.numberOfPossible == 0)
    {
        WhitesTurn = !WhitesTurn
    }
    if(!WhitesTurn && blackPlayer.numberOfPossible == 0)
    {
        WhitesTurn = !WhitesTurn
    }
    GameOver = isGameOver(board);
    updateHTML();
    if(!GameOver)
    {
        if(PLAYAI)
        {
            if((HumanIsWhite && WhitesTurn) || (!HumanIsWhite && !WhitesTurn))
            { 
                giveCellsClick();
            }
            else if((HumanIsWhite && !WhitesTurn) || (!HumanIsWhite && WhitesTurn))
            {
                setTimeout(makeAImove, 500);
            }
        }
        else
        {
           giveCellsClick();
        }
        /*giveCellsClick();*/
        
    }
    
}

function pushBoard()
{
    boardCopy = copyBoard(board);
    gameTrace.push(boardCopy);
}

function printGameTrace()
{
    for(let i=0; i<gameTrace.length; i++ )
    {
        console.log(gameTrace[i]);
    }
}

function updateHTML()
{
    let whiteScore = getScore(board, "white");
    let blackScore = getScore(board, "black");
    let i; 
    let j;
    updateScoreHTML(whiteScore, blackScore);
    updateDepthHTML()
    if (!WhitesTurn) 
    {
        for (let i = 0; i < whiteTurnText.length; i++) 
        {
            whiteTurnText[i].style.color = "#5e5d5d";
            blackTurntext[i].style.color = "#f7f8f7";
        }  
    } 
    else
     {
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "#5e5d5d";
            whiteTurnText[i].style.color = "#f7f8f7";
        } 
    }

    let nextwhitePieceId = 2;
    let nextblackPieceId = 1
    for (i = 0; i < 8; i++)
    {
        
        for (j = 0; j < 8; j++)
        {
            if (board[i][j] == "b")
            {
                cells[i*8+j].innerHTML = '<b class="black-piece" id="'+nextblackPieceId+'"></b>'; 
                nextblackPieceId++;
            }
            else if(board[i][j] == "w")
            {
                cells[i*8+j].innerHTML = '<w class="white-piece" id="'+nextwhitePieceId+'"></w>'; 
                nextwhitePieceId++;
            }
            
        }
    }
    if(WhitesTurn)
    {
        for (i = 0; i < 8; i++)
        {
        
            for (j = 0; j < 8; j++)
            {
                if(board[i][j] != "w" && board[i][j] != "b")
                {
                    cells[i*8+j].innerHTML = ''
                    if (whitePlayer.possiblemoves[i][j] == "p")
                    {
                    cells[i*8+j].innerHTML = '<p class="validMoveHere" ></p>'; 
                    }
                }
            }
        }
    }
    else
    {
        for (i = 0; i < 8; i++)
        {
            for (j = 0; j < 8; j++)
            {
                if(board[i][j] != "w" && board[i][j] != "b")
                {
                    cells[i*8+j].innerHTML = ''
                    if (blackPlayer.possiblemoves[i][j] == "p")
                    {
                    cells[i*8+j].innerHTML = '<p class="validMoveHere" ></p>'; 
                    }
                }
            }
        }

    }
    if(!PRUNE){
        document.getElementById('prune').style.background = "rgb(238,138,107)";
        document.getElementById('prune').textContent = 'Pruning OFF';
    }
    else
    {
        document.getElementById('prune').style.background = "rgb(163, 228, 166)";
        document.getElementById('prune').textContent = 'Pruning ON';
    }

    if(PLAYAI)
    {
        document.getElementById('AIbutton').textContent = 'Human VS. AI (click for two players)';
    }
    else
    {
        document.getElementById('AIbutton').textContent = 'Human VS.Human (click for AI player)';
    }

    if(DEBUG)
    {
        document.getElementById('debug').textContent = 'Debug ON';
    }
    else
    {
        document.getElementById('debug').textContent = 'Debug OFF';
    }
    if(HumanIsWhite)
    {
        document.getElementById('colorbutton').textContent = 'Player 1 is White (Click to Play Black)';
    }
    else
    {
        document.getElementById('colorbutton').textContent = 'Player 1 is Black (Click to Play White)';
    }

}

function updateDepthHTML()
{
    if(Depth < 6)
    {
        for (let i = 0; i < depthText.length; i++) {            
            depthText[i].innerHTML = "Current Depth: "+ Depth;
        }
    }
    else
    {
        for (let i = 0; i < depthText.length; i++) {            
            depthText[i].innerHTML = "Current Depth: "+ Depth + '<br /> ' +" (Pruning By Default)";
        }
    }
}

function updateScoreHTML(whiteScore, blackScore)
{
     // update scores on page
     for (let i = 0; i < whiteScoretext.length; i++) {            
        whiteScoretext[i].textContent = "White's Score: "+ whiteScore;
        }
    for (let i = 0; i < blackScoretext.length; i++) {            
    blackScoretext[i].textContent = "Black's Score: "+ blackScore;
    }

    if(GameOver)
    {
        if(RECORD)
        {
            printGameTrace();
        }
        if (blackScore > whiteScore)
            {
                divider.style.display = "none";
                for (let i = 0; i < blackTurntext.length; i++) {            
                    blackTurntext[i].style.color = "#5e5d5d";
                    whiteTurnText[i].style.display = "none";
                    blackTurntext[i].textContent = "BLACK WINS!";
                }
                
            }
            else if(blackScore < whiteScore)
            {
                divider.style.display = "none";
                for (let i = 0; i < blackTurntext.length; i++) {            
                    whiteTurnText[i].style.color = "white";
                blackTurntext[i].style.display = "none";
                whiteTurnText[i].textContent = "White WINS!";
                }
            }
        
    }
}

updateHTML();
PlayGame();

