//Create variables here
var database;
var dog,dogImage,dogImage1,food,foodImage,foodStock,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;

var value;
var milkimg,milkbottle;
function preload()
{
  //Load Images
  dogimage = loadImage("Dog.png");
  dogimage2 = loadImage("happy dog.png");
  milkimg = loadImage("Milk.png");
}

function setup() {
  createCanvas(700, 500);
  foodObj=new Food();
  //foodObj.updateFoodStock(20);

  //Create dog
  dog = createSprite(550,300);
  dog.addImage(dogimage);
  dog.scale = 0.2;

  database = firebase.database();

  //Add buttons to feed the dog and add food
  feed = createButton("Feed your dog");
  feed.position(650,150);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(580,150);
  addFood.mousePressed(addFoods);

  //Create milkbottle
  milkbottle = createSprite(470,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  
  foodObj.display();
  fedTime=database.ref('FeedTime');//Refer feedtime from database
  fedTime.on("value",function(data){//Change the feedtime according to realtime
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  //If statement to assign time
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 150,25);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",350,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 150,25);
   }
   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)
}
function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(dogimage);
  }
  else{
    dog.addImage(dogimage2);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(dogimage);
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}