/* Restarting the script to separate out the HTML updates from the Back End Program */
/* Gameplay mechanics reimplemented as of January 28
However, HTML now updates after every move instead of with the moves
Essentially, HTML and Backend Javascript have been separated as much as possible to allow for
back end to make moves on boards that are not the gameboard that is attached to HTML elements
Things which still need to be done: 
1. Allow for skipping a player if no possible moves
2. Implement a Check to see if game is over in current board state
3. Update HTML Winner when game is over */


const whiteTurnText = document.querySelectorAll(".white-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const whiteScoretext = document.querySelectorAll(".white-score-text")
const blackScoretext = document.querySelectorAll(".black-score-text")
const divider = document.querySelector("#divider")
let HumanIsWhite = true;
let GameOver = false;
let Depth = 4;
let DEBUG = false;
let WhitesTurn = true;
let DoAlphaBetaPrune = false;

/* The following are buttons for HTML attachment*/
const refreshButton = document.querySelector('.refresh-button');
refreshButton.addEventListener('click',function(){location.reload()});

const debugButton = document.querySelector('.debug-button');
debugButton.addEventListener('click',function(){DEBUG = !DEBUG});






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
             for (n=col-1; n>endcol; n--)
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
             for (n=col+1; n<endcol; n++)
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
             for (n=row+1; n<endrow; n++)
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
            for (n=row-1; n>endrow; n--)
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
            for (n=row-1; n>endrow; n--)
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
            for (n=row-1; n>endrow; n--)
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
            for (n=row+1; n<endrow; n++)
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
            for (n=row+1; n<endrow; n++)
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
    for(i = 0; i < 8; i++)
    {
        for(j = 0; j < 8; j++)
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
            i = cell.closest('tr').rowIndex;
            j = cell.cellIndex;
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
        return -1000000;
    }
    else
    {
        let whiteCount = getPossibleCount(getPossibleMoves(board, "white"));
        let blackCount = getPossibleCount(getPossibleMoves(board, "black"));

        let whiteCornerCount = getCorners(board, "white")
        let blackCornerCount = getCorners(board, "black")

        let whiteScore = getScore(board, "white");
        let blackScore = getScore(board, "black");

        return (whiteCount - blackCount)/(whiteCount+blackCount+1)*4 + (whiteScore - blackScore)/(whiteScore + blackScore + 1) + (whiteCornerCount - blackCornerCount)/(whiteCornerCount + blackCornerCount + 1)*100;

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
    if( (whiteMoveCount == 0 && blackMoveCount == 0) || (whiteScore + blackScore == 64))
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
    if (HumanIsWhite)
    {
        if (blackPlayer.numberOfPossible > 1)
        {
            minimaxmove = miniMax(board, Depth, false)
            console.log(minimaxmove);
            console.log("Placing Piece for black")
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
}

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
    if(depth == 0 || isGameOver(board) || numberOfPossibleMoves == 0)
    {
        /*console.log("reached depth 0")
        console.log(Heuristic(board));*/
        return [Heuristic(board), -1, -1];
    }
    else if(maximizingPlayer)
    {
        gameBoard = copyBoard(board);
        maxEval = -1000000000000000;
        /* loop through every move and recursively call miniMax */
        let i = 0;
        while(Search && i < 8)
        {
            let j;
            for (j = 0; j < 8; j++)
            {
                if( possibleMoves[i][j] == "p")
                {
                    placePiece(i, j, gameBoard, "white")
                    changeMiddlePieces(i, j, gameBoard, "white")
                    eval = miniMax(gameBoard, depth-1, false);
                    if( eval[0] > maxEval )
                    {
                        maxEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;
                        /*console.log(bestMoveRow + ", " + bestMoveCol);*/
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
        gameBoard = copyBoard(board);
        minEval = 100000000000000;
        possibleMoves = getPossibleMoves(board, "black");
        /* loop through every move and recursively call miniMax */
        let i = 0;
        while(Search && i < 8)
        {
            let j;
            for (j = 0; j < 8; j++)
            {
                /*console.log(possibleMoves[i][j] + " At "+ i + ", "+ j);*/
                if( possibleMoves[i][j] == "p")
                {
                    /*console.log(i+", "+j);*/

                    placePiece(i, j, gameBoard, "black")
                    changeMiddlePieces(i, j, gameBoard, "black")
                    eval = miniMax(gameBoard, depth-1, true);
                    /*console.log("recursive call done");
                    console.log(i+", "+j);*/
                    
                    if(eval[0] < minEval)
                    {
                        minEval = eval[0];
                        bestMoveRow = i;
                        bestMoveCol = j;
                        /*console.log(bestMoveRow+", "+bestMoveCol);*/
                    }
                    /*console.log("Best move is: " + bestMoveRow+", "+bestMoveCol);*/
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
        let minimaxmove;
        /*giveCellsClick();*/
        if(HumanIsWhite && WhitesTurn)
        { 
            giveCellsClick();
        }
        else if(HumanIsWhite && !WhitesTurn)
        {
            setTimeout(makeAImove, 500);
        }
    }
    
}



function updateHTML()
{
    let whiteScore = getScore(board, "white");
    let blackScore = getScore(board, "black");
    let i; 
    let j;
    updateScoreHTML(whiteScore, blackScore);
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


/*while(whitePlayer.score + blackPlayer.score < 64 && (whitePlayer.numberOfPossible + blackPlayer.numberOfPossible !=0))
{
    updateHTML();
    giveCellsClick();
}*/