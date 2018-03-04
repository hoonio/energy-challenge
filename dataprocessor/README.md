# Meter Reading Data Processing

## Overview

A package for processing meter readings and calculating energy usage.

## Useful Information

### Meter reading
A meter reading is a number in kWh shown by a meter (e.g. electricity meter).
It is used to calculate the energy usage of the location it is installed at using a simple calculation:
```
  Energy Usage(period T) = MeterReading(t+T) - MeterReading(t)
```


## Task

The goal of this task is to convert meter readings to energy usage.
In theory it is a simple task that should be reduced to the single calculation above.
However, in practice, one must deal with bad data and implementation limitation.

We ask you to implement a meter reading processor that addresses some of these problems. We have written some [test cases](./src/index.test.js) for each of them. Your task is to make them pass. Feel free to add more tests for cases that are not covered.
Each test contains the input meter readings and a description of the problem to tackle. Some tests also contain the expected energy usage, it should guide you in your implementation.

With this task, we aime to test your reasoning and get a sense of your coding style.
You should feel free to make your own decisions, e.g. around solving error or edge cases, but don't forget to explain us you reasoning.

## Setup
```
$ yarn install
```

## Start
```
$ yarn test
```
