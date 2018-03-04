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
  console.log(meterReadings)
  if (meterReadings.length < 2)
    return [];
  var calculatedEnergyUsage = [];

  for (var i=1; i<meterReadings.length; i++) {
    calculatedEnergyUsage.push({
      energyUsage: meterReadings[i].cumulative - meterReadings[i-1].cumulative,
      from: meterReadings[i-1].readingDate,
      to: meterReadings[i].readingDate
    })
  }

  return calculatedEnergyUsage;
}


module.exports = calculateEnergyUsage;
