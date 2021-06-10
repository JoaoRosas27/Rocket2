let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
  }
let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// changed the theme and added a timer. 
// Tried to change the title but for some reason it doesn't update even though its coded to Target Practice

// point breakdown
// Tracks high score - 5
// Implemented new background - 5
// Display time remaining - 10
// Create new animated sprite for the spaceship - 10
// Create new art for all of the in game assests - 20
// Redesign the game - 60
