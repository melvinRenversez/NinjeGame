
class Ninja {
   constructor(position, width, height, speed, jumpForce, inputs, maxJumps, direction, attackRange, callDownAttack, healthBar, health, attackDamage) {
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
      this.isAttacking = false;
      this.enableAttack = true;

      this.health = health
      this.maxHealth = health
      this.healthBar = healthBar

      this.attackDamage = attackDamage


   }

   takeDamage(damage) {
      this.health -= damage
      if (this.health <= 0) this.health = 0
   }

   update() {
      this.changeDirection();
      this.move();
      this.draw();
      this.drawHealthBar();
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

   draw() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);


      // ---- Attack Box ----
      if (this.isAttacking) {
         ctx.fillStyle = 'red';
         ctx.fillRect(
            this.position.x + this.attackBox.x,
            this.position.y + this.attackBox.y,
            this.attackBox.width,
            this.attackBox.height
         );
      }
   }

   attack() {


      this.isAttacking = true;

      checkCollision(this)

      setTimeout(() => {
         this.isAttacking = false;
         this.enableAttack = false;
      }, 100);
      setTimeout(() => {
         this.enableAttack = true;
      }, this.callDownAttack * 1000);

   }

   move() {

      // ---- Déplacement horizontal ----
      if (this.inputs.left.status === 'pressed' && this.lastKey === this.inputs.left.key) {
         this.velocity.x = -1;
         this.direction = -1;
      } else if (this.inputs.right.status === 'pressed' && this.lastKey === this.inputs.right.key) {
         this.velocity.x = 1;
         this.direction = 1;
      } else {
         this.velocity.x = 0;
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

      // ---- Gravité ----
      this.velocity.y += GRAVITY;
      this.position.y += this.velocity.y;

      // ---- Collision avec le sol ----
      if (this.position.y + this.height >= canvas.height) {
         this.position.y = canvas.height - this.height;
         this.velocity.y = 0;
         this.jumps = 0; // reset les sauts
      }

      // ---- Collision avec le plafond ----
      if (this.position.y < 0) {
         this.position.y = 0;
         if (this.velocity.y < 0) {
            this.velocity.y *= -0.2;
         }
      }
   }


   input(key) {
      if (key.status === 'pressed') {
         switch (key.key) {
            case this.inputs.left.key:
               this.inputs.left.status = 'pressed';
               this.lastKey = this.inputs.left.key;
               break;
            case this.inputs.right.key:
               this.inputs.right.status = 'pressed';
               this.lastKey = this.inputs.right.key;
               break;
            case this.inputs.up.key:
               if (this.jumps >= this.maxJumps) return;
               this.velocity.y = this.jumpForce * -1;
               this.jumps++;
               break;
            case this.inputs.attack.key:
               if (!this.enableAttack) return;
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
}