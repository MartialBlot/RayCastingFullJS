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
let dir_player = 300;
let FOV = 60;
let cube_size = 1;
let x = canvasWidth;
let y = canvasHeight;

let pos_xInit = 5.5;
let pos_yInit = 3.5;

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
        step_x = Math.cos( angle * ( Math.PI/180 ) * 0.1 );
        step_y = -Math.sin( angle * ( Math.PI/180 ) * 0.1 );
        while( parseInt(map[Math.floor(map_y)][Math.floor(map_x)]) === 0 ){
            map_x += step_x;
            map_y += step_y;
        }
        
        map_x = (map_x - pos_x);
        map_y = (map_y - pos_y);
        
        let distance = Math.sqrt(Math.abs(Math.pow(map_x, 2)) + Math.abs(Math.pow(map_y, 2)));
        const distance_ref = (canvasWidth/2)/Math.tan((FOV/2) * 180 / Math.PI);
        let wall_height = Math.abs(distance_ref) / distance;
        // console.log(distance)
        // console.log(distance_ref)
        console.log(wall_height)
        
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
        ctx.strokeStyle = 'orange';
        ctx.stroke();
        
        //Draw Floor
        ctx.beginPath();
        ctx.moveTo(x, draw_end);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'blue';
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
        dir_player-=20;
        console.log('pass')
    }
    //left
    if (keyState[37] || keyState[65]){
        dir_player+=20;        
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