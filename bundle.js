(function (React$1, ReactDOM, d3, ReactDropdown) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;
  ReactDropdown = ReactDropdown && Object.prototype.hasOwnProperty.call(ReactDropdown, 'default') ? ReactDropdown['default'] : ReactDropdown;

  const csvUrl =
    'https://gist.githubusercontent.com/andre6639/d1c2a41f82286e210bfaa2e158117b4a/raw/49de362c1f2762ccd9c1934c3afb850985983d60/SFO_dailyClimate_data_2015thr2020_concise.csv';

  const useData = () => {
    const [data, setData] = React$1.useState(null);

    React$1.useEffect(() => {
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
      d3.csv(csvUrl, row).then(setData);
    }, []);

    return data;
  };

  const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) =>
    xScale.ticks().map(tickValue => (
      React.createElement( 'g', {
        className: "tick", key: tickValue, transform: `translate(${xScale(tickValue)},0)` },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: 'middle' }, dy: ".71em", y: innerHeight + tickOffset },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisLeft = ({ yScale, innerWidth, tickValue, tickOffset = 3 }) =>
    yScale.ticks().map((tickValue) => (
      React.createElement( 'g', { className: "tick", transform: `translate(0,${yScale(tickValue)})` },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".32em" },
          tickValue
        )
      )
    ));

  const Marks = ({
    data,
    xScale,
    yScale,
    xValue,
    yValue,
    colorScale,
    colorValue,
    circleRadius,
    tooltipFormat,
  }) =>
    data.map((d) => (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), fill: colorScale(colorValue(d)), r: circleRadius },
        React.createElement( 'title', null, tooltipFormat(yValue(d)) )
      )
    ));

  const ColorLegend = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${i * tickSpacing})`, onMouseEnter: () => { onHover(domainValue); }, onMouseOut: () => { onHover(null); }, opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
        React.createElement( 'circle', { fill: colorScale(domainValue), r: tickSize }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ));

  const width = 960;
  const height = 500;
  const margin = { top: 20, right: 200, bottom: 85, left: 110 };
  const xAxisLabelOffset = 65;
  const yAxisLabelOffset = 52;
  const fadeOpacity = 0.2;

  const attributes = [
    {
      value: 'DailyAverageRelativeHumidity',
      label: 'Daily Average Relative Humidity',
    },
    { value: 'DailyAverageWindSpeed', label: 'Daily Average Wind Speed' },
    { value: 'DailyPeakWindDirection', label: 'Daily Peak Wind Direction' },
    { value: 'DailyPeakWindSpeed', label: 'Daily Peak Wind Speed' },
    {
      value: 'DailySustainedWindDirection',
      label: 'Daily Sustained Wind Direction',
    },
    { value: 'DailySustainedWindSpeed', label: 'Daily Sustained Wind Speed' },
    {
      value: 'DailyDepartureFromNormalAverageTemperature',
      label: 'Daily Departure From Normal Average Temperature',
    },
  ];

  const getLabel = (value) => {
    for (let i = 0; i < attributes.length; i++) {
      if (attributes[i].value === value) {
        return attributes[i].label;
      }
    }
  };

  const App = () => {
    const data = useData();
    const [hoveredValue, setHoveredValue] = React$1.useState(null);
    console.log(hoveredValue);

    const initialYAttribute = 'DailyAverageWindSpeed';
    const [yAttribute, setYAttribute] = React$1.useState(initialYAttribute);

    if (!data) {
      return React$1__default.createElement( 'pre', null, "Loading..." );
    }

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = (d) => d.DATE;
    const xAxisLabel = '';
    const yValue = (d) => d[yAttribute];
    const yAxisLabel = getLabel(yAttribute);

    const colorValue = (d) => d.NAME;
    const colorLegendLabel = 'Station';

    const filteredData = data.filter((d) => hoveredValue === colorValue(d));

    const circleRadius = 5;

    const siFormat = d3.format('.2s');
    const xAxisTickFormat = d3.timeFormat('%Y');
    const yAxisTickFormat = d3.format(' ');

    console.log(data);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(colorValue))
      .range(['#137B80']);

    return (
      React$1__default.createElement( React$1__default.Fragment, null,
        React$1__default.createElement( 'div', { className: "menus-container" },
          React$1__default.createElement( ReactDropdown, {
            options: attributes, id: "y-select", value: yAttribute, onChange: ({ value }) => setYAttribute(value) })
        ),
        React$1__default.createElement( 'svg', { width: width, height: height },
          React$1__default.createElement( 'g', { transform: `translate(${margin.left},${margin.top})` },
            React$1__default.createElement( AxisBottom, {
              xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 7 }),
            React$1__default.createElement( 'text', {
              className: "axis-label", textAnchor: "middle", transform: `translate(${-yAxisLabelOffset}, 
          ${innerHeight / 2}) rotate(-90)` },
              yAxisLabel
            ),
            React$1__default.createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth, tickOffset: 7 }),
            React$1__default.createElement( 'text', {
              className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
              xAxisLabel
            ),
            React$1__default.createElement( 'g', { transform: `translate(${innerWidth + 60}, 60)` },
              React$1__default.createElement( 'text', { x: 35, y: -25, className: "axis-label", textAnchor: "middle" },
                colorLegendLabel
              ),
              React$1__default.createElement( 'g', null,
                React$1__default.createElement( ColorLegend, {
                  tickSpacing: 25, tickSize: 10, tickTextOffset: 20, tickSize: circleRadius, colorScale: colorScale, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity })
              ),
              React$1__default.createElement( ColorLegend, {
                tickSpacing: 25, tickSize: 10, tickTextOffset: 20, tickSize: circleRadius, colorScale: colorScale, onHover: setHoveredValue })
            ),
            React$1__default.createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1 },
              React$1__default.createElement( Marks, {
                data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: yAxisTickFormat, circleRadius: circleRadius })
            ),
            React$1__default.createElement( Marks, {
              data: filteredData, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: yAxisTickFormat, circleRadius: circleRadius })
          )
        )
      )
    );
  };
  const rootElement = document.getElementById('root');
  ReactDOM.render(React$1__default.createElement( App, null ), rootElement);

  // for doing arcs
  //(data).map((d, i) => (
  //        <path fill={d['RGB hex value']} d={pieArc({
  //              startAngle: i / data.length * 2 * Math.PI,
  //  					  endAngle: (i+1) / data.length * 2 * Math.PI
  //            })}/>

}(React, ReactDOM, d3, ReactDropdown));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZURhdGEuanMiLCJBeGlzQm90dG9tLmpzIiwiQXhpc0xlZnQuanMiLCJNYXJrcy5qcyIsIkNvbG9yTGVnZW5kLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5jb25zdCBjc3ZVcmwgPVxuICAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9hbmRyZTY2MzkvZDFjMmE0MWY4MjI4NmUyMTBiZmFhMmUxNTgxMTdiNGEvcmF3LzQ5ZGUzNjJjMWYyNzYyY2NkOWMxOTM0YzNhZmI4NTA5ODU5ODNkNjAvU0ZPX2RhaWx5Q2xpbWF0ZV9kYXRhXzIwMTV0aHIyMDIwX2NvbmNpc2UuY3N2JztcblxuZXhwb3J0IGNvbnN0IHVzZURhdGEgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgcm93ID0gKGQpID0+IHtcbiAgICAgIGQuREFURSA9IG5ldyBEYXRlKGQuREFURSk7XG4gICAgICBkLkRhaWx5UGVha1dpbmRTcGVlZCA9ICtkLkRhaWx5UGVha1dpbmRTcGVlZDtcbiAgICAgIGQuRGFpbHlBdmVyYWdlV2luZFNwZWVkID0gK2QuRGFpbHlBdmVyYWdlV2luZFNwZWVkO1xuICAgICAgZC5EYWlseUF2ZXJhZ2VTdGF0aW9uUHJlc3N1cmUgPSArZC5EYWlseUF2ZXJhZ2VTdGF0aW9uUHJlc3N1cmU7XG4gICAgICBkLkRhaWx5UGVha1dpbmREaXJlY3Rpb24gPSArZC5EYWlseVBlYWtXaW5kRGlyZWN0aW9uO1xuICAgICAgZC5EYWlseVN1c3RhaW5lZFdpbmREaXJlY3Rpb24gPSArZC5EYWlseVN1c3RhaW5lZFdpbmREaXJlY3Rpb247XG4gICAgICBkLkRhaWx5U3VzdGFpbmVkV2luZFNwZWVkID0gK2QuRGFpbHlTdXN0YWluZWRXaW5kU3BlZWQ7XG4gICAgICBkLkRhaWx5RGVwYXJ0dXJlRnJvbU5vcm1hbEF2ZXJhZ2VUZW1wZXJhdHVyZT0gK2QuRGFpbHlEZXBhcnR1cmVGcm9tTm9ybWFsQXZlcmFnZVRlbXBlcmF0dXJlO1xuICAgICAgZC5OQU1FID0gZC5OQU1FO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfTtcbiAgICBjc3YoY3N2VXJsLCByb3cpLnRoZW4oc2V0RGF0YSk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCJleHBvcnQgY29uc3QgQXhpc0JvdHRvbSA9ICh7IHhTY2FsZSwgaW5uZXJIZWlnaHQsIHRpY2tGb3JtYXQsIHRpY2tPZmZzZXQgPSAzIH0pID0+XG4gIHhTY2FsZS50aWNrcygpLm1hcCh0aWNrVmFsdWUgPT4gKFxuICAgIDxnXG4gICAgICBjbGFzc05hbWU9XCJ0aWNrXCJcbiAgICAgIGtleT17dGlja1ZhbHVlfVxuICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7eFNjYWxlKHRpY2tWYWx1ZSl9LDApYH1cbiAgICA+XG4gICAgICA8bGluZSB5Mj17aW5uZXJIZWlnaHR9IC8+XG4gICAgICA8dGV4dCBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnbWlkZGxlJyB9fSBkeT1cIi43MWVtXCIgeT17aW5uZXJIZWlnaHQgKyB0aWNrT2Zmc2V0fT5cbiAgICAgICAge3RpY2tGb3JtYXQodGlja1ZhbHVlKX1cbiAgICAgIDwvdGV4dD5cbiAgICA8L2c+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IEF4aXNMZWZ0ID0gKHsgeVNjYWxlLCBpbm5lcldpZHRoLCB0aWNrVmFsdWUsIHRpY2tPZmZzZXQgPSAzIH0pID0+XG4gIHlTY2FsZS50aWNrcygpLm1hcCgodGlja1ZhbHVlKSA9PiAoXG4gICAgPGcgY2xhc3NOYW1lPVwidGlja1wiIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgwLCR7eVNjYWxlKHRpY2tWYWx1ZSl9KWB9PlxuICAgICAgPGxpbmUgeDI9e2lubmVyV2lkdGh9IC8+XG4gICAgICA8dGV4dFxuICAgICAgICBrZXk9e3RpY2tWYWx1ZX1cbiAgICAgICAgc3R5bGU9e3sgdGV4dEFuY2hvcjogJ2VuZCcgfX1cbiAgICAgICAgeD17LXRpY2tPZmZzZXR9XG4gICAgICAgIGR5PVwiLjMyZW1cIlxuICAgICAgPlxuICAgICAgICB7dGlja1ZhbHVlfVxuICAgICAgPC90ZXh0PlxuICAgIDwvZz5cbiAgKSk7XG4iLCJleHBvcnQgY29uc3QgTWFya3MgPSAoe1xuICBkYXRhLFxuICB4U2NhbGUsXG4gIHlTY2FsZSxcbiAgeFZhbHVlLFxuICB5VmFsdWUsXG4gIGNvbG9yU2NhbGUsXG4gIGNvbG9yVmFsdWUsXG4gIGNpcmNsZVJhZGl1cyxcbiAgdG9vbHRpcEZvcm1hdCxcbn0pID0+XG4gIGRhdGEubWFwKChkKSA9PiAoXG4gICAgPGNpcmNsZVxuICAgICAgY2xhc3NOYW1lPVwibWFya1wiXG4gICAgICBjeD17eFNjYWxlKHhWYWx1ZShkKSl9XG4gICAgICBjeT17eVNjYWxlKHlWYWx1ZShkKSl9XG4gICAgICBmaWxsPXtjb2xvclNjYWxlKGNvbG9yVmFsdWUoZCkpfVxuICAgICAgcj17Y2lyY2xlUmFkaXVzfVxuICAgID5cbiAgICAgIDx0aXRsZT57dG9vbHRpcEZvcm1hdCh5VmFsdWUoZCkpfTwvdGl0bGU+XG4gICAgPC9jaXJjbGU+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IENvbG9yTGVnZW5kID0gKHtcbiAgY29sb3JTY2FsZSxcbiAgdGlja1NwYWNpbmcgPSAyMCxcbiAgdGlja1NpemUgPSAxMCxcbiAgdGlja1RleHRPZmZzZXQgPSAyMCxcbiAgb25Ib3ZlcixcbiAgaG92ZXJlZFZhbHVlLFxuICBmYWRlT3BhY2l0eVxufSkgPT5cbiAgY29sb3JTY2FsZS5kb21haW4oKS5tYXAoKGRvbWFpblZhbHVlLCBpKSA9PiAoXG4gICAgPGdcbiAgICAgIGNsYXNzTmFtZT1cInRpY2tcIlxuICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKDAsJHtpICogdGlja1NwYWNpbmd9KWB9XG4gICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHsgb25Ib3Zlcihkb21haW5WYWx1ZSk7IH19XG4gICAgICBvbk1vdXNlT3V0PXsoKSA9PiB7IG9uSG92ZXIobnVsbCk7IH19XG4gICAgICBvcGFjaXR5PXtob3ZlcmVkVmFsdWUgJiYgZG9tYWluVmFsdWUgIT09IGhvdmVyZWRWYWx1ZSA/IGZhZGVPcGFjaXR5IDogMSB9XG4gICAgPlxuICAgICAgPGNpcmNsZSBmaWxsPXtjb2xvclNjYWxlKGRvbWFpblZhbHVlKX0gcj17dGlja1NpemV9IC8+XG4gICAgICA8dGV4dCB4PXt0aWNrVGV4dE9mZnNldH0gZHk9XCIuMzJlbVwiPlxuICAgICAgICB7ZG9tYWluVmFsdWV9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHtcbiAgY3N2LFxuICBzY2FsZU9yZGluYWwsXG4gIHNjYWxlTGluZWFyLFxuICBzY2FsZVRpbWUsXG4gIG1heCxcbiAgZm9ybWF0LFxuICB0aW1lRm9ybWF0LFxuICB0b29sdGlwLFxuICBleHRlbnQsXG59IGZyb20gJ2QzJztcbmltcG9ydCBSZWFjdERyb3Bkb3duIGZyb20gJ3JlYWN0LWRyb3Bkb3duJztcbmltcG9ydCB7IHVzZURhdGEgfSBmcm9tICcuL3VzZURhdGEnO1xuaW1wb3J0IHsgQXhpc0JvdHRvbSB9IGZyb20gJy4vQXhpc0JvdHRvbSc7XG5pbXBvcnQgeyBBeGlzTGVmdCB9IGZyb20gJy4vQXhpc0xlZnQnO1xuaW1wb3J0IHsgTWFya3MgfSBmcm9tICcuL01hcmtzJztcbmltcG9ydCB7IERyb3Bkb3duIH0gZnJvbSAnLi9Ecm9wZG93bic7XG5pbXBvcnQgeyBDb2xvckxlZ2VuZCB9IGZyb20gJy4vQ29sb3JMZWdlbmQnO1xuXG5jb25zdCB3aWR0aCA9IDk2MDtcbmNvbnN0IGhlaWdodCA9IDUwMDtcbmNvbnN0IG1hcmdpbiA9IHsgdG9wOiAyMCwgcmlnaHQ6IDIwMCwgYm90dG9tOiA4NSwgbGVmdDogMTEwIH07XG5jb25zdCB4QXhpc0xhYmVsT2Zmc2V0ID0gNjU7XG5jb25zdCB5QXhpc0xhYmVsT2Zmc2V0ID0gNTI7XG5jb25zdCBmYWRlT3BhY2l0eSA9IDAuMjtcblxuY29uc3QgYXR0cmlidXRlcyA9IFtcbiAge1xuICAgIHZhbHVlOiAnRGFpbHlBdmVyYWdlUmVsYXRpdmVIdW1pZGl0eScsXG4gICAgbGFiZWw6ICdEYWlseSBBdmVyYWdlIFJlbGF0aXZlIEh1bWlkaXR5JyxcbiAgfSxcbiAgeyB2YWx1ZTogJ0RhaWx5QXZlcmFnZVdpbmRTcGVlZCcsIGxhYmVsOiAnRGFpbHkgQXZlcmFnZSBXaW5kIFNwZWVkJyB9LFxuICB7IHZhbHVlOiAnRGFpbHlQZWFrV2luZERpcmVjdGlvbicsIGxhYmVsOiAnRGFpbHkgUGVhayBXaW5kIERpcmVjdGlvbicgfSxcbiAgeyB2YWx1ZTogJ0RhaWx5UGVha1dpbmRTcGVlZCcsIGxhYmVsOiAnRGFpbHkgUGVhayBXaW5kIFNwZWVkJyB9LFxuICB7XG4gICAgdmFsdWU6ICdEYWlseVN1c3RhaW5lZFdpbmREaXJlY3Rpb24nLFxuICAgIGxhYmVsOiAnRGFpbHkgU3VzdGFpbmVkIFdpbmQgRGlyZWN0aW9uJyxcbiAgfSxcbiAgeyB2YWx1ZTogJ0RhaWx5U3VzdGFpbmVkV2luZFNwZWVkJywgbGFiZWw6ICdEYWlseSBTdXN0YWluZWQgV2luZCBTcGVlZCcgfSxcbiAge1xuICAgIHZhbHVlOiAnRGFpbHlEZXBhcnR1cmVGcm9tTm9ybWFsQXZlcmFnZVRlbXBlcmF0dXJlJyxcbiAgICBsYWJlbDogJ0RhaWx5IERlcGFydHVyZSBGcm9tIE5vcm1hbCBBdmVyYWdlIFRlbXBlcmF0dXJlJyxcbiAgfSxcbl07XG5cbmNvbnN0IGdldExhYmVsID0gKHZhbHVlKSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChhdHRyaWJ1dGVzW2ldLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNbaV0ubGFiZWw7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGRhdGEgPSB1c2VEYXRhKCk7XG4gIGNvbnN0IFtob3ZlcmVkVmFsdWUsIHNldEhvdmVyZWRWYWx1ZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc29sZS5sb2coaG92ZXJlZFZhbHVlKTtcblxuICBjb25zdCBpbml0aWFsWUF0dHJpYnV0ZSA9ICdEYWlseUF2ZXJhZ2VXaW5kU3BlZWQnO1xuICBjb25zdCBbeUF0dHJpYnV0ZSwgc2V0WUF0dHJpYnV0ZV0gPSB1c2VTdGF0ZShpbml0aWFsWUF0dHJpYnV0ZSk7XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIDxwcmU+TG9hZGluZy4uLjwvcHJlPjtcbiAgfVxuXG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIGNvbnN0IGlubmVyV2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXG4gIGNvbnN0IHhWYWx1ZSA9IChkKSA9PiBkLkRBVEU7XG4gIGNvbnN0IHhBeGlzTGFiZWwgPSAnJztcbiAgY29uc3QgeVZhbHVlID0gKGQpID0+IGRbeUF0dHJpYnV0ZV07XG4gIGNvbnN0IHlBeGlzTGFiZWwgPSBnZXRMYWJlbCh5QXR0cmlidXRlKTtcblxuICBjb25zdCBjb2xvclZhbHVlID0gKGQpID0+IGQuTkFNRTtcbiAgY29uc3QgY29sb3JMZWdlbmRMYWJlbCA9ICdTdGF0aW9uJztcblxuICBjb25zdCBmaWx0ZXJlZERhdGEgPSBkYXRhLmZpbHRlcigoZCkgPT4gaG92ZXJlZFZhbHVlID09PSBjb2xvclZhbHVlKGQpKTtcblxuICBjb25zdCBjaXJjbGVSYWRpdXMgPSA1O1xuXG4gIGNvbnN0IHNpRm9ybWF0ID0gZm9ybWF0KCcuMnMnKTtcbiAgY29uc3QgeEF4aXNUaWNrRm9ybWF0ID0gdGltZUZvcm1hdCgnJVknKTtcbiAgY29uc3QgeUF4aXNUaWNrRm9ybWF0ID0gZm9ybWF0KCcgJyk7XG5cbiAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgY29uc3QgeFNjYWxlID0gc2NhbGVUaW1lKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB4VmFsdWUpKVxuICAgIC5yYW5nZShbMCwgaW5uZXJXaWR0aF0pXG4gICAgLm5pY2UoKTtcblxuICBjb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeVZhbHVlKSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSlcbiAgICAubmljZSgpO1xuXG4gIGNvbnN0IGNvbG9yU2NhbGUgPSBzY2FsZU9yZGluYWwoKVxuICAgIC5kb21haW4oZGF0YS5tYXAoY29sb3JWYWx1ZSkpXG4gICAgLnJhbmdlKFsnIzEzN0I4MCddKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVzLWNvbnRhaW5lclwiPlxuICAgICAgICA8UmVhY3REcm9wZG93blxuICAgICAgICAgIG9wdGlvbnM9e2F0dHJpYnV0ZXN9XG4gICAgICAgICAgaWQ9XCJ5LXNlbGVjdFwiXG4gICAgICAgICAgdmFsdWU9e3lBdHRyaWJ1dGV9XG4gICAgICAgICAgb25DaGFuZ2U9eyh7IHZhbHVlIH0pID0+IHNldFlBdHRyaWJ1dGUodmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgfT5cbiAgICAgICAgICA8QXhpc0JvdHRvbVxuICAgICAgICAgICAgeFNjYWxlPXt4U2NhbGV9XG4gICAgICAgICAgICBpbm5lckhlaWdodD17aW5uZXJIZWlnaHR9XG4gICAgICAgICAgICB0aWNrRm9ybWF0PXt4QXhpc1RpY2tGb3JtYXR9XG4gICAgICAgICAgICB0aWNrT2Zmc2V0PXs3fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHRleHRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImF4aXMtbGFiZWxcIlxuICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHsteUF4aXNMYWJlbE9mZnNldH0sIFxuICAgICAgICAgICR7aW5uZXJIZWlnaHQgLyAyfSkgcm90YXRlKC05MClgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt5QXhpc0xhYmVsfVxuICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICA8QXhpc0xlZnQgeVNjYWxlPXt5U2NhbGV9IGlubmVyV2lkdGg9e2lubmVyV2lkdGh9IHRpY2tPZmZzZXQ9ezd9IC8+XG4gICAgICAgICAgPHRleHRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImF4aXMtbGFiZWxcIlxuICAgICAgICAgICAgeD17aW5uZXJXaWR0aCAvIDJ9XG4gICAgICAgICAgICB5PXtpbm5lckhlaWdodCArIHhBeGlzTGFiZWxPZmZzZXR9XG4gICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eEF4aXNMYWJlbH1cbiAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7aW5uZXJXaWR0aCArIDYwfSwgNjApYH0+XG4gICAgICAgICAgICA8dGV4dCB4PXszNX0geT17LTI1fSBjbGFzc05hbWU9XCJheGlzLWxhYmVsXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPlxuICAgICAgICAgICAgICB7Y29sb3JMZWdlbmRMYWJlbH1cbiAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICA8Q29sb3JMZWdlbmRcbiAgICAgICAgICAgICAgICB0aWNrU3BhY2luZz17MjV9XG4gICAgICAgICAgICAgICAgdGlja1NpemU9ezEwfVxuICAgICAgICAgICAgICAgIHRpY2tUZXh0T2Zmc2V0PXsyMH1cbiAgICAgICAgICAgICAgICB0aWNrU2l6ZT17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAgICAgICAgIGNvbG9yU2NhbGU9e2NvbG9yU2NhbGV9XG4gICAgICAgICAgICAgICAgb25Ib3Zlcj17c2V0SG92ZXJlZFZhbHVlfVxuICAgICAgICAgICAgICAgIGhvdmVyZWRWYWx1ZT17aG92ZXJlZFZhbHVlfVxuICAgICAgICAgICAgICAgIGZhZGVPcGFjaXR5PXtmYWRlT3BhY2l0eX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDxDb2xvckxlZ2VuZFxuICAgICAgICAgICAgICB0aWNrU3BhY2luZz17MjV9XG4gICAgICAgICAgICAgIHRpY2tTaXplPXsxMH1cbiAgICAgICAgICAgICAgdGlja1RleHRPZmZzZXQ9ezIwfVxuICAgICAgICAgICAgICB0aWNrU2l6ZT17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgICAgICBvbkhvdmVyPXtzZXRIb3ZlcmVkVmFsdWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgICA8ZyBvcGFjaXR5PXtob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9PlxuICAgICAgICAgICAgPE1hcmtzXG4gICAgICAgICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICAgICAgeFZhbHVlPXt4VmFsdWV9XG4gICAgICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgICAgICBjb2xvclZhbHVlPXtjb2xvclZhbHVlfVxuICAgICAgICAgICAgICB0b29sdGlwRm9ybWF0PXt5QXhpc1RpY2tGb3JtYXR9XG4gICAgICAgICAgICAgIGNpcmNsZVJhZGl1cz17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICAgPE1hcmtzXG4gICAgICAgICAgICBkYXRhPXtmaWx0ZXJlZERhdGF9XG4gICAgICAgICAgICB4U2NhbGU9e3hTY2FsZX1cbiAgICAgICAgICAgIHlTY2FsZT17eVNjYWxlfVxuICAgICAgICAgICAgeFZhbHVlPXt4VmFsdWV9XG4gICAgICAgICAgICB5VmFsdWU9e3lWYWx1ZX1cbiAgICAgICAgICAgIGNvbG9yU2NhbGU9e2NvbG9yU2NhbGV9XG4gICAgICAgICAgICBjb2xvclZhbHVlPXtjb2xvclZhbHVlfVxuICAgICAgICAgICAgdG9vbHRpcEZvcm1hdD17eUF4aXNUaWNrRm9ybWF0fVxuICAgICAgICAgICAgY2lyY2xlUmFkaXVzPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC8+XG4gICk7XG59O1xuY29uc3Qgcm9vdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xuUmVhY3RET00ucmVuZGVyKDxBcHAgLz4sIHJvb3RFbGVtZW50KTtcblxuLy8gZm9yIGRvaW5nIGFyY3Ncbi8vKGRhdGEpLm1hcCgoZCwgaSkgPT4gKFxuLy8gICAgICAgIDxwYXRoIGZpbGw9e2RbJ1JHQiBoZXggdmFsdWUnXX0gZD17cGllQXJjKHtcbi8vICAgICAgICAgICAgICBzdGFydEFuZ2xlOiBpIC8gZGF0YS5sZW5ndGggKiAyICogTWF0aC5QSSxcbi8vICBcdFx0XHRcdFx0ICBlbmRBbmdsZTogKGkrMSkgLyBkYXRhLmxlbmd0aCAqIDIgKiBNYXRoLlBJXG4vLyAgICAgICAgICAgIH0pfS8+XG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjc3YiLCJSZWFjdCIsImZvcm1hdCIsInRpbWVGb3JtYXQiLCJzY2FsZVRpbWUiLCJleHRlbnQiLCJzY2FsZUxpbmVhciIsInNjYWxlT3JkaW5hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBLE1BQU0sTUFBTTtFQUNaLEVBQUUsMEtBQTBLLENBQUM7QUFDN0s7RUFDTyxNQUFNLE9BQU8sR0FBRyxNQUFNO0VBQzdCLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBR0EsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QztFQUNBLEVBQUVDLGlCQUFTLENBQUMsTUFBTTtFQUNsQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLO0VBQ3ZCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDaEMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUM7RUFDbkQsTUFBTSxDQUFDLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7RUFDekQsTUFBTSxDQUFDLENBQUMsMkJBQTJCLEdBQUcsQ0FBQyxDQUFDLENBQUMsMkJBQTJCLENBQUM7RUFDckUsTUFBTSxDQUFDLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUM7RUFDM0QsTUFBTSxDQUFDLENBQUMsMkJBQTJCLEdBQUcsQ0FBQyxDQUFDLENBQUMsMkJBQTJCLENBQUM7RUFDckUsTUFBTSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUM7RUFDN0QsTUFBTSxDQUFDLENBQUMsMENBQTBDLEVBQUUsQ0FBQyxDQUFDLENBQUMsMENBQTBDLENBQUM7RUFDbEcsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7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