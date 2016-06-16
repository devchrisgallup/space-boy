"use strict"; 
var game = new Phaser.Game(800, 600, Phaser.AUTO, "spaceBoy", { preload: preload, create: create, update: update });

function preload() {
    game.load.audio("chiptunes", 'assets/chiptunes.mp3');
    game.load.audio("coin", "assets/coin.wav");
    game.load.image("background", "assets/background.jpg");
    game.load.image("cube", "assets/ct.png");
    game.load.image("ledge", "assets/ground.jpg");
    game.load.image("smledge", "assets/smledge.png");
    game.load.image("smledgeblue", "assets/smledgeblue.png");
    game.load.image("box", "assets/box.png");
    game.load.image("extrabox", "assets/extrabox.png");
    game.load.image("ship", "assets/ship.png");
    game.load.spritesheet('sewerboy', 'assets/sewerboy.png', 38.57, 137);
    game.load.spritesheet('badman', 'assets/badman.png', 38.57, 137);
} // end function

// global variables 
var backgroundscroll;
var player;
var badman; 
var spacebar; 
var smledgeBadman;
var enemy; 
var cursors; 
var style; 
var platforms;
var spaceBar;
var smledge; 
var smledgeblue;
var box;
var boxMid;
var extrabox;
var cube;  
var score = 0;   
var lives = 3; 
var scoreText;
var livesText;  
var retryText; 
var ship;
var badmanFlag1 = false; 
var music; 
var coin; 

function create()  {
    // start physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // set world bounds

    game.world.setBounds(0,0,5000,600);
    // game music
    music = game.add.audio("chiptunes");
    coin = game.add.audio("coin"); 
    // set music to true for looping
    music.play('', 0, 1, true);

    // create background for game
    backgroundscroll = game.add.tileSprite(0,0,5000,600,"background");
    // create score text
    scoreText = game.add.text(15,10,"Score: ", {font: '32px Arial', fill:  '#fff'});
    scoreText.fixedToCamera = true;
    // create lives text
    livesText = game.add.text(200,10,"Lives: ", {font: '32px Arial', fill:  '#fff'});
    livesText.fixedToCamera = true;
    // create platforms group
    platforms = game.add.group();
    platforms.enableBody = true;
    // create ground
    var ground = platforms.create(0,500,"ledge");
    // this stops it from falling when you jump on it
    ground.body.immovable = true;

    // create small ledges through out the level
    smledgeBadman = platforms.create(300, 400, "smledge");
    smledgeBadman.body.immovable = true;
    smledgeblue = platforms.create(600, 340, "smledgeblue");
    smledgeblue.body.immovable = true;  
    smledge = platforms.create(800, 400, "smledge");
    smledge.body.immovable = true;
    smledge = platforms.create(1880, 410, "smledge");
    smledge.body.immovable = true;
    smledgeblue = platforms.create(2050, 310, "smledgeblue");
    smledgeblue.body.immovable = true; 
    smledge = platforms.create(2200, 210, "smledge");
    smledge.body.immovable = true;
    smledge = platforms.create(2400, 210, "smledge");
    smledge.body.immovable = true;
    smledge = platforms.create(2600, 210, "smledge");
    smledge.body.immovable = true;

    smledge = platforms.create(2880, 330, "smledge");
    smledge.body.immovable = true;
    smledge = platforms.create(3100, 410, "smledge");
    smledge.body.immovable = true;
    smledgeblue = platforms.create(3300, 310, "smledgeblue");
    smledgeblue.body.immovable = true; 
    smledge = platforms.create(3500, 210, "smledge");
    smledge.body.immovable = true; 
    smledge = platforms.create(3800, 200, "smledge");
    smledge.body.immovable = true;


    smledgeblue.body.immovable = true;  
    smledge = platforms.create(4100, 400, "smledge");
    smledge.body.immovable = true;
    smledge = platforms.create(4400, 410, "smledge");
    smledge.body.immovable = true;
    smledgeblue = platforms.create(4600, 310, "smledgeblue");
    smledgeblue.body.immovable = true; 
    smledge = platforms.create(4900, 210, "smledge");
    smledge.body.immovable = true;

    // create extrabox 
    extrabox = game.add.group();
    extrabox = extrabox.create(2085, 410, "extrabox"); 
    game.physics.enable(extrabox,Phaser.Physics.ARCADE);
    extrabox.physicsBodyType = Phaser.Physics.ARCADE;
    extrabox.enableBody = true;

    // create spacebar function
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // create boxes group
    box = game.add.group(); 
    box.enableBody = true; 
    // enable Physics
    game.physics.enable(box,Phaser.Physics.ARCADE);
    box.physicsBodyType = Phaser.Physics.ARCADE;

    boxMid = game.add.group(); 
    boxMid.enableBody = true; 

    // enable Physics
    game.physics.enable(boxMid,Phaser.Physics.ARCADE);
    boxMid.physicsBodyType = Phaser.Physics.ARCADE;

    cube = game.add.group(); 
    cube = cube.create(4930, 30, "cube"); 
    cube.enableBody = true; 

    // enable Physics
    game.physics.enable(cube,Phaser.Physics.ARCADE);
    cube.physicsBodyType = Phaser.Physics.ARCADE;

    // function call to createBoxes
    createBoxes();
    createBoxesMiddle(); 

    // create ship
    ship = game.add.sprite(10, 50,"ship");
    ship.enableBody = true; 
    game.physics.enable(ship,Phaser.Physics.ARCADE);
    ship.physicsBodyType = Phaser.Physics.ARCADE;

    // create player
    player = game.add.sprite(15,game.world.height - 280, "sewerboy");
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;

    // create badman
    badman = game.add.sprite(400,game.world.height - 280, "badman");
    game.physics.arcade.enable(badman);
    badman.anchor.setTo(0.5, 0.5);
    game.camera.follow(badman);
    badman.body.bounce.y = 0.2;
    badman.body.gravity.y = 200;
    badman.body.collideWorldBounds = true;

    // enable phsics on sprite objects
    game.physics.arcade.enable(player);

    // animation for the player sprite
    player.animations.add('left', [1, 2, 3, 4], 12, true);
    player.animations.add('right', [6, 7, 8, 9], 12, true);

    badman.animations.add('left', [1, 2, 3, 4], 7, true);
    badman.animations.add('right', [6, 7, 8, 9], 7, true);

    // create controlls
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    style = 'STYLE_PLATFORMER';
    cursors = game.input.keyboard.createCursorKeys();
} // end function 

function update() {
    // Collision handling
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(badman, platforms);
    // game.physics.arcade.overlap(player,badman,collisionHandlerBadman,null,this);
    game.physics.arcade.overlap(player,box,collisionHandlerBox,null,this);
    game.physics.arcade.overlap(player,cube,collisionHandlerCube,null,this);
    game.physics.arcade.overlap(ship,cube,collisionHandlerCubeShip,null,this);
    game.physics.arcade.overlap(player,boxMid,collisionHandlerBox,null,this);
    game.physics.arcade.overlap(player,extrabox,collisionHandlerExtrabox,null,this);
    game.physics.arcade.overlap(player,ship,collisionHandlerShip,null,this);

    ship.body.velocity.x += 0.09;
    // reset player 
    player.body.velocity.x = 0;
    // keyboard controll for left key movement
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        // if score is greater than zero 
        // give the player some boost
        if (cursors.up.isDown && score > 0) {
            score--;
            player.body.velocity.x = -250;
            player.animations.play('left');
        }
        player.animations.play('left');
    }  else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        // if score is greater than zero 
        // give a player some boost
        if (cursors.up.isDown && score > 0) {
            score--;
            player.body.velocity.x = 250;
            player.animations.play('right');
        }
        player.animations.play('right');
    } else {
        // This allows the player sprite to keep his last frame
        player.animations.stop();
    }  
    //  Allow the player to jump if they are touching the ground.
    if (spacebar.isDown && player.body.touching.down) {
        player.body.velocity.y = -200;
    }
    // check x postion of badman
    // and a flag
    // enables badman to stay on platform
    if (badman.x > smledgeBadman.x && badmanFlag1 === false) {
        badman.body.velocity.x = -20;
        badman.animations.play("left");
    } else if (badman.x < 430) {
        badman.body.velocity.x = 20;
        badman.animations.play("right");
        badmanFlag1 = true;
    } else {
        badmanFlag1 = false;
    }
    // update score text
    scoreText.text = "Score: " + score;
    livesText.text = "Lives: " + lives;

 
} // end function 

function createBoxes() {
    for(var y = 0; y < 3; y++) {
        for(var x = 0; x < 10; x++) {
            var boxes = box.create(x*48,y*50,'box');
        }
    }
    box.x = 1050; 
    box.y = 288; 
} // end function 

function createBoxesMiddle() {
    for(var y = 0; y < 3; y++) {
        for(var x = 0; x < 10; x++) {
            var boxes = boxMid.create(x*48,y*50,'box');
        }
    }
    boxMid.x = 2350; 
    boxMid.y = 288; 
} // end function 

function collisionHandlerBadman(player, badman) {
    player.kill();
    score = score - 200;
    collisionText();
} // end function

function collisionHandlerBox(player, box) {
    box.kill();
    score = score + 20; 
    coin.play('', 0, 1, false);
} // end function 

function collisionHandlerCube(player, cube) {
    ship.kill();
    cube.kill(); 
    coin.play('', 0, 1, false);
    retryText = game.add.text(300,280,"Ouch!", {font: '64px Arial', fill:  '#fff'});
    // get location of currnt camera postion
    retryText.fixedToCamera = true;
    retryText.text = "You Win!";
} // end function

function collisionHandlerCubeShip(ship, cube) {
    player.kill();
    cube.kill(); 
    coin.play('', 0, 1, false);
    retryText = game.add.text(300,280,"Ouch!", {font: '64px Arial', fill:  '#fff'});
    // get location of currnt camera postion
    retryText.fixedToCamera = true;
    retryText.text = "You Lose!";
    game.time.events.add(Phaser.Timer.SECOND * 2.5, gameReset, this);
} // end function

function collisionHandlerBox(player, boxMid) {
    boxMid.kill();
    score = score + 20; 
    coin.play('', 0, 1, false);
} // end function

function collisionHandlerExtrabox(player, extrabox) {
    extrabox.kill();
    score = score +  100; 
    coin.play('', 0, 1, false);
} // end function 

function collisionHandlerShip(player, ship) {
    player.kill();
    collisionText();
} // end function 

function collisionText() {
    lives = lives - 1;
    if (score > 0 && lives > 0) {
    retryText = game.add.text(300,280,"Ouch!", {font: '64px Arial', fill:  '#fff'});
    // get location of currnt camera postion
    retryText.fixedToCamera = true;
    retryText.text = "Ouch!";
    // deduct 100 points from score if greater than zero
    if (score > 0) {
        score = score - 100;
    }

    game.time.events.add(Phaser.Timer.SECOND * 2.5, gameReset, this);
    } else {
    // calls a funtion in a certian amount of time
    game.time.events.add(Phaser.Timer.SECOND * 0.5, gameReset, this);
    }
} // end function 


function gameReset() {
    // if score > 0 && lives > 0 reset
    // else game over
    if (lives > 0) {
        music.stop(); 
        game.state.start(game.state.current); 
    } else {
    retryText = game.add.text(300,280,"Ouch!", {font: '64px Arial', fill:  '#fff'});
        // get location of currnt camera postion
        retryText.fixedToCamera = true;
        retryText.text = "Game Over!";
    }
} // end function