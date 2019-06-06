let canvas = document.getElementById('gameSpace');
let canvasHeight = 480;
let canvasWidth = 640;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
let ctx = canvas.getContext("2d");

//Duke sprite
let duke = new Image();
duke.src = './sprites/Duke.png';
let pointer = new Image();
pointer.src = './sprites/pointer.png';
//Run
let acc = 0.2; 

let pointerWidth = 10; 
let pointerHeight = 10; 
let pointerRows = 1; 
let pointerCols = 1; 
let pWidth = pointerWidth/pointerCols;  
let pHeight = pointerHeight/pointerRows; 
let pointerCurFrame = 0; 
let pointerFrameCount = 1; 
let pointerX=280;
let pointerY=260; 
let pointerSrcX= 0; 
let pointerSrcY= 0;


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
let reloadSound = new Audio('sound/reload.mp3');
let emptySound = new Audio('sound/empty.mp3');
let oneShoot = true;
let Ammo = 12;
let reload = false;
let oneReload = true;

//Map test
// let map = ['111111111111', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '100000000001', '111111111111'];
let map = ['1111111111111111111111111111', '1000000000000000000000000001', '1000000000000000000000000001', '1000000000000000000000000001', '1000000001111001111000000001', '1000000000000000000000000001', '1000000000000000000000000001', '1000000000000000000000000001', '1000000000000000000000000001', '1000000000000000000000000001', '1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001','1000000000000000000000000001', '1111111111111111111111111111'];
console.log(map)
// Player position
let dir_player = 270;
let FOV = 60;
let cube_size = 1;
let x = canvasWidth;
let y = canvasHeight;
const distance_ref = ((canvasWidth/2)/Math.tan((FOV/2) * Math.PI / 180));

//Wall's color
let styleWall;
//Last check by x or y
let dirWall;

let pos_xInit = 1.5;
let pos_yInit = 1.5;

//FPS firstCheck
var lastLoop = new Date();

function updateFrame(){
    ctx.clearRect(0,0,x,y);
    
    pointerCurFrame = ++pointerCurFrame % pointerFrameCount;
    pointerSrcX = pointerCurFrame * pWidth;
    ctx.clearRect(pointerX,pointerY,pWidth,pHeight);
    
    dukeCurFrame = ++dukeCurFrame % dukeFrameCount;
    dukeSrcX = dukeCurFrame * dWidth;
    ctx.clearRect(dukeX,dukeY,dWidth,dHeight);
}

//Game loop
function draw(){

    updateFrame();

    //fps Check
    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    
    for ( let x = 0; x < canvasWidth; x++ ) {
        let pos_x = pos_xInit;
        let pos_y = pos_yInit;
        let angle = dir_player + ( FOV/2 ) - x * ( FOV / canvasWidth );        
        map_x = pos_x;
        map_y = pos_y;
        step_x = -Math.cos( angle * ( Math.PI/180 )  ) * 0.01;
        step_y = -Math.sin( angle * ( Math.PI/180 )  ) * 0.01;
        
        while (parseInt(map[Math.floor(map_y)][Math.floor(map_x)]) === 0){
            map_x = map_x + step_x;
            if(map[Math.floor(map_y)][Math.floor(map_x)] === '1'){
                styleWall = 'red';
                dirWall = 1;
                break;
            }
            map_y = map_y + step_y;
            if(map[Math.floor(map_y)][Math.floor(map_x)] === '1'){
                styleWall = 'orange';
                dirWall = 2;
                break;
            }
        }
        
        if(dirWall === 1){
            //FISH-EYE
            // map_x = (Math.ceil(map_x) - pos_x); 
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
        let wall_height = distance_ref / distance;
        
        let draw_start = (y - wall_height) / 2;
        let draw_end = y - draw_start;

        if (draw_start < 0){
            draw_start = 0
        }
        if (draw_end > 480){
            draw_end = 480
        }
        
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
        ctx.drawImage(pointer,pointerSrcX, pointerSrcY,pWidth,pHeight,pointerX,pointerY,pWidth,pHeight);
        
        //Draw fps
        ctx.font="20px helvetica";
        ctx.fillText(`fps: ${fps.toFixed(0)}`, 10, 20);
        //Draw ammo
        ctx.font="20px helvetica";
        ctx.fillText(`${Ammo}/12`, 580, 470);
        if(reload){
            ctx.font="20px helvetica";
            ctx.fillText('Reload', 470, 470);
        }
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
    oneReload = true;
},true);

function gameLoop() {
    //Camera
    //rightLook
    if(keyState[39]){
        dir_player-=3;
    }
    //LeftLook
    if(keyState[37]){
        dir_player+=3;
    }
    //right
    if (keyState[68]){
        if(keyState[16]){
            acc = 0.3; 
        } else{
            acc = 0.2;
        }
        angle = dir_player + 90; 
        if(map[Math.floor(pos_yInit + Math.sin( angle * ( Math.PI/180 )  )* acc)][Math.floor(pos_xInit)] !== '1'){
            pos_yInit += Math.sin( angle * ( Math.PI/180 )  )* acc;
        }
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + Math.cos( angle * ( Math.PI/180 )  )* acc)] !== '1'){   
            pos_xInit += Math.cos( angle * ( Math.PI/180 )  )* acc;
        }
    }
    
    //left
    if (keyState[65]){
        if(keyState[16]){
            acc = 0.3; 
        } else{
            acc = 0.2;
        }
        angle = dir_player + 270;
        if(map[Math.floor(pos_yInit + Math.sin( angle * ( Math.PI/180 )  )* acc)][Math.floor(pos_xInit)] !== '1'){
            pos_yInit += Math.sin( angle * ( Math.PI/180 )  )* acc;
        }
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + Math.cos( angle * ( Math.PI/180 )  )* acc)] !== '1'){   
            pos_xInit += Math.cos( angle * ( Math.PI/180 )  )* acc; 
        }
    }
    
    //up
    if (keyState[87]){
        if(keyState[16]){
            acc = 0.3; 
        } else{
            acc = 0.2;
        }
        angle = dir_player;
        if(map[Math.floor(pos_yInit + -Math.sin( angle * ( Math.PI/180 )  )* acc)][Math.floor(pos_xInit)] !== '1'){   
            pos_yInit += -Math.sin( angle * ( Math.PI/180 )  )* acc;
        }
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + -Math.cos( angle * ( Math.PI/180 )  )* acc)] !== '1'){   
            pos_xInit += -Math.cos( angle * ( Math.PI/180 )  )* acc;
        }
    }
    
    //down
    if (keyState[83]){
        angle = dir_player + 180;
        if(map[Math.floor(pos_yInit + -Math.sin( angle * ( Math.PI/180 )  )* 0.2)][Math.floor(pos_xInit)] !== '1'){   
            pos_yInit += -Math.sin( angle * ( Math.PI/180 )  )* 0.2;
        }
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + -Math.cos( angle * ( Math.PI/180 )  )* 0.2)] !== '1'){   
            pos_xInit += -Math.cos( angle * ( Math.PI/180 )  )* 0.2;
        }
    }
    //Shoot
    if (keyState[18]){
        if(Ammo > 0){
            while(oneShoot){
                shootSound.load();
                shootSound.play();
                oneShoot = false;
                dukeShoot();
                Ammo=Ammo-1;
            }
        }
        if(Ammo===0){
            emptySound.load();
            emptySound.play();
            reload = true;
        }
    }
    //Reload
    if (keyState[82]){
        while(oneReload){
            reloadSound.load();
            reloadSound.play();
            Ammo = 12;
            reload = false;
            oneReload = false;
            dukeReload();
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

function dukeReload(){
    dukeWidth = 198; 
    dukeHeight = 255; 
    dukeRows = 1; 
    dukeCols = 1;
    dWidth = dukeWidth/dukeCols;
    dHeight = dukeHeight/dukeRows;
    dukeCurFrame = 0; 
    dukeFrameCount = 1; 
    dukeX=300;
    dukeY=350; 
    dukeSrcX= 0; 
    dukeSrcY= 1440;
    setTimeout(dukeInit, 200)    
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
