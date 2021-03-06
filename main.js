//create the main state that will contain the game
var mainState = {
    preload: function () {
        //Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        
        //Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
        
        //Load jump sound
        game.load.audio('jump', 'assets/jump.wav');
        
        game.load.image('bg', 'assets/bg.png');
    },

    create: function () {
        //Change the background color of the game to blue
        //game.stage.backgroundColor = '#71c5cf';
        
        //add background image
        skyTile = game.add.tileSprite(0, 0, 400, 600, 'bg');

        //Start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display the bird
        this.bird = game.add.sprite(100, 245, 'bird');

        //Add physics to the bird
        //Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        //Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;
        
        //Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        //Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        
        //SOUNDS
        
        //Add the jump sound
        this.jumpSound = game.add.audio('jump');
        
        
        //PIPES
        
        //Create an empty group
        this.pipes = game.add.group();
        
        //Add Pipes every 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        
        //SCORES
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Times New Roman", fill: "white"} );
    },
    
    addOnePipe: function (x, y) {
        //Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
        
        //Add the pipe to the previouisly created group
        this.pipes.add(pipe);
        
        //Enable physics on the pipe
        game.physics.arcade.enable(pipe);
        
        //Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;
        
        //Kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function () {
        //Randomly pick a number between 1 and 6
        //This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
        
        //Add the 8 pipes
        //With one big hole at position hole and hole + 1
        for (var i=0; i < 10; i++) {
            if(i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        }
        
        //Increase score by 1 each time new pipes are created
        this.score += 1;
        this.labelScore.text = this.score;
    },

    update: function(){
        //bird animation
        if(this.bird.angle < 20)
            this.bird.angle += 1;
        
        //move sky
        skyTile.tilePosition.x = skyTile.tilePosition.x - 5;
        
        //If the bird is out of the screen(too high or low)
        //Call the 'restartGame' function
        if(this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        
        //call 'restartGame' function each time bird collides with the 'pipes' group
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    jump: function(){
        if(this.bird.alive == false)
            return;
        
        //bird animation
        var animation = game.add.tween(this.bird);
        
        //change the angle of the bird to -20 in 100 milliseconds
        animation.to({angle: -20}, 100);
        animation.start();
        
        //Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        
        //Play the jump sound
        this.jumpSound.play();
    },

    hitPipe: function(){
        //If the bird has already hit a pipe, do nothing
        //It means the bird is already falling off the screen
        if(this.bird.alive == false)
            return;
        
        //Set the alive property of the bird to false
        this.bird.alive = false;
        
        //change score color to red
        this.labelScore.addColor("#ff0000", 0);
        
        //Prevent new pipes from appearing
        game.time.events.remove(this.timer);
        
        //Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
    
    restartGame: function(){
        
        //change score color to red
        this.labelScore.addColor("#ff0000", 0);
        
        //Prevent new pipes from appearing
        game.time.events.remove(this.timer);
        
        setTimeout(restart(), 2000);
    }
};

function restart(){
    //Start the 'main' state, which restarts the game
    game.state.start('main');
}

//Initialize Phaser, and create a 400 x 600px game
var game = new Phaser.Game(400, 600);

var skyTile;

//Add the mainState and call it main
game.state.add('main', mainState);

//Start the state to 
game.state.start('main');