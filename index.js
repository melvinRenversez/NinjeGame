const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const GRAVITY = 0.5;



players = []

const ninja1 = new Ninja(
   position = { x: 100, y: 100 },
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
   direction = -1
);
players.push(ninja1);

const ninja2 = new Ninja(
   position = { x: 1000, y: 100 },
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
   direction = -1
);
players.push(ninja2);



function gameLoop() {

   ctx.fillStyle = 'black';
   ctx.clearRect(0, 0, canvas.width, canvas.height);

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

gameLoop();