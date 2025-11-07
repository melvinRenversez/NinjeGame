
class Ninja {
   constructor({ position, width, height, speed, jumpForce, inputs, maxJumps, direction, attackRange, callDownAttack, healthBar, health, attackDamage, sprites }) {
      this.position = position
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.jumpForce = jumpForce;
      this.velocity = {
         x: 0,
         y: 0
      };
      this.inputs = inputs;
      this.lastKey;
      this.maxJumps = maxJumps;
      this.jumps = maxJumps;
      this.direction = direction;
      this.attackRange = attackRange;
      this.attackBox = {
         x: 0,
         y: 0,
         width: this.attackRange,
         height: 50
      }
      this.callDownAttack = callDownAttack;
      this.enableAttack = true;
      this.health = health
      this.maxHealth = health
      this.healthBar = healthBar
      this.attackDamage = attackDamage
      this.currentLastAnimation = 'idle'
      this.currentAnimation = 'idle'
      this.isAttacking = false;
      this.isJumping = false;
      this.isMoving = false;
      this.isDead = false;
      this.sprites = sprites;
      this.sprite = new Sprite(
         {
            position: this.position,
            imageSrc: this.sprites[this.currentAnimation].src,
            scale: this.sprites[this.currentAnimation].scale,
            offset: this.sprites[this.currentAnimation].offset,
            framesMax: this.sprites[this.currentAnimation].framesMax,
            speed: this.sprites[this.currentAnimation].speed
         }
      );
      this.resetParams = {
         position: position,
         health: health
      }
   }

   checkLife() {
      if (this.health <= 0) {
         this.isDead = true;
         this.changeAnimation();
      }
   }

   changeAnimation() {

      if (this.isDead) {
         this.currentAnimation = 'death';
         if (this.currentAnimation !== this.currentLastAnimation) {
            this.currentLastAnimation = this.currentAnimation;
            this.sprite.setDeadAniamtion()
            this.sprite.change(
               {
                  imageSrc: this.sprites[this.currentAnimation].src,
                  scale: this.sprites[this.currentAnimation].scale,
                  offset: this.sprites[this.currentAnimation].offset,
                  framesMax: this.sprites[this.currentAnimation].framesMax,
                  speed: this.sprites[this.currentAnimation].speed,
                  direction: this.direction
               }
            )
         }
         return;

      } else {
         if (this.isAttacking) this.currentAnimation = 'attack';
         else if (this.isJumping) this.currentAnimation = 'jump';
         else if (this.velocity.y !== 0) this.currentAnimation = 'fall';
         else if (this.isMoving) this.currentAnimation = 'run';
         else this.currentAnimation = 'idle';



         if (this.currentAnimation === this.currentLastAnimation) {
            this.sprite.changeDirection(this.direction);
            return;
         };

         this.currentLastAnimation = this.currentAnimation;

         this.sprite.change(

            {
               imageSrc: this.sprites[this.currentAnimation].src,
               scale: this.sprites[this.currentAnimation].scale,
               offset: this.sprites[this.currentAnimation].offset,
               framesMax: this.sprites[this.currentAnimation].framesMax,
               speed: this.sprites[this.currentAnimation].speed,
               direction: this.direction
            }
         )
      }



   }

   takeDamage(damage) {
      this.health -= damage
      if (this.health <= 0) this.health = 0
   }

   checkDirection() {
      if (this.velocity.x > 0) {
         this.direction = 1
      } else if (this.velocity.x < 0) {
         this.direction = -1
      }


      this.changeAnimation()
   }

   update() {
      if (!this.isDead) {

         this.checkDirection();
         this.changeDirection();
         this.move();
         this.checkLife();
      }
      // this.draw();
      this.gravityEffect();
      this.drawHealthBar();

      this.sprite.draw();
   }

   drawHealthBar() {
      const pourcentage = this.health / this.maxHealth * 100
      this.healthBar.children[0].style.width = (100 - pourcentage) + "%"
      this.healthBar.children[1].innerHTML = this.health
   }

   changeDirection() {
      if (this.direction === 1) {
         this.attackBox.x = 0
      } else {
         this.attackBox.x = -this.attackRange + this.width

      }
   }

   // draw() {
   //    ctx.fillStyle = 'blue';
   //    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);


   //    // ---- Sprite ----
   //    this.sprite.draw();

   //    // ---- Attack Box ----
   //    // if (this.isAttacking) {
   //    ctx.fillStyle = 'rgba(255,0,0,0.5)';
   //    ctx.fillRect(
   //       this.position.x + this.attackBox.x,
   //       this.position.y,
   //       this.attackBox.width,
   //       this.attackBox.height
   //    );
   //    // }
   // }

   attack() {


      this.isAttacking = true;

      checkCollision(this)
      this.changeAnimation();

      setTimeout(() => {
         this.isAttacking = false;
         this.enableAttack = false;
         this.changeAnimation();
      }, 100);
      setTimeout(() => {
         this.enableAttack = true;
      }, this.callDownAttack * 1000);

   }

   move() {


      // ---- Déplacement horizontal ----
      if (this.inputs.left.status === 'pressed' && this.lastKey === this.inputs.left.key) {
         this.velocity.x = -1;
         this.changeAnimation();

      } else if (this.inputs.right.status === 'pressed' && this.lastKey === this.inputs.right.key) {
         this.velocity.x = 1;
         this.changeAnimation();
      } else {
         this.velocity.x = 0;
         this.isMoving = false;
         this.changeAnimation()
      }

      // ---- Collision left ----
      if (this.position.x + (this.velocity.x * this.speed) < 0) {
         this.position.x = 0;
         this.velocity.x = 0;
      }

      // ---- Collision right ----
      if (this.position.x + this.width + (this.velocity.x * this.speed) > canvas.width) {
         this.position.x = canvas.width - this.width;
         this.velocity.x = 0;
      }

      // ---- Application du déplacement horizontal ----
      this.position.x += this.velocity.x * this.speed;


      // ---- Collision avec le plafond ----
      if (this.position.y < 0) {
         this.position.y = 0;
         if (this.velocity.y < 0) {
            this.velocity.y *= -0.2;
         }
      }
   }

   gravityEffect() {
      // ---- Gravité ----
      this.velocity.y += GRAVITY;
      this.position.y += this.velocity.y;

      // ---- Collision avec le sol ----
      if (this.position.y + this.height >= GROUND_LEVEL) {
         this.position.y = GROUND_LEVEL - this.height;
         this.velocity.y = 0;
         this.jumps = 0; // reset les sauts
      }
   }


   input(key) {
      if (key.status === 'pressed') {
         switch (key.key) {
            case this.inputs.left.key:
               this.inputs.left.status = 'pressed';
               this.lastKey = this.inputs.left.key;
               this.isMoving = true;
               this.changeAnimation()
               break;
            case this.inputs.right.key:
               this.inputs.right.status = 'pressed';
               this.lastKey = this.inputs.right.key;
               this.isMoving = true;
               this.changeAnimation()
               break;
            case this.inputs.up.key:
               // ---- Jump ----
               if (this.jumps >= this.maxJumps) return;
               if (this.isDead) return;
               this.velocity.y = this.jumpForce * -1;
               this.jumps++;
               this.isJumping = true;
               this.changeAnimation()
               setTimeout(() => {
                  this.isJumping = false;
                  this.changeAnimation()
               }, 100)
               break;
            case this.inputs.attack.key:
               if (!this.enableAttack) return;
               if (this.isDead) return;
               this.attack()
               break;
         }
      } else if (key.status === 'released') {
         switch (key.key) {
            case this.inputs.left.key:
               this.inputs.left.status = 'released';
               if (this.inputs.right.status === 'pressed') {
                  this.lastKey = this.inputs.right.key;
               }
               break;
            case this.inputs.right.key:
               this.inputs.right.status = 'released';
               if (this.inputs.left.status === 'pressed') {
                  this.lastKey = this.inputs.left.key;
               }
               break;
         }
      }
   }


   log() {
      console.log("______________________________________________________________");
      console.log('health:', JSON.stringify(this.health, null, 2));
      console.log('isDead:', JSON.stringify(this.isDead, null, 2));
      console.log('position:', JSON.stringify(this.position, null, 2));
      console.log('velocity:', JSON.stringify(this.velocity, null, 2));
      console.log('enableAttack:', JSON.stringify(this.enableAttack, null, 2));
      console.log('sprite:', JSON.stringify(this.sprite, null, 2));


   }


   reset() {
      console.log('Resetting ninja...');
      this.position = this.resetParams.position;
      this.health = this.resetParams.health;
      this.isDead = false;
      this.sprite.reset();
      this.changeAnimation();
   }
}