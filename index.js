let canvas = document.getElementById('gameSpace');
let canvasHeight = 600;
let canvasWidth = 960;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
let ctx = canvas.getContext("2d");


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
            // map_x = (Math.floor(map_x) - pos_x); FISH-EYE
            map_x = (map_x - pos_x);
            map_y = (map_y - pos_y);
        }
        
        if(dirWall === 2){
            // map_y = (Math.floor(map_y) - pos_y); FISH-EYE
            map_x = (map_x - pos_x);
            map_y = (map_y - pos_y);
        }
        
        let distance = Math.sqrt(Math.abs(Math.pow(map_x, 2)) + Math.abs(Math.pow(map_y, 2)));
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
    }
}

//Controls
let keyState = {};    
document.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
document.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

function gameLoop() {
    //right
    if (keyState[39] || keyState[68]){
        dir_player-=5;
    }
    //left
    if (keyState[37] || keyState[65]){
        dir_player+=5;        
    }
    //up
    if (keyState[38] || keyState[87]){    
        
    }
    //down
    if (keyState[40] || keyState[83]){
        
    }
    draw();
    setTimeout(gameLoop, 10);
}
gameLoop();