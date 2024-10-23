export const createCharacterAnimations = (scene) => {
    const animationConfig = {
      frameRate: 10,
      repeat: -1
    };
  
    scene.anims.create({
      key: 'walk_down',
      frames: scene.anims.generateFrameNumbers('walk_down', { start: 0, end: 3 }),
      ...animationConfig
    });
  
    scene.anims.create({
      key: 'walk_left',
      frames: scene.anims.generateFrameNumbers('walk_left', { start: 0, end: 3 }),
      ...animationConfig
    });
  
    scene.anims.create({
      key: 'walk_right',
      frames: scene.anims.generateFrameNumbers('walk_right', { start: 0, end: 3 }),
      ...animationConfig
    });
  
    scene.anims.create({
      key: 'walk_up',
      frames: scene.anims.generateFrameNumbers('walk_up', { start: 0, end: 3 }),
      ...animationConfig
    });
  
    scene.anims.create({
      key: 'stay',
      frames: [{ key: 'walk_down', frame: 0 }],
      frameRate: 20
    });
  };
  