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

    var distanceToClosestDest = 999;
    car.peoples.forEach(function(peep) {
      var d = getDistance(car, getBuildingByName(buildings, peep.destination));
      if(d < distanceToClosestDest) {
        distanceToClosestDest = d;
        car.nextStopName = peep.destination;
      }
    });
    if(distanceToClosestDest === 999 || distanceToClosestDest < 1) {
      car.nextStopName = '';
      activeCustomers[i] = null;
    }

    var closestPeep = null;
    var distanceToClosestPeep = 999;
    peoples.forEach(function(peep) {
      if(!car.nextStopName && !activeCustomers.includes(peep)) {
        var pickupDistance = getDistance(car, peep);
        if(pickupDistance < distanceToClosestPeep) {
          distanceToClosestPeep = pickupDistance;
          activeCustomers[i] = peep;
          closestPeep = peep;
          console.log(peep);
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