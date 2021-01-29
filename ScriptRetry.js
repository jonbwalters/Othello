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

const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,"b","w",0,0, 0],
    [0, 0, 0,"w","b",0,0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],]

let HumanIsWhite = true;
let depth = 2;
let DEBUG = false;
let WhitesTurn = true;
let DoAlphaBetaPrune = false;

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
    if(color == "white")
    {
        colorId = "w";
        otherColor = "black";
    }
    else{
        colorId = "b";
        otherColor = "white";
    }


     //First Check left
     j = col;
     k = row;
     endcol = j;
     endrow = k;
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
    for(i = 0; i < 8; i++)
    {
        for(j = 0; j < 8; j++)
        {
            copy[i][j] = board[i][j];
        }
    }
}

function getScore(board, color)
{
    count = 0;
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
    possible = [[0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0,],]
    // loop through the pieces of the current player
    if (color == "white")
    {
        playerId = "w"; 
    }
    else
    {
        playerId = "b"; 
    }

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

// initialize event listeners on cells
function giveCellsClick() {
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
                updateHTML();
                PlayGame();
            }
            
        }); 
      });
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
    giveCellsClick();
}



function updateHTML()
{
    whiteScore = getScore(board, "white");
    blackScore = getScore(board, "black");
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

    nextwhitePieceId = 2;
    nextblackPieceId = 1
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
}

updateHTML();
PlayGame();


/*while(whitePlayer.score + blackPlayer.score < 64 && (whitePlayer.numberOfPossible + blackPlayer.numberOfPossible !=0))
{
    updateHTML();
    giveCellsClick();
}*/