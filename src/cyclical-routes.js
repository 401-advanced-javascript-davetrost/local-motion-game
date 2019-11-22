/*You win the game if you can collect more than $10,000 in 1000 turns.*/
var destinations = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6
};

function turn(vehicles, peoples, buildings){
  vehicles[0].plan = [5, 0, 1, 4];   // car1: F A B E
  vehicles[1].plan = [1, 4, 6, 3];   // car2: B E G D
  vehicles[2].plan = [1, 4, 2, 6, 0];   // car3: B E C G A
  vehicles[3].plan = [6, 3, 2, 6];   // car4: G D C D
  vehicles[4].plan = [0, 3, 0, 4, 0, 6];   // car5: A D A E A G
  vehicles[0].currentDestIndex = vehicles[0].currentDestIndex || 0;
  vehicles[1].currentDestIndex = vehicles[1].currentDestIndex || 0;
  vehicles[2].currentDestIndex = vehicles[2].currentDestIndex || 0;
  vehicles[3].currentDestIndex = vehicles[3].currentDestIndex || 0;
  vehicles[4].currentDestIndex = vehicles[4].currentDestIndex || 0;

  vehicles.forEach(function(car, i) {
    car.canMove = true;
    if(car.peoples.length > 0) console.log('(hoped) car', i + 1, 'has', car.peoples.length, 'peeps at', car.x, car.y, 'going to dest', car.currentDestIndex);
    car.peoples.forEach(function(peep) {
      if(!car.plan.includes(destinations[peep.destination])) console.log('(hoped) car ', i + 1, 'has a peep outside the plan');
    });
  });

  peoples.forEach(function(peep) {
    if(peep.time >= 30) {
      var bldDest = buildings[destinations[peep.destination]];
      peep.spacesToDest = Math.abs(peep.x - bldDest.x) + Math.abs(peep.y - bldDest.y);
      vehicles.forEach(function(car, i) {
        if(car.peoples.length < 4) {
          if(car.plan.includes(destinations[peep.destination])) {

            if(Math.abs(peep.x - car.x) === 1 && peep.y === car.y) car.pick(peep);

            if(peep.x === car.x && peep.y === car.y) {
              if(car.canMove) {
                var dest = car.plan[car.currentDestIndex || 0];
                car.moveTo(buildings[dest]);
                car.canMove = false;
                car.pick(peep);
              }
            }

          }
        }
      });
    }
  });

  vehicles.forEach(function(car, i) {
    var dest = car.plan[car.currentDestIndex || 0];
    if(car.x === buildings[dest].x && car.y === buildings[dest].y) {
      car.currentDestIndex++;
      car.currentDestIndex = car.currentDestIndex % car.plan.length;
      dest = car.plan[car.currentDestIndex || 0];
    }
    if(car.canMove) car.moveTo(buildings[dest]);
  });

}