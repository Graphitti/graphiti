import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  LineChartGraph,
  BarChartGraph,
  AreaChartGraph,
  RadarChartGraph,
  ScatterChartGraph,
  PieChartGraph
} from './graphs'

import {
  updateTitle,
  updateXAxisName,
  updateYAxisName,
  updateColor,
  fetchAndSetGraph,
  fetchAndSetDataFromS3
} from '../store'
import {HuePicker} from 'react-color'
import crypto from 'crypto'
import axios from 'axios'
import FileSaver from 'file-saver'

axios.defaults.baseURL = 'http://localhost:8080'

class SingleGraphView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      legend: -1,
      edit: false,
      svgDisplay: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeColor = this.handleChangeColor.bind(this)
    this.handleClone = this.handleClone.bind(this)
    this.exportChart = this.exportChart.bind(this)
    this.exportSVG = this.exportSVG.bind(this)
  }

  componentDidMount() {
    const {graphId} = this.props.match.params
    const {getGraphId} = this.props
    getGraphId(graphId)
  }
  
  // Exports the graph as embedded JS or PNG
  exportChart(asSVG) {
    // A Recharts component is rendered as a div that contains namely an SVG
    // which holds the chart. We can access this SVG by calling upon the first child/
    // let chartSVG = ReactDOM.findDOMNode(this.currentChart).children[0];
    let chartSVG = document.getElementById('current-chart').children[0];
    if (asSVG) {
      let svgURL = new XMLSerializer().serializeToString(chartSVG);
      let svgBlob = new Blob([svgURL], { type: "image/svg+xml;charset=utf-8" });
      FileSaver.saveAs(svgBlob, this.state.uuid + ".svg");
    } else {
      let svgBlob = new Blob([chartSVG.outerHTML], { type: "text/html;charset=utf-8" });
      FileSaver.saveAs(svgBlob, this.state.uuid + ".html");
    }
  }

  exportSVG() {
    let chartSVG = document.getElementById('current-chart').children[0];
    let input = document.getElementById('svg-copy');
    this.state.svgDisplay = true;
    let svgURL = new XMLSerializer().serializeToString(chartSVG);
    input.value = svgURL;
  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    switch (name) {
      case 'title':
        return this.props.changeTitle(value)
      case 'XAxis':
        return this.props.changeXAxisName(value)
      case 'YAxis':
        return this.props.changeYAxisName(value)
    }
  }

  handleClick(idx) {
    this.setState({legend: idx})
  }

  handleChangeColor(color) {
    this.props.changeColor(color.hex, this.state.legend)
    this.setState({legend: -1})
  }

  handleClone() {
    const graphId = crypto
      .randomBytes(8)
      .toString('base64')
      .replace(/\//g, '7')
    console.log('graphId', graphId)
    const { currentX, currentY, title, xAxisName, yAxisName, colors, graphType } = this.props.graphSettings;
    const { awsId, name } = this.props.dataset;
    axios.post(`api/graphs/${graphId}`, {
      xAxis: currentX,
      yAxis: currentY,
      //comment in when the models support these
      // xAxisLabel: xAxisName,
      // yAxisLabel: yAxisName,
      // colors,
      title: title,
      graphType,
      datasetName: name,
      awsId
    })
      .then(() => {
        this.props.history.push(`/graph-dataset/customize/${graphId}`);
        location.reload();
      })
      .catch(console.error)
  }

  render() {
    let {currentY, graphType, colors} = this.props.graphSettings

    return (
      <div>
        {/* this is the code for exporting the image */}
        <button onClick={() => this.exportChart()}>Download Image</button>
        <button onClick={() => this.exportSVG()}>Get SVG</button>
        <input id="svg-copy" style={{height: "30px", width: "400px"}}></input>

        <div id="current-chart">
          {(function () {
            switch (graphType) {
              case 'Line':
                return <LineChartGraph />
              case 'Bar':
                return <BarChartGraph />
              case 'Area':
                return <AreaChartGraph />
              case 'Radar':
                return <RadarChartGraph />
              case 'Scatter':
                return <ScatterChartGraph />
              case 'Pie':
                return <PieChartGraph />
              default:
                return null
            }
          })()}
        </div>

        <div>
          {this.state.edit === false ? (
            <div>
              <button onClick={() => this.setState({edit: true})}>Edit</button>
              <button onClick={this.handleClone}>Clone</button>
            </div>
          ) : (
            <div>
              <form>
                <label>{`Change title`}</label>
                <input type="text" name="title" onChange={this.handleChange} />
                <label>{`Change the name of X axis`}</label>
                <input type="text" name="XAxis" onChange={this.handleChange} />
                <label>{`Change the name of Y axis`}</label>
                <input type="text" name="YAxis" onChange={this.handleChange} />
              </form>
              <div>
                {currentY.map((yAxis, idx) => (
                  <div key={idx}>
                    <label
                    >{`Change the color of the legend of '${yAxis}'`}</label>
                    <button onClick={() => this.handleClick(idx)}>
                      Pick Color
                    </button>
                    {this.state.legend !== -1 ? (
                      <div className="popover">
                        <div className="cover" onClick={this.handleClose} />
                        <HuePicker
                          color={colors[idx]}
                          onChangeComplete={this.handleChangeColor}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    graphSettings: state.graphSettings,
    dataset: state.dataset
  }
}

const mapDispatch = dispatch => ({
  changeTitle(title) {
    dispatch(updateTitle(title))
  },
  changeXAxisName(name) {
    dispatch(updateXAxisName(name))
  },
  changeYAxisName(name) {
    dispatch(updateYAxisName(name))
  },
  changeColor(color, idx) {
    dispatch(updateColor(color, idx))
  },
  getGraphId: graphid => {
    dispatch(fetchAndSetGraph(graphid))
  },
  getDataset: graphId => {
    dispatch(fetchAndSetDataFromS3(graphId))
  }
})




export default connect(mapState, mapDispatch)(SingleGraphView)
