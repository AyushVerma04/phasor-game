export const createMapAnimations = (scene) => {
  
    scene.anims.create({
      key: 'mapAnimation',
      frames: scene.anims.generateFrameNumbers('animatedMap', { start: 0, end: 80 - 1 }),  // Adjust 'totalFrames'
      frameRate: 10,  // Adjust frame rate to match GIF speed
      repeat: -1      // -1 for infinite loop
  });
  };
  