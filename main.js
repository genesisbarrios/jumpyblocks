//create the main state that will contain the game
var mainState = {
    preload: function(){
        //Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
    },

    create: function(){
        //Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        //Start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display the bird
        this.bird = game.add.sprite(100, 245, 'bird');

        //Add physics to the bird
        //Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        //Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        //Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },

    update: function(){
        //If the bird is out of the screen(too high or low)
        //Call the 'restartGame' function
        if(this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
    },

    jump: function(){
        //Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    restartGame: function(){
        //Start the 'main' state, which restarts the game
        game.state.start('main');
    }
};

//Initialize Phaser, and create a 400 x 900px game
var game = new Phaser.Game(400, 900);

//Add the mainState and call it main
game.state.add('main', mainState);

//Start the state to 
game.state.start('main');