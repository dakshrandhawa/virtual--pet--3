//Create variables here
var dog,dogImage,dogHappy, database, foodS, foodStock,feed,addFood;
//var foodStock , lastFed;
var feedDog,addFood;
var fedTime, lastFed;
var foodObj;
var changingGameState , readingGameState;
// images for dog's background
var bedroomImg,gardenImg,washroomImg;
var gameState="";
var dogSad,dogLazy;


function preload()
{
	//dog Images
  dogImage=loadImage("images/dogImg.png");
  dogHappy=loadImage("images/dogImg1.png");
  dogSad=loadImage("images/Vaccination.jpg")
  dogLazy=loadImage("images/Lazy.png");
  //rooms images
  bedroomImg=loadImage("images/Bed Room.png");
  gardenImg=loadImage("images/Garden.png");
  washroomImg=loadImage("images/Wash Room.png");
  
}

function setup() {
  database = firebase.database();
	createCanvas(1100, 500);

  dog=createSprite(550,380,10,10);
  dog.addImage(dogImage);
  dog.scale=0.2;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed The Dog");
  feed.position(800,80);
  feed.mousePressed(feedDog)

  
  
  addFood=createButton("Add Food");
  addFood.position(900,80);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  

  foodObj= new Food();




}

function draw() {  
  background(46, 139, 87);

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.addImage(dogLazy);
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogSad);
  }



  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed:"+lastFed%12 + "PM",450,20);
  }
  else if(lastFed==0){
    text("Last Feed: 12 AM",450,20);
  }
  else{
    text("Last Feed:"+lastFed+"AM",450,20);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  drawSprites();
}



function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
} 

function feedDog(){
  dog.addImage(dogHappy);
  
  dog.x=dog.x-5;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  dog.x=dog.x+5;
  database.ref('/').update({
    Food:foodS
  })
 
}

 if(foodObj<0){
    dog.addImage(dogImage);

  }


function update(state){
  database.ref('/').update({
    gameState:state
  });
}

