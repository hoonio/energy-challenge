const METER_DIGIT = 3;

function calculateEnergyUsage(meterReadings) {
  // throw new Error('Not implemented');
  if (meterReadings.length < 2)
    return [];
  var calculatedEnergyUsage = [];
  var lastReading = meterReadings[0].cumulative;
  // what if the first value is NaN too?

  for (var i=1; i<meterReadings.length; i++) {
    var thisReading = meterReadings[i].cumulative;
    var currentUsage = thisReading - lastReading;
    if (isNaN(thisReading)) {
      currentUsage = fixBadReading(meterReadings, i, lastReading);
    }
    else if (thisReading < lastReading){
      if (meterReadings[i].quality == "Manual" && meterReadings[i-1].quality == "Estimated") {
        var periodFixCount = 1;
        for (var j=i-1; j>=0; j--){
          if (meterReadings[j].cumulative > thisReading && meterReadings[j].quality == "Estimated"){
            periodFixCount++;
          }
          else {
            lastReading = meterReadings[j].cumulative;
            break;
          }
        }
        currentUsage = (thisReading - lastReading)/periodFixCount;
        for (var j=i-periodFixCount; j<i-1; j++){
          calculatedEnergyUsage[j].energyUsage = currentUsage;
          lastReading += currentUsage;
        }
      }
      else {
        // rollover case
        currentUsage = (thisReading - lastReading)+1000
      }
    }

    calculatedEnergyUsage.push({
      energyUsage: currentUsage,
      from: meterReadings[i-1].readingDate,
      to: meterReadings[i].readingDate
    })
    lastReading += currentUsage;
  }
  return calculatedEnergyUsage;
}

function fixBadReading(meterReadings, sequence, lastReading) {
  for (var j=sequence+1; j<meterReadings.length; j++) {
    if (!isNaN(meterReadings[j].cumulative)){
      return (meterReadings[j].cumulative - lastReading)/(j-sequence+1);
    }
  }
}

function fixDescendReading(){
  // fix for decreasing meter reading should execute retrospectively unless the loop runs in reverse...

}

module.exports = calculateEnergyUsage;
