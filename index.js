const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const player1HealthBar = document.getElementById("player1healthBar");
const player2HealthBar = document.getElementById("player2healthBar");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const GRAVITY = 0.5;

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height

const GROUND_LEVEL = CANVAS_HEIGHT - 122;



players = []

const ninja1 = new Ninja(
   {
      position: { x: 60, y: 100 },
      width: 50,
      height: 150,
      speed: 12,
      jumpForce: 20,
      inputs: {
         left: {
            key: 'q',
            status: 'released'
         },
         right: {
            key: 'd',
            status: 'released'
         },
         up: {
            key: 'z',
            status: 'released'
         },
         attack: {
            key: ' ',
            status: 'released'
         }
      },
      maxJumps: 5,
      direction: 1,
      attackRange: 250,
      callDownAttack: 1,
      healthBar: player1HealthBar,
      health: 20,
      attackDamage: 48,
      sprites: {
         idle: {
            src: "./assets/Musashi/Idle.png",
            framesMax: 8,
            scale: 2.5,
            offset: { x: 226, y: 155 },
            speed: 4
         },
         run: {
            src: "./assets/Musashi/Run.png",
            framesMax: 8,
            scale: 2.5,
            offset: { x: 226, y: 155 },
            speed: 2
         },
         jump: {
            src: "./assets/Musashi/Jump.png",
            framesMax: 2,
            scale: 2.5,
            offset: { x: 226, y: 155 },
            speed: 2
         },
         fall: {
            src: "./assets/Musashi/Fall.png",
            framesMax: 2,
            scale: 2.5,
            offset: { x: 226, y: 150 },
            speed: 8
         },
         attack: {
            src: "./assets/Musashi/Attack1.png",
            framesMax: 6,
            scale: 2.5,
            offset: { x: 225, y: 155 },
            speed: 0.9
         },
         death: {
            src: "./assets/Musashi/Death.png",
            framesMax: 6,
            scale: 2.5,
            offset: { x: 225, y: 155 },
            speed: 10
         }
      }
   }
);
players.push(ninja1);

const ninja2 = new Ninja(
   {
      position: { x: 1800, y: 100 },
      width: 50,
      height: 150,
      speed: 12,
      jumpForce: 20,
      inputs: {
         left: {
            key: 'ArrowLeft',
            status: 'released'
         },
         right: {
            key: 'ArrowRight',
            status: 'released'
         },
         up: {
            key: 'ArrowUp',
            status: 'released'
         },
         attack: {
            key: 'Enter',
            status: 'released'
         }
      },
      maxJumps: 5,
      direction: -1,
      attackRange: 250,
      callDownAttack: 1,
      healthBar: player2HealthBar,
      health: 10,
      attackDamage: 48,
      sprites: {
         idle: {
            src: "./assets/Yoshitsune/Idle.png",
            framesMax: 4,
            scale: 2.5,
            offset: { x: 226, y: 175 },
            speed: 4
         },
         run: {
            src: "./assets/Yoshitsune/Run.png",
            framesMax: 8,
            scale: 2.5,
            offset: { x: 226, y: 155 },
            speed: 2
         },
         jump: {
            src: "./assets/Yoshitsune/Jump.png",
            framesMax: 2,
            scale: 2.5,
            offset: { x: 226, y: 155 },
            speed: 2
         },
         fall: {
            src: "./assets/Yoshitsune/Fall.png",
            framesMax: 2,
            scale: 2.5,
            offset: { x: 220, y: 180 },
            speed: 8
         },
         attack: {
            src: "./assets/Yoshitsune/Attack1.png",
            framesMax: 4,
            scale: 2.5,
            offset: { x: 225, y: 155 },
            speed: 0.9
         },
         death: {
            src: "./assets/Yoshitsune/Death.png",
            framesMax: 7,
            scale: 2.5,
            offset: { x: 225, y: 170 },
            speed: 10
         }
      }
   }
);
players.push(ninja2);


const Sprites = []



const background = new Sprite(
   {
      position: {
         x: 0,
         y: 0
      },
      imageSrc: "./assets/background/background.png",
      scale: 1.89,
      offset: {
         x: 0,
         y: 0
      },
      speed: 2
   }
)

const shop = new Sprite(
   {
      position: {
         x: 1000,
         y: 650
      },
      imageSrc: "./assets/decorations/shop.png",
      scale: 1
   }
)



Sprites.push(background)
// Sprites.push(shop)





function gameLoop() {

   ctx.fillStyle = 'black';
   ctx.clearRect(0, 0, canvas.width, canvas.height);


   Sprites.forEach((sprite) => {
      sprite.update()
   })

   players.forEach((player) => {
      player.update();
   });

   // ninja2.log();

   requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
   // console.log(event.key)
   players.forEach((player) => {
      player.input({
         status: 'pressed',
         key: event.key
      });
   });
});

window.addEventListener('keyup', (event) => {
   players.forEach((player) => {
      player.input({
         status: 'released',
         key: event.key
      });
   });
});


function checkCollision(attacker) {

   players.forEach((player) => {
      if (player !== attacker) {

         if (
            attacker.position.x + attacker.attackBox.x <= player.position.x + player.width &&
            attacker.position.x + attacker.attackBox.x + attacker.attackBox.width >= player.position.x &&
            attacker.position.y + attacker.attackBox.height >= player.position.y &&
            attacker.position.y + attacker.attackBox.height <= player.position.y + player.height
         ) {
            player.takeDamage(attacker.attackDamage)
            console.log('hit')
         }


      }
   });

}

gameLoop();

function resetGame(btn){
   btn.blur();
   players.forEach((player) => {
      player.reset()
   });
}