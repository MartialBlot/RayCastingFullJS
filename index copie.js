let canvas = document.getElementById('gameSpace');
let canvasHeight = 480;
let canvasWidth = 640;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
let ctx = canvas.getContext("2d");

//Duke sprite
let duke = new Image();
duke.src='./sprites/Duke.png';

let dukeWidth = 100; 
let dukeHeight = 110; 
let dukeRows = 1; 
let dukeCols = 1; 
let dWidth = dukeWidth/dukeCols;  
let dHeight = dukeHeight/dukeRows; 
let dukeCurFrame = 0; 
let dukeFrameCount = 1; 
let dukeX=300;
let dukeY=370; 
let dukeSrcX= 280; 
let dukeSrcY= 460;

let shootSound = new Audio('sound/pistol.mp3');
let oneShoot = true;

//Map test
let map = ['111111111111', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '111111111111'];
console.log(map)
// Player position
let dir_player = 270;
let FOV = 60;
let cube_size = 1;
let x = canvasWidth;
let y = canvasHeight;

//Wall's color
let styleWall;
//Last check by x or y
let dirWall;

let pos_xInit = 1.5;
let pos_yInit = 1.5;

function updateFrame(){
    ctx.clearRect(0,0,x,y);
    
    dukeCurFrame = ++dukeCurFrame % dukeFrameCount;
    dukeSrcX = dukeCurFrame * dWidth;
    ctx.clearRect(dukeX,dukeY,dWidth,dHeight);
}

//Game loop
function draw(){
    updateFrame();
    for ( let x = 0; x < canvasWidth; x++ ) {
        let pos_x = pos_xInit;
        let pos_y = pos_yInit;
        let angle = dir_player + ( FOV/2 ) - x * ( FOV / canvasWidth );        
        map_x = pos_x;
        map_y = pos_y;
        step_x = -Math.cos( angle * ( Math.PI/180 )  )* 0.01;
        step_y = -Math.sin( angle * ( Math.PI/180 )  )* 0.01;
        
        while (parseInt(map[Math.floor(map_y)][Math.floor(map_x)]) === 0){
            map_x = map_x + step_x;
            if(parseInt(map[Math.floor(map_y)][Math.floor(map_x)]) === 1)
            {
                styleWall = 'red';
                dirWall = 1;
                break;
            }
            map_y = map_y + step_y
            if(parseInt(map[Math.floor(map_y)][Math.floor(map_x)]) === 1)
            {
                styleWall = 'orange';
                dirWall = 2;
                break;
            }
        }
        
        if(dirWall === 1){
            //FISH-EYE
            // map_x = (Math.floor(map_x) - pos_x); 
            map_x = (map_x - pos_x);
            map_y = (map_y - pos_y);
        }
        
        if(dirWall === 2){
            //FISH-EYE
            // map_y = (Math.floor(map_y) - pos_y);
            map_x = (map_x - pos_x);
            map_y = (map_y - pos_y);
        }
        
        let distance = Math.sqrt(Math.abs(Math.pow(map_x, 2)) + Math.abs(Math.pow(map_y, 2))) * Math.cos(Math.abs((dir_player - angle) * Math.PI/180));
        const distance_ref = ((canvasWidth/2)/Math.tan((FOV/2) * 180 / Math.PI));
        let wall_height = distance_ref / distance;
        
        let draw_start = (y - wall_height) / 2;
        let draw_end = y - draw_start;
        
        //Draw Sky
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, draw_start);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        
        //Draw walls
        ctx.beginPath();
        ctx.moveTo(x, draw_start);
        ctx.lineTo(x, draw_end);
        ctx.strokeStyle = styleWall;
        ctx.stroke();
        
        //Draw Floor
        ctx.beginPath();
        ctx.moveTo(x, draw_end);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'brown';
        ctx.stroke();
        
        ctx.drawImage(duke,dukeSrcX, dukeSrcY,dWidth,dHeight,dukeX,dukeY,dWidth,dHeight);
    }
}

//Controls
let keyState = {};    
document.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
document.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
    oneShoot= true; 
},true);

function gameLoop() {
    //Camera
    //right
    if(keyState[39]){
        dir_player-=3;
    }
    //Gauche
    if(keyState[37]){
        dir_player+=3;
    }
    //right
    if (keyState[68]){
        pos_xInit += 0.1;      
    }
    //left
    if (keyState[65]){
        pos_xInit -= 0.1;        
    }
    //up
    if (keyState[87]){    
        pos_yInit += 0.1;
    }
    //down
    if (keyState[83]){
        pos_yInit -= 0.1;
    }
    //Shoot
    if (keyState[18]){
        while(oneShoot){
        shootSound.play();
        oneShoot = false;
        dukeShoot();
        }
    }
    draw();
    setTimeout(gameLoop, 10);
}
gameLoop();

function dukeInit(){
    dukeWidth = 100; 
    dukeHeight = 110; 
    dukeRows = 1; 
    dukeCols = 1;
    dWidth = dukeWidth/dukeCols;
    dHeight = dukeHeight/dukeRows;
    dukeCurFrame = 0; 
    dukeFrameCount = 1; 
    dukeX=300;
    dukeY=370; 
    dukeSrcX= 280; 
    dukeSrcY= 460;
} 

function dukeShoot(){
    dukeWidth = 280; 
    dukeHeight = 110; 
    dukeRows = 1; 
    dukeCols = 3; 
    dWidth = dukeWidth/dukeCols;  
    dHeight = dukeHeight/dukeRows; 
    dukeCurFrame = 0; 
    dukeFrameCount = 3; 
    dukeX=300;
    dukeY=370; 
    dukeSrcX= 280; 
    dukeSrcY= 460;

    setTimeout(dukeInit, 100)    
}
