export const preloadAssets = (scene) => {
    console.log("Loading assets...");
    scene.load.image('map', 'mapCustomUpdated.png');

    scene.load.spritesheet('walk_down', 'walkdown.png', { frameWidth: 40, frameHeight: 48 });
    scene.load.spritesheet('walk_up', 'walkup.png', { frameWidth: 40, frameHeight: 48 });
    scene.load.spritesheet('walk_left', 'walkleft.png', { frameWidth: 40, frameHeight: 48 });
    scene.load.spritesheet('walk_right', 'walkright.png', { frameWidth: 40, frameHeight: 48 });
}