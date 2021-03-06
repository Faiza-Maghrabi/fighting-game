//build the canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0,0,canvas.width,canvas.height);

//gravity
const gravity = 0.7;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: "Assets/background.png"
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 150
    },
    imageSrc: "Assets/shop.png",
    scale: 2.6,
    frames: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }, 
    colour: 'pink',
    imageSrc: "Assets/samuraiMack/idle.png",
    scale: 2.5,
    frames: 8,
    offset:{
        x: 215,
        y: 157
    },
    sprites:{
        idle : {
            imageSrc: "Assets/samuraiMack/Idle.png",
            framesMax: 8
        },
        run : {
            imageSrc: "Assets/samuraiMack/Run.png",
            framesMax: 8
        },
        jump : {
            imageSrc: "Assets/samuraiMack/Jump.png",
            framesMax: 2
        },
        fall : {
            imageSrc: "Assets/samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1 : {
            imageSrc: "Assets/samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit : {
            imageSrc: "Assets/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4
        },
        death : {
            imageSrc: "Assets/samuraiMack/Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: { 
          x: 100,
          y: 50
        },
        width: 160,
        height: 50
      }
});

const enemy = new Fighter({
    position: {
        x:400,
        y:100
    },
    velocity: {
        x: 0,
        y: 10
    },
    colour: 'lightblue',
    imageSrc: "Assets/kenji/idle.png",
    scale: 2.5,
    frames: 4,
    offset:{
        x: 215,
        y: 167
    },
    sprites:{
        idle : {
            imageSrc: "Assets/kenji/Idle.png",
            framesMax: 4
        },
        run : {
            imageSrc: "Assets/kenji/Run.png",
            framesMax: 8
        },
        jump : {
            imageSrc: "Assets/kenji/Jump.png",
            framesMax: 2
        },
        fall : {
            imageSrc: "Assets/kenji/Fall.png",
            framesMax: 2
        },
        attack1 : {
            imageSrc: "Assets/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit : {
            imageSrc: "Assets/kenji/Take hit.png",
            framesMax: 3
        },
        death : {
            imageSrc: "Assets/kenji/Death.png",
            framesMax: 7
        }
    },
    attackBox:{
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    }
}

//animation loop
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement and sprite switching
    if (keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if (keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else{   //idle
        player.switchSprite('idle');
    }

    //jumping and not jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0){
        player.switchSprite('fall');
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    //jumping and not jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    //detect collision & enemy gets hit
    //if attack box hits enemy then collison
    if (rectangularCollision({
        rectangle1: player, 
        rectangle2: enemy
    }) 
    && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false;
        gsap.to('#enemy-health',{
            width: enemy.health + '%'
        })
    }
    //if player misses
    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }

    //enemy version
    if (rectangularCollision({
        rectangle1: enemy, 
        rectangle2: player
    }) 
    && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#player-health',{
            width: player.health + '%'
        })
    }
    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy, timerId});
    }
}

animate();
decreaseTime();

//event listeners

window.addEventListener('keydown', (event) => {
    if (!player.dead){
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -20
                break;
            case ' ':
                player.isAttacking = true;
                break;
        }
    }
    if (!enemy.dead){
        switch (event.key){
            //enemy keys
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break;
            case 'ArrowDown':
                enemy.isAttacking = true;
            
        }
    }
});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})