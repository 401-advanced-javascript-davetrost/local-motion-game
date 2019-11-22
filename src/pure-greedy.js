var activeCustomers = [null, null, null, null, null];

function getDistance(obj1, obj2) {
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
}
function getBuildingByName(bldgs, name) {
  var destNames = { 'A': '0', 'B': '1', 'C': '2', 'D': '3', 'E': '4', 'F': '5', 'G': '6' };  
  return bldgs[destNames[name]];
}
function moveCarToTarget(car, target) {
  if(Math.abs(car.y - target.y) >= Math.abs(car.x - target.x)) {
    if(car.y < target.y) {
      car.moveDown();
    } else {
      car.moveUp();
    }
  }
  else {
    if(car.x < target.x) {
      car.moveRight();
    } else {
      car.moveLeft();
    }
  }
}

function turn(vehicles, peoples, buildings){

  vehicles.forEach(function(car, i) {

    if(car.peoples.length) {
      car.nextStopName = car.peoples[0].destination;
      activeCustomers[i] = car.peoples[0];
    }
    else {
      car.nextStopName = '';
      activeCustomers[i] = null;
    }

    var closestPeep = null;
    var distanceToClosestPeep = 999;
    peoples.forEach(function(peep) {
      if(!car.nextStopName && !activeCustomers.includes(peep) && peep.time > 30) {
        var pickupDistance = getDistance(car, peep);
        if(pickupDistance < distanceToClosestPeep) {
          distanceToClosestPeep = pickupDistance;
          activeCustomers[i] = peep;
          closestPeep = peep;
        }
      }

      if(car.nextStopName && car.nextStopName === peep.destination) {
        car.pick(peep);
      }
    });

    if(car.nextStopName) {
      car.moveTo(getBuildingByName(buildings, car.nextStopName));
    }
    else if(closestPeep) {
      moveCarToTarget(car, closestPeep);
      car.pick(closestPeep);
    }

  });
}