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
  vehicles[0].plan = [4, 0, 6, 3];
  vehicles[1].plan = [0, 1, 6, 3];
  vehicles[2].plan = [5, 1, 0, 4];
  vehicles[3].plan = [2, 3, 6];
  vehicles[4].plan = [5, 1, 2, 3];

  peoples.forEach(function(peep) {
    vehicles.forEach(function(car) {
      if(car.plan.includes(destinations[peep.destination])) {
        car.pick(peep);
      }
    });
  });

  vehicles.forEach(function(car) {
    var dest = car.plan[car.currentDestIndex || 0];
    if(car.x === buildings[dest].x && car.y === buildings[dest].y) {
      car.currentDestIndex = (car.currentDestIndex + 1) % car.plan.length;
      dest = car.plan[car.currentDestIndex || 0];
    }
    car.moveTo(buildings[dest]);
  });

}