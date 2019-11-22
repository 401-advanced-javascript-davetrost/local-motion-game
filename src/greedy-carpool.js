function turn(vehicles, peoples, buildings){

  vehicles.forEach(function(car) {
    if(car.peoples.length) {
      var nextStopName = mostLucrativeStopName(car);
      car.moveTo(getBuildingByName(buildings, nextStopName));
    }

    else {
      var nextPassenger = bestClosestPassenger(car);
      if(nextPassenger) moveCarToTarget(car, nextPassenger);
    }

    pickUpAllAvailablePassengers(car);
  });

  function pickUpAllAvailablePassengers(car) {
    peoples.forEach(function(peep) {
      car.pick(peep);
    });
  }

  /* choose the next building based on the number of paying customers in the car */
  function mostLucrativeStopName(car) {
    var nextStopName = '';
    var distanceToNextStop = 999;

    car.peoples.forEach(function(peep) {
      var destinationBuilding = getBuildingByName(buildings, peep.destination);
      var numberOfPeepsForThisStop = countPeepsWithSharedDest(car, peep);
      var stopDistance = getDistance(car, destinationBuilding) / numberOfPeepsForThisStop;
      if(stopDistance < distanceToNextStop) {
        distanceToNextStop = stopDistance;
        nextStopName = peep.destination;
      }
    });

    return nextStopName;
  }

  function countPeepsWithSharedDest(car, peep) {
    return (car.peoples.reduce(function(count, p) {
      return (p.destination === peep.destination) ? count + 1 : count;
    }, 0) || 1);
  }
  
  /* determine the closest customer who is likely to take a ride */
  function bestClosestPassenger(car) {
    var passengerTimeLeft = 30;
    var closestPeep = null;
    var distanceToClosestPeep = 999;

    peoples.forEach(function(peep) {
      var pickupDistance = getDistance(car, peep);
      if(pickupDistance < distanceToClosestPeep && peep.time > passengerTimeLeft) {
        distanceToClosestPeep = pickupDistance;
        closestPeep = peep;
      }
      car.pick(peep);
    });
    
    return closestPeep;
  }

}

function getBuildingByName(bldgs, name) {
  var destNames = { A: '0', B: '1', C: '2', D: '3', E: '4', F: '5', G: '6' };  
  return bldgs[destNames[name]];
}
function getDistance(obj1, obj2) {
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
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
