import 'phaser';

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player //player info
let platform // world info
let cursors // movement/input info
let stars // star info
let score = 0 //number of stars/score for player
let scoreText //The text for the score
let bombs // bomb info
let deadText //what it says when you die
let gameOver //if its game over or not
let bombCount = 0 //how many bombs there are

let game = new Phaser.Game(config);

function preload () {
    this.load.image('sky', '../assets/sky.png')
    this.load.image('ground', '../assets/platform.png')
    this.load.image('star', '../assets/star.png')
    this.load.image('bomb', '../assets/bomb.png')
    this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight: 48})

}

function create () {
    
    //World

    /** Background */
    this.add.image(400, 300, 'sky')
    

    /*** Platforms */
    platform = this.physics.add.staticGroup()

    platform.create(400, 568, 'ground').setScale(2).refreshBody() //This is the bottom (ground) of the canvas screen
    platform.create(600, 400, 'ground')
    platform.create(50, 250, 'ground')
    platform.create(750, 220, 'ground')

    //Player(s)

    player = this.physics.add.sprite(100, 400, 'dude')
    player.body.setGravityY(300)

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Stars

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70}
    })

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    //score info
    scoreText = this.add.text(16, 16, 'You have scored: 0, what a looser' , { fontSize: '32px', fill: '#000'})

    //bomb info
    bombs = this.physics.add.group()

    deadText = this.add.text(150, 200, '', { fontSize: '42px', fill: 'red'})

    //Player\Environment Colliders
    this.physics.add.collider(player, platform) //coolide players and platforms
    this.physics.add.collider(stars, platform) //collide stars and platforms so they dont fall through the bottom
    
    this.physics.add.overlap(player, stars, collectStar, null, this) //See if the player object is overlapping the star object

    this.physics.add.collider(bombs, platform)
    this.physics.add.collider(player, bombs, hitBomb, null, this)


}

function update() {
     //Movement

     cursors = this.input.keyboard.createCursorKeys()

     if(cursors.left.isDown){
         player.setVelocityX(-160)
         player.anims.play('left', true)
     }
     else if (cursors.right.isDown){
         player.setVelocityX(160)
         player.anims.play('right', true)
     }
     else {
         player.setVelocityX(0)
         player.anims.play('turn')
     }
 
     if(cursors.up.isDown && player.body.touching.down){
         player.setVelocityY(-475)
     }
}

function collectStar(player, star){
    star.disableBody(true, true) //says to turn off the stars display if a player collides with it

    //adding to the player score
    score += 10
    if(score === 10){
        scoreText.setText(`Wow! now you've scored: ${score}!`)
    } 
    else if(score > 10 && score < 120){
        scoreText.setText(`Score: ${score}, Stars Left: ${stars.countActive(true)}`)
    }
    else {
        scoreText.setText(`Score: ${score} Stars Left: ${stars.countActive(true)} Bombs: ${bombs.countActive(true)}`)
    }

    //star and bomb making logic

    if(stars.countActive(true) === 0){
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true)

            bombCount += 1
        })

    

    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    let bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    bomb.allowGravity = false
    }
}

function hitBomb(player, bomb){
    this.physics.pause()

    player.setTint(0xff0000)

    player.anims.play('turn')

    gameOver = true

    deadText.setText(`HAHA, You have died...
        \n score: ${score} 
        \n bombs: ${bombs.countActive(true)}`)
}

