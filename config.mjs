//TODO move global configs here

//Keybinds
export const binds = {
    pause: ["Escape"],
    left: ["ArrowLeft", "KeyA"],
    right: ["ArrowRight", "KeyD"],
    up: ["ArrowUp", "KeyW"],
    down: ["ArrowDown", "KeyS"],
    dash: ["ShiftLeft"]
}



// Game parameters
export const world = {
    width: 2000,
    height: 1000,
    spawnDelay: 60
}

export const player = {
    speed: 500,
    acceleration: 2000,
    friction: 5000,

    iFrames: 0.25,
    attackDelay: .7,
    damage: 2,

    //rendering
    radius: 32,
    gap: 4
}

export const input = {
    tapTime: 200,
    tapDistance: 24,

    //Joystick
    deadzone: 1,
    maxOffset: 12,
    radius: 24
}