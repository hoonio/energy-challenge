const METER_DIGIT = 3;

function calculateEnergyUsage(meterReadings) {
  // throw new Error('Not implemented');
  /*
     These tests should help you getting started.
     Input: each meter reading contains 3 properties:
      * cumulative: the meter reading number in kWh
      * quality: whether it is an Estimated or Manual reading. This is for information only
      * readingDate: the date at which the meter reading was provided.
    Output: at a minimum it should contain the energy usage and the period
      * energyUsage: the energy usage over the calculated period
      * from and to: date range the energy usage is calculated on
  */
  if (meterReadings.length < 2)
    return [];
  var calculatedEnergyUsage = [];
  var lastReading = meterReadings[0].cumulative;
  // what if the first value is NaN too?

  for (var i=1; i<meterReadings.length; i++) {
    var currentUsage = meterReadings[i].cumulative - lastReading;
    if (isNaN(meterReadings[i].cumulative)) {
      for (var j=i+1; j<meterReadings.length; j++) {
        if (!isNaN(meterReadings[j].cumulative)){
          currentUsage = (meterReadings[j].cumulative - lastReading)/(j-i+1);
          break;
        }
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


module.exports = calculateEnergyUsage;
