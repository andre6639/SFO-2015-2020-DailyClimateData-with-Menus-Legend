import React, { useState, useEffect } from 'react';
import { csv } from 'd3';
const csvUrl =
  'https://gist.githubusercontent.com/andre6639/d1c2a41f82286e210bfaa2e158117b4a/raw/49de362c1f2762ccd9c1934c3afb850985983d60/SFO_dailyClimate_data_2015thr2020_concise.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.DATE = new Date(d.DATE);
      d.DailyPeakWindSpeed = +d.DailyPeakWindSpeed;
      d.DailyAverageWindSpeed = +d.DailyAverageWindSpeed;
      d.DailyAverageStationPressure = +d.DailyAverageStationPressure;
      d.DailyPeakWindDirection = +d.DailyPeakWindDirection;
      d.DailySustainedWindDirection = +d.DailySustainedWindDirection;
      d.DailySustainedWindSpeed = +d.DailySustainedWindSpeed;
      d.DailyDepartureFromNormalAverageTemperature= +d.DailyDepartureFromNormalAverageTemperature;
      d.NAME = d.NAME;
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};
