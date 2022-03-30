const computerPlacements = [];
const computerAttacks = [];

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

    this.receiveAttack = function receiveAttack(location){
        for(let i = 0; i < this.ships.length; i++){
            if(this.ships[i].position.includes(location)){
                this.ships[i].hit(location);
                return "hit";
            }
        } return "miss"
    }

}

const playerBoard = new gameboard();
const computerBoard = new gameboard();

function gameplayLoop(input){
    if (playerBoard.ships.length < 5){
        playerBoard.placeShip(input);
        let computerInput = null;

        while(computerInput === null || computerPlacements.includes(computerInput)){
            computerInput = Math.round(Math.random() * (81 - 1));
        }

        computerPlacements.push(computerInput,computerInput+1,computerInput+2)

        computerBoard.placeShip(computerInput);

        return (`${playerBoard.ships.length}, ${computerBoard.ships.length}`)

    }else{
        computerBoard.receiveAttack(input);
        let computerInput = null;

        while(computerInput === null || computerAttacks.includes(computerInput)){
            computerInput = Math.round(Math.random() * (81 - 1));
        }

        computerAttacks.push(computerInput)

        playerBoard.placeShip(computerInput);

        
    }
}


module.exports = gameplayLoop;