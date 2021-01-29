/*Array to store the game state
Got the game working over the summer, but had wrong win if player ran out of moves
turns out you pass if you don't have any moves.
Game only ends if both players cannot move
White will be the maximizing player for the minimax algorithm*/



const board = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,4,3,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
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
let whitePossiblePlaces;
let blackPossiblePlaces;
let possiblePlaces = document.querySelectorAll("p")
const whiteTurnText = document.querySelectorAll(".white-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const whiteScoretext = document.querySelectorAll(".white-score-text")
const blackScoretext = document.querySelectorAll(".black-score-text")
const divider = document.querySelector("#divider")
let nextblackPieceId = 5;
let nextwhitePieceId = 6;
let HumanIsWhite = true;
let depth = 2;


// player properties
let turn = true;   /*white will start the game*/
let whiteScore = 2;
let blackScore = 2;
let playerPieces;

// players whose turn it is properties
let whitePlayer = {
    colorId: 0,
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
    ],
    numberOfPossible: 4
}

let blackPlayer = 
{
    colorId: 1,
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
    ],
    numberOfPossible: 4
}


/*---------- Gameplay Logic ----------*/
// holds the length of the players piece count
function getPlayerPieces() {
    if (turn) {
        playerPieces = whitesPieces;
        resetPossibleMoves()
    } 
    else {
        playerPieces = blacksPieces;
        resetPossibleMoves()
    }
    /*resetPlayerPossibleMoves()*/
    checkForWin();
    
    if( turn && possiblePlaces.length != 0)
    /* Let White Player make a Move */
    {
        giveCellsClick()
    }
    else if( possiblePlaces.length != 0)
    /* Let AI make a move */
    {
        setTimeout(indices = MiniMax(board, depth, !HumanIsWhite),1000);
        placePiece(indices[1], indices[2])
    }
    else if (possiblePlaces.length == 0 && blacksPieces.length + whitesPieces.length < 64 && !(blackPlayer.numberOfPossible == 0 && whitePlayer.numberOfPossible == 0))
    {
        /* if current player cannot move, switch to other player. */
        setTimeout(changePlayer(), 2000);
    }
    
    
}

// initialize event listeners on cells
function giveCellsClick() {
    if(turn)
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
            if(board[i][j] == 0 && player.possiblemoves[i][j] == 1)
            { 
                if(HumanIsWhite)
                {
                    placePiece(i, j, "white");
                }
                else
                {
                    placePiece(i, j, "black");
                }
                
            }
        }); 
      });
}

// resets color turn properties
function resetPossibleMoves() 
{
    //0 for false and 1 for true is space is a possible move for the current color
    
    whitePlayer.possiblemoves = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
    blackPlayer.possiblemoves = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]

    removeHTMLpossiblePlace();

    /*possiblePlaces = document.querySelector("p")*/
    if (turn)
    {
        blackPossiblePlaces = getAvailableMoves(board, "black");
        whitePossiblePlaces = getAvailableMoves(board, "white");
        possiblePlaces = whitePossiblePlaces;     
    }
    else
    {
        whitePossiblePlaces = getAvailableMoves(board, "white");
        blackPossiblePlaces = getAvailableMoves(board, "black");
        possiblePlaces = blackPossiblePlaces;
    }
}

function removeHTMLpossiblePlace()
{
    for(i=0; i<possiblePlaces.length; i++)
    {
        possiblePlaces[i].remove();
        //possiblePlaces[i].HTML = '<td></td>';
    }
}


// gets the moves that the selected piece can make
// loop through all pieces of the current color and find possible moves
function getAvailableMoves(board, color) {
    // loop through the pieces of the current player
    if (color == "white")
    {
        player = whitePlayer
        pieces = whitesPieces;
        playerId = 0; 
        
    }
    else
    {
        player = blackPlayer
        pieces = blacksPieces;
        playerId = 1; 
    }
    changeHTML = false;
    if(turn && playerId == 0 || !turn && playerId == 1)
    {
        changeHTML = true;
    }

    for (i = 0; i<pieces.length; i++)
    {
        //console.log(i)
        cell = pieces[i];
        
        // get the location of the piece in the gameboard matrix

        indices = findPiece(cell.id);
        row = indices[0];
        col = indices[1];

        //console.log("Row: " + row+ "| Column: " + col);
        //check the eight possible directions for opposing color's pieces
        
        //First Check left
        j = col;
        while(j>=2 && board[row][j-1]!= 0 && board[row][j-1]%2 != playerId)
        {
            // check to see if next spot to the left is open or not    
            if ( board[row][j-2] == 0)
            {
                player.possiblemoves[row][j-2] = 1;
                if(changeHTML)
                {
                    cells[row*8+j-2].innerHTML = `<p class="validMoveHere" ></p>`;
                }
                break
            }
            else
            {
                j--;
            } 
        }

        //Next Check Right
        j = col;
        while(j<6 && board[row][j+1]!=0 && board[row][j+1]%2 != playerId)
        {
            // check to see if spot two to the left piece is open or not    
            if ( board[row][j+2] == 0)
            {
                player.possiblemoves[row][j+2] = 1;
                if(changeHTML)
                {
                    cells[row*8+j+2].innerHTML = `<p class="validMoveHere" ></p>`;
                }
                break  
            }
            else
            {
                j++;
            } 
        }

        //check upwards 
        k = row;
        while( k>=2 && board[k-1][col]!=0 && board[k-1][col]%2 != playerId)
        {
            // check to see if spot two up is open or not   
            if ( board[k-2][col] == 0)
            {
                player.possiblemoves[k-2][col] = 1;
                if(changeHTML)
                {
                    cells[(k-2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
                }
                break 
            }
            else
            {
                k--;
            }  
        }

        // check downards
        k = row;
        while(k<6 && board[k+1][col] !=0 && board[k+1][col]%2 != playerId )
        {
            // check to see if spot two down is open or not   
            if ( board[k+2][col] == 0)
            {
                player.possiblemoves[k+2][col] = 1;
                if(changeHTML)
                {
                    cells[(k+2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
                }
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
        while(k>=2 && j >= 2 && board[k-1][j-1]!=0 && board[k-1][j-1]%2 != playerId)
        {
            // check to see if spot two northwest is open or not   
            if ( board[k-2][j-2] == 0)
            {
                player.possiblemoves[k-2][j-2] = 1;
                if(changeHTML)
                {
                    cells[(k-2)*8+(j-2)].innerHTML = `<p class="validMoveHere" ></p>`;
                }
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
        while( k>=2 && j < 6 && board[k-1][j+1]!=0 && board[k-1][j+1]%2 != playerId)
        {
            // check to see if spot two northwest is open or not   
            if ( board[k-2][j+2] == 0)
            {
                player.possiblemoves[k-2][j+2] = 1;
                if(changeHTML)
                {
                    cells[(k-2)*8+(j+2)].innerHTML = `<p class="validMoveHere" ></p>`;
                }
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
        while(k<6 && j < 6 && board[k+1][j+1]!=0 && board[k+1][j+1]%2 != playerId )
        {
            
            // check to see if spot two northwest is open or not   
            if ( board[k+2][j+2] == 0)
            {
                player.possiblemoves[k+2][j+2] = 1;
                if(changeHTML)
                {
                    cells[(k+2)*8+(j+2)].innerHTML = `<p class="validMoveHere" ></p>`;
                }
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
        while(k<6 && j >= 2 && board[k+1][j-1]!=0 && board[k+1][j-1]%2 != playerId )
        {
            // check to see if spot two northwest is open or not   
            if ( board[k+2][j-2] == 0)
            {
                player.possiblemoves[k+2][j-2] = 1;
                if(changeHTML)
                {
                    cells[(k+2)*8+(j-2)].innerHTML = `<p class="validMoveHere" ></p>`;
                }
                break
                
            }
            else
            {
                k++;
                j--;
            }    
        }
    }

    let Places = document.querySelectorAll("p")
    whitePlayer.numberOfPossible = getPossibleCount(whitePlayer.possiblemoves)
    blackPlayer.numberOfPossible = getPossibleCount(blackPlayer.possiblemoves)
    return Places  
}

function addHoveListener(){
    for(i=0; i<possiblePlaces.length; i++)
    {
        possiblePlaces[i].addEventListener("mouseover", possiblePlaces[i].innerHTML);
    }
}

function makeRandomMove(){
    
    k = 1 + Math.floor(Math.random()* (possiblePlaces.length-1));   /* we will randomly select a move to be made for now*/
    console.log(k)
    i=0;  /*row number*/
    j=-1; /*coumn number*/
    count = 0;
        while(count < k)
        {
            j++
            if(j > 0 && j%8 == 0)
            {
                i++;
                j=0;
            }
            if (player.possiblemoves[i][j] == 1)
            {
            count++;
            }
        }
    console.log(k +" Piece to go in " +i+", " +j)
    placePiece(i,j, "black");

}

// placement of pieces onto the board
function placePiece(row, col, color){
    //start and end are arrays with the starting and ending indices of the pieces boxing in those to be changed
    if(color == "white")
    {    
        cells[row*8+col].innerHTML = '<w class="white-piece" id="'+nextwhitePieceId+'"></w>';
        //console.log("THIS IS CELL:" + cells[row*8+col])
        whitesPieces = document.querySelectorAll("w");
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId+=2;  
    }
    else{
        cells[row*8+col].innerHTML = '<b class="black-piece" id="'+nextblackPieceId+'"></b>';
        blacksPieces = document.querySelectorAll("b");
        board[row][col] = nextblackPieceId;
        nextblackPieceId+=2;
    } 
    replaceMiddlePieces(row,col)
    changePlayer(true);
}

// placement of pieces onto the board
function placePieceForSearch(row, col, color, board){
    //start and end are arrays with the starting and ending indices of the pieces boxing in those to be changed
    if(color == "white")
    {    
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId+=2;  
    }
    else{
        
        board[row][col] = nextblackPieceId;
        nextblackPieceId+=2;
    } 
    replaceMiddlePiecesForSearch(row,col)
}

function changePiece(row, col){
    //row and col are the position in the matrix to be changed
    if(turn)
    {   
        cells[row*8+col].innerHTML = '<w class="white-piece" id="'+nextwhitePieceId+'"></w>';
        whitesPieces = document.querySelectorAll("w");
        blacksPieces = document.querySelectorAll("b");
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId+=2;  
    }
    else{
        cells[row*8+col].innerHTML = '<b class="black-piece" id="'+nextblackPieceId+'"></b>';
        blacksPieces = document.querySelectorAll("b");
        whitesPieces = document.querySelectorAll("w");
        board[row][col] = nextblackPieceId;
        nextblackPieceId+=2;
    } 
}

function changePieceForSearch(row, col, color, board){
    //row and col are the position in the matrix to be changed
    if(color == "white")
    {    
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId+=2;  
    }
    else{
        board[row][col] = nextblackPieceId;
        nextblackPieceId+=2;
    } 
}

// This Method Replaces all Pieces in the Middle of Two With New Color
function replaceMiddlePieces(row,col)
{
    // row is the current row number of the new piece
    // col is the current column number of the new piece
    // need to check all directions for pieces that might need to be changed based on this placement.

     //First Check left
     j = col;
     k = row;
     endcol = j;
     endrow = k;
     while(j>=2 && board[row][j-1]!= 0 && board[row][j-1]%2 != player.colorId)
     {
         // check to see if spot two to the left piece is same color or not    
         if ( board[row][j-2]%2 == player.colorId && board[row][j-2] != 0 )
         {
             endcol = j-2;
             for (n=col-1; n>endcol; n--)
             {
                 changePiece(row,n);
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
     while(j<6 && board[row][j+1]!= 0 && board[row][j+1]%2 != player.colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[row][j+2]%2 == player.colorId && board[row][j+2] != 0)
         {
             endcol = j+2;
             for (n=col+1; n<endcol; n++)
             {
                 changePiece(row,n);
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
     while(k<6 && board[k+1][col]!= 0 && board[k+1][col]%2 != player.colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[k+2][col]%2 == player.colorId && board[k+2][col]!=0)
         {
             endrow = k+2;
             for (n=row+1; n<endrow; n++)
             {
                 changePiece(n,col);
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
    while(k>=2 && board[k-1][col]!= 0 && board[k-1][col]%2 != player.colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][col]%2 == player.colorId &&  board[k-2][col]!=0 )
        {
            endrow = k-2;
            for (n=row-1; n>endrow; n--)
            {
                changePiece(n,col);
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
    while(k>=2 && j>=2 && board[k-1][j-1]!= 0 && board[k-1][j-1]%2 != player.colorId)
    {
        // check to see if spot two away is same color as player or not    
        if ( board[k-2][j-2]%2 == player.colorId && board[k-2][j-2]!=0 )
        {
            endrow = k-2;
            endcol = j-2;
            m = col-1; 
            for (n=row-1; n>endrow; n--)
            {
                changePiece(n,m);
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
    while(k>=2 && j<6 && board[k-1][j+1]!= 0 && board[k-1][j+1]%2 != player.colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][j+2]%2 == player.colorId && board[k-2][j+2]!= 0 )
        {
            endrow = k-2;
            endcol = j+2;
            m = col+1;
            for (n=row-1; n>endrow; n--)
            { 
                changePiece(n,m);
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
    while(k<6 && j<6 && board[k+1][j+1]!= 0 && board[k+1][j+1]%2 != player.colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j+2]%2 == player.colorId && board[k+2][j+2]!= 0 )
        {
            endrow = k+2;
            endcol = j+2;
            m = col+1; 
            for (n=row+1; n<endrow; n++)
            {
                changePiece(n,m);
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
    while(k<6 && j>=2 && board[k+1][j-1]!= 0 && board[k+1][j-1]%2 != player.colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j-2]%2 == player.colorId && board[k+2][j-2]!= 0 )
        {
            endrow = k+2;
            endcol = j-2;
            m = col-1;
            for (n=row+1; n<endrow; n++)
            { 
                changePiece(n,m);
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

// This Method Replaces all Pieces in the Middle of Two With New Color
function replaceMiddlePiecesForSearch(row,col, color, board)
{
    if(color == "white")
    {
        colorId = 0;
    }
    else{
        colorId = 1;
    }
    // row is the current row number of the new piece
    // col is the current column number of the new piece
    // need to check all directions for pieces that might need to be changed based on this placement.

     //First Check left
     j = col;
     k = row;
     endcol = j;
     endrow = k;
     while(j>=2 && board[row][j-1]!= 0 && board[row][j-1]%2 != colorId)
     {
         // check to see if spot two to the left piece is same color or not    
         if ( board[row][j-2]%2 == colorId && board[row][j-2] != 0 )
         {
             endcol = j-2;
             for (n=col-1; n>endcol; n--)
             {
                 changePieceForSearch(row,n);
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
     while(j<6 && board[row][j+1]!= 0 && board[row][j+1]%2 != colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[row][j+2]%2 == colorId && board[row][j+2] != 0)
         {
             endcol = j+2;
             for (n=col+1; n<endcol; n++)
             {
                 changePieceForSearch(row,n);
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
     while(k<6 && board[k+1][col]!= 0 && board[k+1][col]%2 != colorId)
     {
         // check to see if spot two away is same color or not    
         if ( board[k+2][col]%2 == colorId && board[k+2][col]!=0)
         {
             endrow = k+2;
             for (n=row+1; n<endrow; n++)
             {
                 changePieceForSearch(n,col);
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
    while(k>=2 && board[k-1][col]!= 0 && board[k-1][col]%2 != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][col]%2 == colorId &&  board[k-2][col]!=0 )
        {
            endrow = k-2;
            for (n=row-1; n>endrow; n--)
            {
                changePieceForSearch(n,col);
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
    while(k>=2 && j>=2 && board[k-1][j-1]!= 0 && board[k-1][j-1]%2 != colorId)
    {
        // check to see if spot two away is same color as player or not    
        if ( board[k-2][j-2]%2 == colorId && board[k-2][j-2]!=0 )
        {
            endrow = k-2;
            endcol = j-2;
            m = col-1; 
            for (n=row-1; n>endrow; n--)
            {
                changePieceForSearch(n,m);
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
    while(k>=2 && j<6 && board[k-1][j+1]!= 0 && board[k-1][j+1]%2 != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k-2][j+2]%2 == colorId && board[k-2][j+2]!= 0 )
        {
            endrow = k-2;
            endcol = j+2;
            m = col+1;
            for (n=row-1; n>endrow; n--)
            { 
                changePieceForSearch(n,m);
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
    while(k<6 && j<6 && board[k+1][j+1]!= 0 && board[k+1][j+1]%2 != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j+2]%2 == colorId && board[k+2][j+2]!= 0 )
        {
            endrow = k+2;
            endcol = j+2;
            m = col+1; 
            for (n=row+1; n<endrow; n++)
            {
                changePieceForSearch(n,m);
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
    while(k<6 && j>=2 && board[k+1][j-1]!= 0 && board[k+1][j-1]%2 != colorId)
    {
        // check to see if spot two away is same color or not    
        if ( board[k+2][j-2]%2 == colorId && board[k+2][j-2]!= 0 )
        {
            endrow = k+2;
            endcol = j-2;
            m = col-1;
            for (n=row+1; n<endrow; n++)
            { 
                changePieceForSearch(n,m);
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


function MiniMax(board, depth, maximizingPlayer)
{
    BoardCopy = copyBoard(board);
    whitemoves = getAvailableMoves(BoardCopy, "white")
    blackmove = getAvailableMoves(BoardCopy, "black")
    /* board is the state of the board, depth is the depth in the tree, and maximizingPlayer is a boolean that should be true if white
    and false is black */
    if(depth == 0 || isWinningPosition(board, maximizingPlayer))
    {
        return [Heuristic(board),null,null];
    }
    let bestRowIndex;
    let bestColumnIndex;
    if(maximizingPlayer)
    {
        
        possible = whitePlayer.possiblemoves;
        color = "white"
        maxEval = -100000000;
        /* Loop through every possible moove for the current player */
        for(i=0; i < 8; i++)
        {
            for(j = 0; j<8; j++)
            {
                if(possible[i][j] == 1)
                {
                    placePieceForSearch(i, j, color);
                    let eval = MiniMax(BoardCopy, depth-1, false)[0];
                    if (eval > maxEval)
                    {
                        maxEval = eval;
                        bestRowIndex = i;
                        bestColumnIndex = j;
                    }
                }
            }
        }
        return [maxEval, bestRowIndex, bestColumnIndex];
    }
    else
    {
        possible = blackPlayer.possiblemoves;
        color = "black"
        minEval = 100000000;
        /* Loop through every possible moove for the current player */
        for(i=0; i < 8; i++)
        {
            for(j = 0; j<8; j++)
            {
                if(possible[i][j] == 1)
                {
                    placePieceForSearch(i, j, color);
                    let eval = MiniMax(board, depth-1, true)[0];
                    if (eval < minEval)
                    {
                        minEval = eval;
                        bestRowIndex = i;
                        bestColumnIndex = j;
                    }
                }
            }
        }
        return [minEval, bestRowIndex, bestColumnIndex];
    }
}

function isWinningPosition(board, player)
{
    whitePieceCount = getPieces(board, "white");
    blackPieceCount = getPieces(board, "black");

    whitePossibleMoveCount = whitePossiblePlaces.length;
    blackPossibleMoveCount = blackPossiblePlaces.length;
    
    if(whitePieceCount + blackPieceCount == 64 || (whitePossibleMoveCount + blackPossibleMoveCount) == 0)
    {
        if (player == "white" && whitePieceCount > blackPieceCount)
        {
            return true;
        }
        else if(player == "white" && whitePieceCount <= blackPieceCount)
        {
            return false;
        }
        else if(player == "black" && whitePieceCount < blackPieceCount)
        {
            return true;
        }
        else if(player == "black" && whitePieceCount >= blackPieceCount)
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

/*console.log(isWinningPosition(board, "white"))*/

function Heuristic(board)
{
    whiteCorners = getCorners(board, "white");
    blackCorners = getCorners(board, "black");

    whitePieceCount = getPieces(board, "white");
    blackPieceCount = getPieces(board, "black")

    whitemoves = getAvailableMoves(board, "white")
    blackmoves = getAvailableMoves(board, "bkack")

    if(isWinningPosition(board, "white"))
    {
        return 100000;
    }
    else if(isWinningPosition(board, "black"))
    {
        return -100000;
    }
    else
    {
        return (whitePieceCount - blackPieceCount + 10*(whiteCorners - blackCorners ) + 5*(whitePlayer.numberOfPossible - blackPlayer.numberOfPossible));
    }
}

function getCorners(board, color)
{
    count = 0;
    if(color == "white")
    {
        if(board[0][0]%2 == 0 && board[0][0] != 0)
        {
            count++;
        }
        if(board[0][7]%2 == 0 && board[0][7] != 0)
        {
            count++;
        }
        if(board[7][0]%2 == 0 && board[7][0] != 0)
        {
            count++;
        }
        if(board[7][7]%2 == 0 && board[7][7] != 0)
        {
            count++;
        }
    }
    if(color == "black")
    {
        if(board[0][0]%2 == 1)
        {
            count++;
        }
        if(board[0][7]%2 == 1)
        {
            count++;
        }
        if(board[7][0]%2 == 1)
        {
            count++;
        }
        if(board[7][7]%2 == 1)
        {
            count++;
        }
    }
    return count;
}
/*console.log(getCorners(board, "white"))*/

function getPieces(board, color)
{
    count = 0;
    for( let i = 0; i < 8; i++)
    {
        for (let j = 0; j< 8 ; j++)
        {
            if(color == "white")
            {
                if(board[i][j]%2 == 0 && board[i][j] != 0)
                {
                    count++;
                }
            }
            else{
                if(board[i][j]%2 == 1)
                {
                    count++;
                }
            }
        }
    }
    return count;
}

function getPossibleCount(PossibleBoard)
{
    count = 0;
    for( let i = 0; i < 8; i++)
    {
        for (let j = 0; j< 8 ; j++)
        {
            if(PossibleBoard[i][j] == 1)
            {
                count++;
            }
        }
    }
    return count;
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
                [0, 0, 0, 0, 0, 0, 0, 0],];
    for(i = 0; i < 8; i++)
    {
        for(j = 0; j < 8; j++)
        {
            copy[i][j] = board[i][j];
        }
    }
}

//Checks for a win
function checkForWin() 
{
    /*console.log(blacksPieces.length+whitesPieces.length+ "possiblePlace.length = " + possiblePlaces.length)*/
    /* Here we check to see if the gameboard is full */
    if( (blacksPieces.length + whitesPieces.length) == 64 || (whitePlayer.numberOfPossible == 0 && blackPlayer.numberOfPossible == 0) )
    {
        if (blacksPieces.length > whitesPieces.length)
        {
            divider.style.display = "none";
            for (let i = 0; i < blackTurntext.length; i++) {            
                blackTurntext[i].style.color = "white";
                whiteTurnText[i].style.display = "none";
                blackTurntext[i].textContent = "BLACK WINS!";
            }
            
        }
        else if(blacksPieces.length < whitesPieces.length)
        {
            divider.style.display = "none";
            for (let i = 0; i < blackTurntext.length; i++) {            
                whiteTurnText[i].style.color = "white";
            blackTurntext[i].style.display = "none";
            whiteTurnText[i].textContent = "White WINS!";
            }
        }
    }
    /* Here we check to see if neither player can move. */
    
    /* if( possiblePlaces.length == 0 )  
    {
        /*switch to other player POV to check possible moves
        turn = !turn;
        if (turn) {
            playerPieces = whitesPieces;
        } 
        else {
            playerPieces = blacksPieces;
        }
        resetPossibleMoves();
        if( possiblePlaces.length == 0 )
        {
            if (blacksPieces.length > whitesPieces.length)
            {
                divider.style.display = "none";
                for (let i = 0; i < blackTurntext.length; i++) {            
                    blackTurntext[i].style.color = "white";
                    whiteTurnText[i].style.display = "none";
                    blackTurntext[i].textContent = "BLACK WINS!";
                }
            
            }
            else if(blacksPieces.length < whitesPieces.length)
            {
                divider.style.display = "none";
                for (let i = 0; i < blackTurntext.length; i++) {            
                    whiteTurnText[i].style.color = "white";
                blackTurntext[i].style.display = "none";
                whiteTurnText[i].textContent = "White WINS!";
                }
            }
            else
            {
                divider.style.display = "none";
                for (let i = 0; i < blackTurntext.length; i++) 
                {            
                    whiteTurnText[i].style.color = "white";
                blackTurntext[i].style.display = "none";
                whiteTurnText[i].textContent = "DRAW";
           `` }
        ``}
        }
        /*switch back  to original player
        turn = !turn;
        if (turn) {
            playerPieces = whitesPieces;
        } 
        else {
            playerPieces = blacksPieces;
        }
        resetPossibleMoves();
    } */
}

function updateScoreHTML()
{
     // update scores on page
     for (let i = 0; i < whiteScoretext.length; i++) {            
        whiteScoretext[i].textContent = "White's Score: "+ whitesPieces.length;
        }
    for (let i = 0; i < blackScoretext.length; i++) {            
    blackScoretext[i].textContent = "Black's Score: "+ blacksPieces.length;
    }
}

 //Switches player's turn
function changePlayer() 
{
    if (turn) 
    {
        turn = false;
        for (let i = 0; i < whiteTurnText.length; i++) 
        {
            whiteTurnText[i].style.color = "#5e5d5d";
            blackTurntext[i].style.color = "#f7f8f7";
        }  

        
        
    } 
    else
     {
        turn = true;
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "#5e5d5d";
            whiteTurnText[i].style.color = "#f7f8f7";
        } 
        
    }
    updateScoreHTML();
    getPlayerPieces();
    
}

getPlayerPieces()
