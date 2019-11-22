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
  // vehicles[0].stopNames = ['F', 'B'];      // car1: F
  // vehicles[1].stopNames = ['B', 'F'];      // car2: B
  // vehicles[2].stopNames = ['C'];      // car3: C
  // vehicles[3].stopNames = ['E', 'D', 'A']; // car4: E D
  // vehicles[4].stopNames = ['A', 'G']; // car5: A G
  vehicles[0].stopNames = ['E'];      // car1: F     21
  vehicles[1].stopNames = ['A', 'D'];      // car2: B     19
  vehicles[2].stopNames = ['D', 'G'];      // car3: C    18
  vehicles[3].stopNames = ['E', 'A', 'G', 'A']; // car4: E D     20
  vehicles[4].stopNames = ['F', 'B', 'C', 'D']; // car5: A G   23
  
  vehicles.forEach(function(car, i) {

    car.nextStopName = car.nextStopName || car.stopNames[0];
    var distanceToNextStop = getDistance(car, getBuildingByName(buildings, car.nextStopName));
    if(distanceToNextStop < 1) {
      var newIndex = car.stopNames.indexOf(car.nextStopName);
      newIndex = ++newIndex % car.stopNames.length;
      car.nextStopName = car.stopNames[newIndex];
      distanceToNextStop = getDistance(car, getBuildingByName(buildings, car.nextStopName));
    }
  
    var closestPeep = null;
    var distanceToClosestPeep = 999;
    var timeLeft = car.peoples.reduce(function(time, peep) {
      return Math.min(peep.time, time);
    }, 999);

    if(car.peoples.length < 4 && timeLeft > 25) {
      peoples.forEach(function(peep) {
        walkDest = getBuildingByName(buildings, peep.destination);
        if(car.nextStopName === walkDest.name) {
          if(getDistance(car, peep) < 2) car.pick(peep); 

          walkDistance = getDistance(peep, walkDest);
          pickupDistance = getDistance(car, peep);
          if(peep.time > 50 && pickupDistance < distanceToClosestPeep) {
            distanceToClosestPeep = pickupDistance;
            closestPeep = peep;
          }
        }
      });
    }

    if(closestPeep) {
      console.log(closestPeep);
      moveCarToTarget(car, closestPeep);
      if(getDistance(car, closestPeep) < 2) {
        car.pick(closestPeep);
      }
    } else {
      car.moveTo(getBuildingByName(buildings, car.nextStopName));
    }
  });

}