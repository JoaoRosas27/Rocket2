class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('gunner', './assets/gunner.png');
        this.load.image('target', './assets/Target.png');
        this.load.image('grass', './assets/grass.png');

        // load spritesheet
        this.load.spritesheet('explosionT2', './assets/explosionT2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }
    create() {
        // place tile sprite
        this.grass = this.add.tileSprite(0, 0, 640, 480, 'grass').setOrigin(0, 0);
        //this.add.text(20, 20, "gunner Patrol Play");
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x000000).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);

          // add gunner (p1)
          this.p1gunner = new gunner(this, game.config.width/2, game.config.height - borderUISize, 'gunner').setOrigin(0.5, 0);

          // add targets (x3)
        this.target01 = new target(this, game.config.width + borderUISize*6, borderUISize*4, 'target', 0, 30).setOrigin(0, 0);
        this.target02 = new target(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'target', 0, 20).setOrigin(0,0);
        this.target03 = new target(this, game.config.width, borderUISize*6 + borderPadding*4, 'target', 0, 10).setOrigin(0,0);

        // define keys
         keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
         keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
         keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
         keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

       // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosionT2', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
          // display score
         let scoreConfig = {
         fontFamily: 'Courier',
         fontSize: '28px',
         backgroundColor: '#F3B141',
         color: '#843605',
         align: 'right',
         padding: {
         top: 5,
          bottom: 5,
         },
         fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
     
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall( game.settings.gameTimer, () => {
          this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
          this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
          this.gameOver = true;
        }, null, this);

         this.timeLeft = this.add.text(borderUISize + borderPadding + 370, borderUISize + borderPadding*2, 'Time Remaining: ', scoreConfig);
         this.timeVariable = 0;
       }
      update(time,delta) {
          // check key input for restart
         if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
             this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.grass.tilePositionX -= 4;
        // displays the time left
        for (let index = 0; index < 55; index++) {
           // this.timeVariable = this.timeVariable+1;
            this.timeLeft.setText("Time: "+ Math.round(this.timeVariable*.001));
        }
        

        if (!this.gameOver) {               
            this.p1gunner.update();         // update gunner sprite
            this.target01.update();           // update targets (x3)
            this.target02.update();
            this.target03.update();
            this.timeVariable = this.timeVariable + delta;
        } 

        // check collisions
        if(this.checkCollision(this.p1gunner, this.target03)) {
            this.p1gunner.reset();
            this.targetExplode(this.target03);   
        }
        if (this.checkCollision(this.p1gunner, this.target02)) {
              this.p1gunner.reset();
             this.targetExplode(this.target02);
         }
         if (this.checkCollision(this.p1gunner, this.target01)) {
          this.p1gunner.reset();
             this.targetExplode(this.target01);
         }
  }
      
      checkCollision(gunner, target) {
        // simple AABB checking
        if (gunner.x < target.x + target.width && 
            gunner.x + gunner.width > target.x && 
            gunner.y < target.y + target.height &&
            gunner.height + gunner.y > target. y) {
                return true;
        } else {
            return false;
        }
    }
    targetExplode(target) {
        // temporarily hide target
        target.alpha = 0;
        // create explosion sprite at target's position
        let boom = this.add.sprite(target.x, target.y, 'explosionT2').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          target.reset();                         // reset target position
          target.alpha = 1;                       // make target visible again
          boom.destroy();                       // remove explosion sprite
        });   
         // score add and repaint
         this.p1Score += target.points;
         this.scoreLeft.text = this.p1Score;     
         this.sound.play('sfx_explosion'); 
    }
}