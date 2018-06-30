import React from 'react'
import {connect} from 'react-redux'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'



export const BarChartGraph = props => {
  const {dataset, graphSettings} = props
  const {currentX, currentY, title, xAxisName, yAxisName, colors} = graphSettings

  return (
    <div>
      <h4>{title}</h4>
      <BarChart width={600} height={600} data={dataset.dataset}>
        <CartesianGrid strokeDasharray="3 3" />
        {
          currentX.toLowerCase() !== 'number' ?
            <XAxis dataKey={currentX} label={{value:`${xAxisName}`, offset:-20, position:"insideBottom"}} allowDuplicatedCategory={false} type="category" />
          :
            <XAxis dataKey={currentX} label={{value:`${xAxisName}`, offset:-20, position:"insideBottom"}} />
        }
        <YAxis label={{value:`${yAxisName}`, angle:-90, position:"insideLeft"}} />
        <Tooltip />
        <Legend align='right'/>
        {currentY.map((yAxis, idx) => (
          <Bar
            key={idx}
            type="monotone"
            dataKey={yAxis}
            fillOpacity={0.6}
            fill={colors[idx]}
          />
        ))}
      </BarChart>
    </div>
  )
}

const mapState = state => {
  return {
    dataset: state.dataset,
    graphSettings: state.graphSettings
  }
}

export default connect(mapState)(BarChartGraph)
