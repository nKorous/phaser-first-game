import 'phaser';

let playerX = 100
let playerY = 200

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

let game = new Phaser.Game(config);

function preload () {
    this.load.image('sky', '../assets/sky.png')
    this.load.image('ground', '../assets/platform.png')
    this.load.image('star', '../assets/star.png')
    this.load.image('bomb', '../assets/star.png')
    this.load.spritesheet('dude', '../assets/dude.png', { frameWidth:32, frameHeight: 48})

}

function create () {
    
    //World

    /** Background */
    this.add.image(400, 300, 'sky')
    

    /*** Platforms */
    let platform = this.physics.add.staticGroup()

    platform.create(400, 568, 'ground').setScale(2).refreshBody() //This is the bottom (ground) of the canvas screen
    platform.create(600, 400, 'ground')
    platform.create(50, 250, 'ground')
    platform.create(750, 220, 'ground')

    //Player(s)

    let player = this.physics.add.sprite(100, 400, 'dude')
    player.body.setGravityY(300)

    this.physics.add.collider(player, platform)

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

}

function update() {
    return
}

