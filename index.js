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
let pointerX=canvasWidth/2;
let pointerY=canvasHeight/2; 
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
let dukeX=380;
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
// let map = [
//     '1111111111111111111111111111', 
//     '1010000000000000000000000001',
//     '1010000100111111111111100001',
//     '1010000100000000000000100001',
//     '1011111100000000000000111001',
//     '1000000000000000000000100001',
//     '1111111111111100000000100001',
//     '1000001000000000000000100001',
//     '1000001000000000000000100001',
//     '1000000000000000000000111111',
//     '1000000000000000000000000001',
//     '1000001000000000000000000001',
//     '1000001111111111111111111111',
//     '1000001000000000000000000001',
//     '1111001000011111111111100001',
//     '1000001000010000000000100001',
//     '1000001000010000000000000001',
//     '1001111000010000000000000001',
//     '1000001000010000000000100001',
//     '1000001000010000000000100001',
//     '1110001000010000000000100001',
//     '1000001000010000000000100001',
//     '1001001000011111111111100001',
//     '1001000000000000000000000001',
//     '1111111111111111111111111111',
// ];
// Player position
let dir_player = 270;
let FOV = 60;
let cube_size = 64;
let x = canvasWidth;
let y = canvasHeight;
let PI = 3.14159;
const distance_ref = ((canvasWidth/2)/Math.tan((FOV/2) * PI / 180));
let horX;
let horY;
let verX;
let verY;
let distance;
let colorHor;
let colorVer;

//Wall's color
let styleWall;
//Last check by x or y
let dirWall;
let pos_xInit = 1.5;
let pos_yInit = 1.5;
let map_size_x = map[0].length;
let map_size_y = map.length;

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

//Game loop
function draw(){
    
    updateFrame();
    
    //fps Check
    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    
    let pos_x = pos_xInit;
    let pos_y = pos_yInit;
    let player_x = pos_x * cube_size;
    let player_y = pos_y * cube_size;
    let step_x;
    let step_y;
    
    // console.log(pos_x, pos_y, pos_xInit, pos_yInit);
    console.log(dir_player)
    
    for ( let x = 0; x < canvasWidth; x++ ) {
        
        let angle = dir_player + ( FOV/2 ) - x * ( FOV / canvasWidth );
        if(angle>360){
            angle -= 360;
        }
        if(angle<0){
            angle += 360;
        }
        let angle_rad = angle * PI/180;
        
        
        //Horizon
        if(angle <= 180){
            colorHor = "green";
            horY = Math.floor(pos_y) * cube_size;
            horX = player_x + (player_y - horY)/Math.tan(angle_rad);
            step_y = -cube_size;
            step_x = cube_size/Math.tan(angle_rad);
            
            while(horX > 0 && horX < map_size_x*cube_size && horY > 0 && horY < map_size_y*cube_size){
                if(map[Math.floor((horY-1)/cube_size)][Math.floor(horX/cube_size)] === '1'){
                    break;
                }
                horY += step_y;
                horX += step_x;
                
            }
            horX = (player_x - horX);
            horY = (player_y - horY);
        } else {
            colorHor = "purple";
            horY = Math.floor(pos_y) * cube_size + cube_size;
            horX = player_x + (player_y - horY)/Math.tan(angle_rad);
            step_y = cube_size;
            step_x = -cube_size/Math.tan(angle_rad);
            
            while(horX > 0 && horX < map_size_x*cube_size && horY > 0 && horY < map_size_y*cube_size){
                if(map[Math.floor((horY+1)/cube_size)][Math.floor(horX/cube_size)] === '1'){
                    break;
                }
                horY += step_y;
                horX += step_x;
                
            }
            horX = (player_x - horX);
            horY = (player_y - horY);
        }
        //Vertic
        if(angle>=90 && angle<=270){
            colorVer = "skyblue";
            verX = Math.floor(pos_x) * cube_size;
            verY = player_y + (player_x - verX)*Math.tan(angle_rad);
            step_x = -cube_size;
            step_y = cube_size*Math.tan(angle_rad);
            
            while(verY > 0 && verY < map_size_y*cube_size && verX > 0 && verX < map_size_x*cube_size){
                if(map[Math.floor(verY/cube_size)][Math.floor((verX-1)/cube_size)] === '1'){
                    break;
                }
                verX += step_x;
                verY += step_y;
            }
            verY = (player_y - verY);
            verX = (player_x - verX);
        } else {
            colorVer = "orange";
            verX = Math.floor(pos_x) * cube_size + cube_size;
            verY = player_y + (player_x - verX)*Math.tan(angle_rad);
            step_x = cube_size;
            step_y = -cube_size*Math.tan(angle_rad);
            
            while(verY > 0 && verY < map_size_y*cube_size && verX > 0 && verX < map_size_x*cube_size){
                if(map[Math.floor(verY/cube_size)][Math.floor((verX+1)/cube_size)] === '1'){
                    break;
                }
                verX += step_x;
                verY += step_y;
            }
            verY = (player_y - verY);
            verX = (player_x - verX);
        }
        
        let alpha_angle = Math.abs(dir_player - angle) * PI/180;
        
        let distanceH = Math.sqrt((horX * horX) + (horY * horY)) * Math.cos(alpha_angle) ;
        let distanceV = Math.sqrt((verX * verX) + (verY * verY)) * Math.cos(alpha_angle);
        
        if(distanceH < distanceV){
            styleWall = colorHor;
            distance = distanceH;
        } else {
            styleWall = colorVer;
            distance = distanceV;
        }
        
        let wall_height = cube_size / distance * distance_ref;
        
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

    //Camera
    //rightLook
    if(keyState[39]){
        dir_player-=3;
        if(dir_player<0){
            dir_player+=360;
        }
        
        if(dir_player>=360){
            dir_player-=360;
        }
    }
    //LeftLook
    if(keyState[37]){
        dir_player+=3;
        if(dir_player<0){
            dir_player+=360;
        }
        
        if(dir_player>=360){
            dir_player-=360;
        }
    }
    //right
    if (keyState[68]){
        if(keyState[16]){
            acc = 0.4; 
        } else{
            acc = 0.2;
        }
        angle = dir_player + 270; 
        if(map[Math.floor(pos_yInit + -Math.sin( angle * ( PI/180 )  )* acc)][Math.floor(pos_xInit)] !== '1'){
            pos_yInit += -Math.sin( angle * ( PI/180 )  )* acc;
        }
        angle = -dir_player + 270; 
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + -Math.cos( angle * ( PI/180 )  )* acc)] !== '1'){   
            pos_xInit += -Math.cos( angle * ( PI/180 )  )* acc;
        }
    }
    
    //left
    if (keyState[65]){
        if(keyState[16]){
            acc = 0.4; 
        } else{
            acc = 0.2;
        }
        angle = dir_player + 90;
        if(map[Math.floor(pos_yInit + -Math.sin( angle * ( PI/180 )  )* acc)][Math.floor(pos_xInit)] !== '1'){
            pos_yInit += -Math.sin( angle * ( PI/180 )  )* acc;
        }
        angle = -dir_player + 90;
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + -Math.cos( angle * ( PI/180 )  )* acc)] !== '1'){   
            pos_xInit += -Math.cos( angle * ( PI/180 )  )* acc; 
        }
    }
    
    //up
    if (keyState[87]){
        if(keyState[16]){
            acc = 0.4; 
        } else{
            acc = 0.2;
        }
        cos_rad = Math.cos(-dir_player * PI/180);
        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + cos_rad  * acc)] !== '1'){   
            pos_xInit += cos_rad * acc;
        }
        sin_rad = -Math.sin(dir_player * PI/180);
        if(map[Math.floor(pos_yInit + sin_rad * acc)][Math.floor(pos_xInit)] !== '1'){   
            pos_yInit += sin_rad * acc;
        }
    }
    
    //down
    if (keyState[83]){
        angle = dir_player + 180;
        if(map[Math.floor(pos_yInit + -Math.sin( angle * ( PI/180 )  )* 0.2)][Math.floor(pos_xInit)] !== '1'){   
            pos_yInit += -Math.sin( angle * ( PI/180 )  )* 0.2;
        }
        angle = -dir_player + 180;

        if(map[Math.floor(pos_yInit)][Math.floor(pos_xInit + Math.cos( angle * ( PI/180 )  )* 0.2)] !== '1'){   
            pos_xInit += Math.cos( angle * ( PI/180 )  )* 0.2;
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
    requestAnimationFrame(draw);
}

draw();

function dukeInit(){
    dukeWidth = 100; 
    dukeHeight = 110; 
    dukeRows = 1; 
    dukeCols = 1;
    dWidth = dukeWidth/dukeCols;
    dHeight = dukeHeight/dukeRows;
    dukeCurFrame = 0; 
    dukeFrameCount = 1; 
    dukeX=380;
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
    dukeX=380;
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
    dukeX=380;
    dukeY=370; 
    dukeSrcX= 280; 
    dukeSrcY= 460;
    setTimeout(dukeInit, 100)    
}
