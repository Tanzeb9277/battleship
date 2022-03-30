const playergrid = document.querySelector('#playerboard');
const computergrid = document.querySelector('#computerboard');
const header = document.querySelector("#header");
const outOfBounds = [6,7,13,14,20,21,27,28,34,35,41,42,48,49];
const playerPlacements = []
const computerPlacements = [];
const computerAttacks = [];
const playerAttacks = [];

function shipFactory(position){
    this.position = position;
    this.hits = [];
    this.hit = function hit(location){
        if(this.position.includes(location) && !this.hits.includes(location)){
            this.hits.push(location)
            

        }
    };
    this.isSunk = function isSunk(){
        if(this.hits.length == this.position.length){
            return "sunk";
        } return "Afloat"
    };
}


function gameboard(){
    this.ships = [];
    this.placeShip = function placeShip(position){
        for(let i = 0; i < this.ships.length; i++){
            if(this.ships[i].position.includes(position)){
                return;
            }
        }
        let positions =[position, position+1, position+2]
        const ship = new shipFactory(positions);
        this.ships.push(ship)

    }

    this.receiveAttack = function receiveAttack(attatcker, location, name){
        for(let i = 0; i < this.ships.length; i++){
            if(this.ships[i].position.includes(location)){
                this.ships[i].hit(location);
                document.getElementById(`${attatcker}${location}`).style = "background-color:red";
                return;
            }
        }
            document.getElementById(`${attatcker}${location}`).style = "background-color:rgba(135, 207, 235, 0.438)";
            return;
    }

}

function createPlayerBoard(){
    
    for(let i = 1; i <= 49; i++){
        let gridItem = document.createElement('div');
        gridItem.classList.add('gridItem');
        gridItem.setAttribute('id', `playerboard${i}`)
        gridItem.setAttribute('data-num', `${i}`)
    if(!outOfBounds.includes(i)){
        
        gridItem.addEventListener('click', place); 
        function place(e){
            let num = parseInt(e.target.getAttribute("data-num"))
            gameplayLoop(num)
            
        }

    }

        playergrid.appendChild(gridItem);
        
    }

    let itemNum = document.querySelectorAll('.gridItem');
    console.log(itemNum.length)
}
function attack(e){
    let num = parseInt(e.target.getAttribute("data-num"))
    gameplayLoop(num)
    
}

function createComputerBoard(){
    
    for(let i = 1; i <= 49; i++){
        let gridItem = document.createElement('div');
        gridItem.classList.add('gridItem');
        gridItem.classList.add('computerItems');
        gridItem.setAttribute('id', `computerboard${i}`)
        gridItem.setAttribute('data-num', `${i}`)
        gridItem.addEventListener('click', attack);
      

        computergrid.appendChild(gridItem);
        
    }

    let itemNum = document.querySelectorAll('.gridItem');
    console.log(itemNum.length)
}

function endGame(){
    let items = document.querySelectorAll(".computerItems");
    for(let i = 0; i < items.length; i++){
        items[i].removeEventListener('click', attack);
    }
}


createPlayerBoard();
createComputerBoard();

const playerBoard = new gameboard();
const computerBoard = new gameboard();



function gameplayLoop(input){
    if (playerBoard.ships.length < 5){
        if (!playerPlacements.includes(input) && !playerPlacements.includes(input+1) && !playerPlacements.includes(input+2)){
            playerBoard.placeShip(input);
            playerPlacements.push(input , input+1, input+3);
            document.getElementById(`playerboard${input}`).style = "background-color:black";
            document.getElementById(`playerboard${input+1}`).style = "background-color:black";
            document.getElementById(`playerboard${input+2}`).style = "background-color:black";

        }
        let computerInput = null;

        while(computerInput === null || computerPlacements.includes(computerInput) || computerPlacements.includes(computerInput+1) || computerPlacements.includes(computerInput+2) || outOfBounds.includes(computerInput)){
            computerInput = Math.round(Math.random() * (49 - 1));
        }

        computerPlacements.push(computerInput,computerInput+1,computerInput+2)

        computerBoard.placeShip(computerInput);

        if(playerBoard.ships.length == 5){
            header.innerHTML= "Select location to Attack";
        }

    }else{
        if(playerAttacks.includes(input)){
            return;
        }else{
        playerAttacks.push(input)
        computerBoard.receiveAttack("computerboard", input , "Player");
        let computerInput = null;

        while(computerInput === null || computerAttacks.includes(computerInput)){
            computerInput = Math.round(Math.random() * (49 - 1));
        }

        computerAttacks.push(computerInput)

        playerBoard.receiveAttack("playerboard", computerInput, "Computer");

        checkWin();

    }

        
    }
}

function checkWin(){
    console.log("checking...")
    let playerShips = 0;
    let computerShips = 0;
    for(let i = 0; i < playerBoard.ships.length; i++){
        
        if(playerBoard.ships[i].isSunk() == "sunk"){
            playerShips++;
            console.log(playerShips)
            
        }
        if(playerShips == 5){
            alert("Computer wins");
            header.innerHTML= "Game Over";
            endGame();
            return;
        }
    }
    for(let i = 0; i < computerBoard.ships.length; i++){
        
        if(computerBoard.ships[i].isSunk() == "sunk"){
            computerShips++;
            console.log(computerShips)
        }
        if(computerShips == 5){
            alert("Player wins");
            header.innerHTML= "Game Over";
            endGame();
            return;
        }
    }
}


module.exports = gameplayLoop;