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
  vehicles[0].stopNames = ['A', 'B', 'E'];
  vehicles[1].stopNames = ['B', 'B', 'G'];
  vehicles[2].stopNames = ['D', 'E', 'F', 'E'];
  vehicles[3].stopNames = ['B', 'C'];
  vehicles[4].stopNames = ['F', 'G'];

  vehicles.forEach(function(car) {

    car.nextStopName = car.nextStopName || car.stopNames[0];
    var distanceToNextStop = getDistance(car, getBuildingByName(buildings, car.nextStopName));
    if(distanceToNextStop < 1) {
      var newIndex = car.stopNames.indexOf(car.nextStopName);
      newIndex = ++newIndex % car.stopNames.length;
      car.nextStopName = car.stopNames[newIndex];
      distanceToNextStop = getDistance(car, getBuildingByName(buildings, car.nextStopName));
    }
  
    var closestPeep = null;
    var closePeeps = [];
    var distanceToClosestPeep = 999;
    var timeLeft = car.peoples.reduce(function(time, peep) {
      return Math.min(peep.time, time);
    }, 999);

    if(car.peoples.length < 4 && timeLeft - 5 > distanceToNextStop) {
      peoples.forEach(function(peep) {
        var walkDest = getBuildingByName(buildings, peep.destination);
        if(car.stopNames.includes(walkDest.name)) {
    
          var pickupDistance = getDistance(car, peep);
          if(pickupDistance < 4) {
            car.pick(peep);
            closePeeps.push(peep);
            
            if(pickupDistance < distanceToClosestPeep) {
              distanceToClosestPeep = pickupDistance;
              closestPeep = peep;
            }
          }
        }
      });
    }

    closePeeps.forEach(function(peep) {
      car.pick(peep);
    });

    if(closestPeep) {
      // console.log(closestPeep);
      moveCarToTarget(car, closestPeep);
      car.pick(closestPeep);
    } else {
      car.moveTo(getBuildingByName(buildings, car.nextStopName));
    }
  });

}