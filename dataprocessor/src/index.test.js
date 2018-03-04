const energyUsageCalculator = require('.');
const expect = require('chai').expect;

describe('Given a meter reading dataset', () => {
  describe('with perfect data the energy usage is correctly calculated', () => {
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
    it('simple case', () => {
      const meterReadings = [
        {
          cumulative: 100,
          quality: "Estimated",
          readingDate: "2017-01-01",
        },
        {
          cumulative: 150,
          quality: "Estimated",
          readingDate: "2017-02-01",
        }
      ];

      const expectedEnergyUsage = [
        {
          energyUsage: 50,
          from: "2017-01-01",
          to: "2017-02-01"
        }
      ];

      const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

      expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
    });

    it('more data', () => {
      /*
        Similar case to the previous one, except it contains more data.
      */
      const meterReadings = [
        {
          cumulative: 100,
          quality: "Estimated",
          readingDate: "2017-01-01",
        },
        {
          cumulative: 150,
          quality: "Estimated",
          readingDate: "2017-02-01",
        },
        {
          cumulative: 180,
          quality: "Estimated",
          readingDate: "2017-03-01",
        },
        {
          cumulative: 240,
          quality: "Estimated",
          readingDate: "2017-04-01",
        },
      ];

      const expectedEnergyUsage = [
        {
          energyUsage: 50,
          from: "2017-01-01",
          to: "2017-02-01"
        },
        {
          energyUsage: 30,
          from: "2017-02-01",
          to: "2017-03-01"
        },
        {
          energyUsage: 60,
          from: "2017-03-01",
          to: "2017-04-01"
        }
      ];

      const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

      expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
    });
  });

  describe('with badly formatted data point(s)', () => {
    /*
      In this test we consider the case where the meter reading is invalid, i.e. it is not a number.
      (You can see 1 bad data point below).
      In this case we still expect you to calculate the energy usage for the period with the bad data point.
      One simple implementation is to calculate the energy usage over the period containing the bad data points
      and return the average.
    */
    describe('then the energy usage is averaged over the period containing the bad data points', () => {
      it('1 bad data point', () => {
        const meterReadings = [
          {
            cumulative: 100,
            quality: "Estimated",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 'bad 1',
            quality: "Estimated",
            readingDate: "2017-02-01",
          },
          {
            cumulative: 200,
            quality: "Estimated",
            readingDate: "2017-03-01",
          }
        ];

        const expectedEnergyUsage = [
          {
            energyUsage: 50,
            from: "2017-01-01",
            to: "2017-02-01"
          },
          {
            energyUsage: 50,
            from: "2017-02-01",
            to: "2017-03-01"
          }
        ];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });

      it('a couple of bad data points', () => {
        const meterReadings = [
          {
            cumulative: 100,
            quality: "Estimated",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 'bad 1',
            quality: "Estimated",
            readingDate: "2017-02-01",
          },
          {
            cumulative: 'bad 2',
            quality: "Estimated",
            readingDate: "2017-03-01",
          },
          {
            cumulative: 250,
            quality: "Estimated",
            readingDate: "2017-04-01",
          },
          {
            cumulative: 310,
            quality: "Estimated",
            readingDate: "2017-05-01",
          },
        ];

        const expectedEnergyUsage = [
        {
          "energyUsage": 50,
          "from": "2017-01-01",
          "to": "2017-02-01"
        },
        {
          "energyUsage": 50,
          "from": "2017-02-01",
          "to": "2017-03-01"
        },
        {
          "energyUsage": 50,
          "from": "2017-03-01",
          "to": "2017-04-01"
        },
        {
          "energyUsage": 60,
          "from": "2017-04-01",
          "to": "2017-05-01"
        }
       ];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });
    });
  });

  describe('with decreasing meter readings', () => {
    /*
      In this test we consider the case where a meter reading is smaller than the previous one.
      In practice, this happens when estimated meter readings are calculated based on a higher than reality energy usage.
      A manual meter reading submitted at t+T might be lower than the previously estimated meter reading at t.

      In this case we still expect you to calculate the energy usage for that period.
      You can use the same method as with the bad data point and calculate the average.
    */
    describe('then the higher meter reading is ignored and the energy usage is averaged', () => {
      it('simple case', () => {
        const meterReadings = [
          {
            cumulative: 100,
            quality: "Manual",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 250,
            quality: "Estimated",
            readingDate: "2017-02-01",
          },
          {
            cumulative: 200,
            quality: "Manual",
            readingDate: "2017-03-01",
          }
        ];

        const expectedEnergyUsage = [
          {
            energyUsage: 50,
            from: "2017-01-01",
            to: "2017-02-01"
          },
          {
            energyUsage: 50,
            from: "2017-02-01",
            to: "2017-03-01"
          }
        ];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });

      it('larger dataset', () => {
        const meterReadings = [
          {
            cumulative: 110,
            quality: "Estimated",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 210,
            quality: "Estimated",
            readingDate: "2017-02-01",
          },
          {
            cumulative: 250,
            quality: "Estimated",
            readingDate: "2017-03-01",
          },
          {
            cumulative: 200,
            quality: "Manual",
            readingDate: "2017-04-01",
          },
          {
            cumulative: 350,
            quality: "Estimated",
            readingDate: "2017-05-01",
          },
        ];

        const expectedEnergyUsage = [ { energyUsage: 30, from: '2017-01-01', to: '2017-02-01' },
          { energyUsage: 30, from: '2017-02-01', to: '2017-03-01' },
          { energyUsage: 30, from: '2017-03-01', to: '2017-04-01' },
          { energyUsage: 150, from: '2017-04-01', to: '2017-05-01' }
        ];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });
    });
  });

  describe('with meter roll over', () => {
    /*
      In this final test we consider the case where a meter read rolls over.
      Meter read have a finite number of digits so when they reach their maximum reading number,
      they roll over and start from 0 again.

      For this test you can assume that a meter read has no more than 3 digits.
    */
    describe('the energy usage is correctly calculated', () => {
      it('simple case', () => {
        const meterReadings = [
          {
            cumulative: 960,
            quality: "Estimated",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 20,
            quality: "Estimated",
            readingDate: "2017-02-01",
          }
        ];

        const expectedEnergyUsage = [
          {
            energyUsage: 60,
            from: "2017-01-01",
            to: "2017-02-01"
          }
        ];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });

      it('roll over and bad data', () => {
        const meterReadings = [
          {
            cumulative: 890,
            quality: "Estimated",
            readingDate: "2017-01-01",
          },
          {
            cumulative: 960,
            quality: "Estimated",
            readingDate: "2017-02-01",
          },
          {
            cumulative: 20,
            quality: "Estimated",
            readingDate: "2017-03-01",
          },
          {
            cumulative: 'bad point',
            quality: "Estimated",
            readingDate: "2017-04-01",
          },
          {
            cumulative: 140,
            quality: "Estimated",
            readingDate: "2017-05-01",
          },
        ];

        const expectedEnergyUsage = ['TO BE EDITED'];

        const calculatedEnergyUsage = energyUsageCalculator(meterReadings);

        expect(calculatedEnergyUsage).to.deep.equal(expectedEnergyUsage);
      });
    });
  });
});
