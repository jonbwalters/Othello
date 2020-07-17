/*----------- Game State Data ----------*/

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
    } 
    else {
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
        player.colorId = 0;   //0 for white
    }
    else{
        player.colorId = 1;   //1 for black
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
    for(i=0; i<possiblePlaces.length; i++)
    {
        possiblePlaces[i].remove();
        //possiblePlaces[i].HTML = '<td></td>';
    }
    possiblePlaces = document.querySelector("p")
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
        while(j>=2 && board[row][j-1]!= 0 && board[row][j-1]%2 != player.colorId)
        {
            // check to see if next spot to the left is open or not    
            if ( board[row][j-2] == 0)
            {
                player.possiblemoves[row][j-2] = 1;
                cells[row*8+j-2].innerHTML = `<p class="validMoveHere" ></p>`;
                break
                
            }
            else
            {
                j--;
            } 
        }

        //Next Check Right
        j = col;
        while(j<6 && board[row][j+1]!=0 && board[row][j+1]%2 != player.colorId)
        {
            // check to see if spot two to the left piece is open or not    
            if ( board[row][j+2] == 0)
            {
                player.possiblemoves[row][j+2] = 1;
                cells[row*8+j+2].innerHTML = `<p class="validMoveHere" ></p>`;
                break
                
            }
            else
            {
                j++;
            } 
        }

        //check upwards 
        k = row;
        while( k>=2 && board[k-1][col]!=0 && board[k-1][col]%2 != player.colorId)
        {
            
            // check to see if spot two up is open or not   
            if ( board[k-2][col] == 0)
            {
                player.possiblemoves[k-2][col] = 1;
                cells[(k-2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
                break
                
            }
            else
            {
                k--;
            }  
        }

        // check downards
        k = row;
        while(k<6 && board[k+1][col] !=0 && board[k+1][col]%2 != player.colorId )
        {
            
            // check to see if spot two down is open or not   
            if ( board[k+2][col] == 0)
            {
                player.possiblemoves[k+2][col] = 1;
                cells[(k+2)*8+col].innerHTML = `<p class="validMoveHere" ></p>`;
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
        while(k>=2 && j >= 2 && board[k-1][j-1]!=0 && board[k-1][j-1]%2 != player.colorId)
        {
            
            // check to see if spot two northwest is open or not   
            if ( board[k-2][j-2] == 0)
            {
                player.possiblemoves[k-2][j-2] = 1;
                cells[(k-2)*8+(j-2)].innerHTML = `<p class="validMoveHere" ></p>`;
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
        while( k>=2 && j < 6 && board[k-1][j+1]!=0 && board[k-1][j+1]%2 != player.colorId)
        {
            
            // check to see if spot two northwest is open or not   
            if ( board[k-2][j+2] == 0)
            {
                player.possiblemoves[k-2][j+2] = 1;
                cells[(k-2)*8+(j+2)].innerHTML = `<p class="validMoveHere" ></p>`;
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
        while(k<6 && j < 6 && board[k+1][j+1]!=0 && board[k+1][j+1]%2 != player.colorId )
        {
            
            // check to see if spot two northwest is open or not   
            if ( board[k+2][j+2] == 0)
            {
                player.possiblemoves[k+2][j+2] = 1;
                cells[(k+2)*8+(j+2)].innerHTML = `<p class="validMoveHere" ></p>`;
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
        while(k<6 && j >= 2 && board[k+1][j-1]!=0 && board[k+1][j-1]%2 != player.colorId )
        {
            
            // check to see if spot two northwest is open or not   
            if ( board[k+2][j-2] == 0)
            {
                player.possiblemoves[k+2][j-2] = 1;
                cells[(k+2)*8+(j-2)].innerHTML = `<p class="validMoveHere" ></p>`;
                break
                
            }
            else
            {
                k++;
                j--;
            }    

        }

    }
    possiblePlaces = document.querySelectorAll("p")
            
}

// testing placement of pieces onto the board
function placePiece(row, col){
    //start and end are arrays with the starting and ending indices of the pieces boxing in those to be changed
    if(turn)
    {    
        cells[row*8+col].innerHTML = '<w class="white-piece" id="'+nextwhitePieceId+'"></w>';
        //console.log("THIS IS CELL:" + cells[row*8+col])
        whitesPieces = document.querySelectorAll("w");
        board[row][col] = nextwhitePieceId;
        nextwhitePieceId+=2;
        replaceMiddlePieces(row,col)
        changePlayer();
        
    }
    else{
        cells[row*8+col].innerHTML = '<b class="black-piece" id="'+nextblackPieceId+'"></b>';
        blacksPieces = document.querySelectorAll("b");
        board[row][col] = nextblackPieceId;
        nextblackPieceId+=2;
        replaceMiddlePieces(row,col)
        changePlayer();
    } 

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

//Checks for a win
function checkForWin() {
    if( (blacksPieces.length+whitesPieces.length) == 64 || possiblePlaces.length == 0)
    {
        if (blacksPieces.length > whitesPieces.length)
        {
            divider.style.display = "none";
            for (let i = 0; i < blackTurntext.length; i++) {            
                blackTurntext[i].style.color = "black";
                whiteTurnText[i].style.display = "none";
                blackTurntext[i].textContent = "BLACK WINS!";
            }

        }
        else if(blacksPieces.length < whitesPieces.length)
        {
            divider.style.display = "none";
            for (let i = 0; i < blackTurntext.length; i++) {            
                whiteTurnText[i].style.color = "black";
            blackTurntext[i].style.display = "none";
            whiteTurnText[i].textContent = "White WINS!";
            }
        }

    }
    
}

 //Switches player's turn
function changePlayer() {
    if (turn) {
        turn = false;
        resetPlayerPossibleMoves(); 
        for (let i = 0; i < whiteTurnText.length; i++) {
            whiteTurnText[i].style.color = "lightGrey";
            blackTurntext[i].style.color = "black";
        }
        checkForWin();

        
    } else {
        turn = true;
        resetPlayerPossibleMoves();
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "lightGrey";
            whiteTurnText[i].style.color = "black";
        } 
        checkForWin();
    }
    getPlayerPieces();
    
}

getPlayerPieces();
