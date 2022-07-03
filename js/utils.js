//looks for collision
// function rectangularCollision({rectangle1, rectangle2}){
//     // c.fillStyle = rectangle1.colour;
//     // c.fillRect(rectangle1.attackBox.position.x, rectangle1.attackBox.position.y, rectangle1.attackBox.width, rectangle1.attackBox.height)
//     // absolutely hate this collision
//     return(
//         // ((rectangle1.attackBox.position.x + rectangle1.attackBox.width <= rectangle2.position.x && rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x + rectangle2.width)
//         // || (rectangle2.position.x + rectangle2.width >= rectangle1.attackBox.position.x && rectangle2.position.x + rectangle2.width <= rectangle1.attackBox.position.x + rectangle1.attackBox.width))
//         // && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
//         // && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height

//         rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
//         && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
//         && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
//         && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
//     )
// }

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


function determineWinner({player,enemy, timerId}){
    clearTimeout(timerId);
    if(player.health == enemy.health){
        document.querySelector('#results').innerHTML = 'Tie';
    }
    else if(player.health >enemy.health){
        document.querySelector('#results').innerHTML = 'Player 1 Wins';
    }
    else if(enemy.health > player.health){
        document.querySelector('#results').innerHTML = 'Player 2 Wins';
    }

    document.querySelector('#results').style.display = 'flex';
}

let timer = 60;
let timerId
function decreaseTime(){
    timerId = setTimeout(decreaseTime, 1000)
    if(timer>0){
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    else{
       determineWinner({player, enemy, timerId})
    }

    
}
