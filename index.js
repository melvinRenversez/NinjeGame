const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const player1HealthBar = document.getElementById("player1healthBar");
const player2HealthBar = document.getElementById("player2healthBar");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const GRAVITY = 0.5;

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height



players = []

const ninja1 = new Ninja(
   position = { x: 500, y: 100 },
   width = 50,
   height = 150,
   speed = 12,
   jumpForce = 20,
   inputs = {
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
   maxJumps = 5,
   direction = 1,
   attackRange = 100,
   callDownAttack = 1,
   healthBar = player1HealthBar,
   health = 100,
   attackDamage = 12,
);
players.push(ninja1);

const ninja2 = new Ninja(
   position = { x: 160, y: 100 },
   width = 50,
   height = 150,
   speed = 12,
   jumpForce = 20,
   inputs = {
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
         key: 'ArrowDown',
         status: 'released'
      }
   },
   maxJumps = 5,
   direction = -1,
   attackRange = 150,
   callDownAttack = 2,
   healthBar = player2HealthBar,
   health = 158,
   attackDamage = 9
);
players.push(ninja2);


const Sprites = []



const background = new Sprite(
   position={
      x: 0,
      y: 0
   },
   imageSrc = "./assets/background/background.png",
   scale = 1.6,
   offset = {
      x: 0, 
      y: 0
   }
)

const shop = new Sprite(
   position= {
      x: 1000,
      y: 650
   },
   imageSrc = "./assets/decorations/shop.png",
   scale = 1
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

   requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
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


function checkCollision(attacker){

   console.log(attacker)


    players.forEach((player) => {
      if (player !== attacker){
         console.log(player)
      
         if (
            attacker.position.x + attacker.attackBox.x <= player.position.x + player.width &&
            attacker.position.x + attacker.attackBox.x + attacker.attackBox.width >= player.position.x &&
            attacker.position.y + attacker.attackBox.height >= player.position.y &&
            attacker.position.y + attacker.attackBox.height <= player.position.y + player.height
         ){
            console.log("dega");
            player.takeDamage(attacker.attackDamage)
         }

      
      }
   });

}

gameLoop();