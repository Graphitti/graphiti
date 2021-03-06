import React from 'react'
import {connect} from 'react-redux'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export const LineChartGraph = props => {
  const {dataset, graphSettings} = props
  const {
    currentX,
    currentY,
    title,
    xAxisName,
    yAxisName,
    colors
  } = graphSettings

  return (
    <div className="graph-dataset-graphs-single">
      <h2>{title || 'Line Chart'}</h2>
      <ResponsiveContainer width="90%" height={550}>
        <LineChart data={dataset.dataset}>
          {currentY.length &&
            currentY.map((yAxis, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={yAxis}
                stroke={colors[idx]}
              />
            ))}
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          {xAxisName ? (
            <XAxis
              dataKey={currentX}
              label={{
                value: `${xAxisName}`,
                offset: -15,
                position: 'insideBottom'
              }}
            />
          ) : (
            <div />
          )}

          {xAxisName ? <Legend align="right" /> : <Legend align="center" />}
          <YAxis
            label={{value: `${yAxisName}`, angle: -90, position: 'insideLeft'}}
          />
          <Tooltip />
          <Legend align="center" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const mapState = state => {
  return {
    dataset: state.dataset,
    graphSettings: state.graphSettings
  }
}

export default connect(mapState)(LineChartGraph)
