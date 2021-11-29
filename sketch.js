var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var restart;
var gameOver;
var jump;
var die;
var checkPoint;
var grupoNuvens;
var grupoCactus;
var JOGANDO = 1;
var FIM = 0;
var estadoJogo = JOGANDO;

var score = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudImage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  restart = loadImage("restart.png")
  gameOver = loadImage("gameOver.png")
  jump = loadSound("jump.mp3")
  die = loadSound("die.mp3")
  checkPoint = loadSound("checkPoint.mp3")
}

function setup() {

  createCanvas(windowWidth,windowHeight)            
  
  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;

  reiniciar = createSprite(300,100,20,20);
  reiniciar.addImage("restart",restart);
  reiniciar.scale = 0.7;
  reiniciar.x=width/2*0.7
  reiniciar.y=height/2*0.7
  
  jogoAcabou = createSprite(300,50,20,20);
  jogoAcabou.addImage("gameOver",gameOver);
  jogoAcabou.scale = 0.5;
  jogoAcabaou.x=width/2*0.5
  jogoAcabou.y=height/2*0.5

  //crie sprite ground (solo)
  ground = createSprite(200,height*0.9,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //crie um solo invisível
  invisibleGround = createSprite(200,ground.y+5,400,10);
  invisibleGround.visible = false;
  //arruma a colisão do trex
  trex.setCollider("circle",0,0,50)

  grupoNuvens = createGroup();
  grupoCactus = createGroup();
}

function draw() {
  //definir cor do plano de fundo
  background(180);

  if(estadoJogo === JOGANDO){
    jogoAcabou.visible = false;
    reiniciar.visible = false;
  if(score>0 && score%100===0){
   checkPoint.play();
  }
    score += Math.round(frameCount/500)
  text("Pontuação:"+score,50,50)
  // pulando o trex ao pressionar a tecla de espaço
  if(keyDown("space") && trex.y>160 && touches.lenght>0) {
    trex.velocityY = -13;
    jump.play()
    touches=[]
  }
  trex.velocityY = trex.velocityY + 0.8
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  //impedir que o trex caia
  trex.collide(invisibleGround);
  ground.velocityX = -4-score/100;
  //Gerar Nuvens
  spawnClouds()
  spawnCactus()
  if(grupoCactus.collide(trex)){
    estadoJogo = FIM
    die.play()
  }
} 
else if(estadoJogo === FIM){
  ground.velocityX=0
  trex.velocityY=0
  trex.changeAnimation("collided",trex_collided);
  score=0
  grupoCactus.setVelocityXEach(0)
  grupoNuvens.setVelocityXEach(0)
  grupoCactus.setLifetimeEach(-1)
  grupoNuvens.setLifetimeEach(-1)
  reiniciar.visible = true;
  jogoAcabou.visible = true;
  if(mousePressedOver(reiniciar)){
    grupoCactus.destroyEach();
    grupoNuvens.destroyEach();
    estadoJogo = JOGANDO
    trex.changeAnimation("running",trex_running);
  }
}
  drawSprites();
}

//função para gerar as nuvens
function spawnClouds(){
if(frameCount%150 === 0){
 var cloud = createSprite(550,100)
 cloud.addImage(cloudImage)
 cloud.velocityX=-2-score/100
 cloud.y=Math.round(random(125,10))
 cloud.scale=0.75
 cloud.lifetime=300
 cloud.depth=trex.depth-1
 trex.depth=trex.depth
 grupoNuvens.add(cloud);
 }
}
function spawnCactus(){
if(frameCount%120 === 0){
 var Cactus = createSprite(600,ground.y-10,30,40)
 Cactus.velocityX=-4-score/100
 Cactus.lifetime=500
 Cactus.scale=0.4
 var troca =  Math.round(random(1,6))
 switch(troca){
   case 1:Cactus.addImage(obstacle1);
   break;
   case 2:Cactus.addImage(obstacle2);
   break;
   case 3:Cactus.addImage(obstacle3);
   break;
   case 4:Cactus.addImage(obstacle4);
   break;
   case 5:Cactus.addImage(obstacle5);
   break;
   case 6:Cactus.addImage(obstacle6);
   break;
   default:break;
  }
 grupoCactus.add(Cactus)
 }
}
