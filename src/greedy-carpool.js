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

  vehicles.forEach(function(car) {

    // passengers case
    var nextStopName = '';
    var distanceToNextStop = 999;
    if(car.peoples.length) {
      car.peoples.forEach(function(peep) {
        var sameDestinations = car.peoples.reduce(function(count, p) {
          return (p.destination === peep.destination) ? count + 1 : count; 
        }, 0);
        var stopDistance = getDistance(car, getBuildingByName(buildings, peep.destination)) / (sameDestinations || 1);
        if(stopDistance < distanceToNextStop) {
          distanceToNextStop = stopDistance;
          nextStopName = peep.destination;
        }
      });
    }

    if(nextStopName) {
      car.moveTo(getBuildingByName(buildings, nextStopName));
      peoples.forEach(function(peep) {
        car.pick(peep);
      });
      return;
    }


    // no passengers case
    var closestPeep = null;
    var distanceToClosestPeep = 999;
    peoples.forEach(function(peep) {
      car.pick(peep);

      var pickupDistance = getDistance(car, peep);
      if(pickupDistance < distanceToClosestPeep && peep.time > 30) {
        distanceToClosestPeep = pickupDistance;
        closestPeep = peep;
      }
    });

    if(closestPeep) {
      moveCarToTarget(car, closestPeep);
      car.pick(closestPeep);
      return;
    }

  });
}