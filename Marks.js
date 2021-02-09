export const Marks = ({
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
    <circle
      className="mark"
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      fill={colorScale(colorValue(d))}
      r={circleRadius}
    >
      <title>{tooltipFormat(yValue(d))}</title>
    </circle>
  ));
