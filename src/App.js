import React, { Component } from 'react';
import Chart from 'chart.js';
// import logo from './logo.svg';
import './App.css';
const os = window.require('os');
const cpu = window.require('windows-cpu');

if (!cpu.isSupported()) {
  throw new Error('windows-cpu is not supported on this platform');
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cpus: os.cpus(),
      cpuLoad: 0,
      freeMem: os.freemem(),
      totalMem: os.totalmem(),
      osType: os.type(),
    }
    this.getGPUInfo = this.getGPUInfo.bind(this);
  }

  componentDidMount() {
    //cpu chart data
    let data = {
      datasets: [{
        data: [0, 100],
        backgroundColor: [
          'rgba(255, 26, 26, 0.2)',
          'rgba(0, 128, 43, 0.2)',
        ],
      }],
      labels: [
        'Used',
        'Free'
      ],
    };
    //cpu chart
    var ctx = document.getElementById("cpuChart");
    var cpuChart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });

    //mem chart
    let data2 = {
      datasets: [{
        data: [0, 100],
        backgroundColor: [
          'rgba(255, 26, 26, 0.2)',
          'rgba(0, 128, 43, 0.2)',
        ],
      }],
      labels: [
        'Used',
        'Free'
      ],
    };

    //mem chart
    var ctx2 = document.getElementById("memChart");
    var memChart = new Chart(ctx2, {
      type: 'pie',
      data: data2,
      options: {
        barThickness: 100,
        maxBarThickness: 0
      }
    })

    //func for update chart
    let removeData = (chart) => {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
      chart.update(0);
    }

    let addData = (chart, label, data) => {
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
      });
      chart.update(0);
    }

    setInterval(() => {
      //
      this.setState({
        freeMem: os.freemem(),
      })
      //
      cpu.totalLoad().then(load => {
        this.setState({
          cpuLoad: load
        })
      });
      //
      let { cpuLoad, freeMem, totalMem } = this.state
      //
      removeData(cpuChart)
      removeData(cpuChart)
      addData(cpuChart, 'Used', cpuLoad)
      addData(cpuChart, 'Free', 100 - cpuLoad)

      //
      removeData(memChart)
      removeData(memChart)
      addData(memChart, 'Used', totalMem - freeMem)
      addData(memChart, 'Free', freeMem)
    }, 1500)
  }

  getGPUInfo() {
    const gl = document.createElement("canvas").getContext("webgl");
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? {
      vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
    } : {
        vendor: "unknown",
        renderer: "unknown",
      };
  }


  render() {
    // let { getGPUInfo } = this;
    let { cpus, cpuLoad, freeMem, totalMem, osType } = this.state;
    totalMem = Math.round(totalMem / 1024 / 1024);
    let usedMem = totalMem - Math.round(freeMem / 1024 / 1024);
    // let gpu = getGPUInfo().renderer
    console.log(cpus)
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h3>Basic Info</h3>
            <span>OS&nbsp;:&nbsp;{osType}</span><br/>
            <span>CPU&nbsp;:&nbsp;{cpus[0].model}({cpuLoad}%)</span><br/>
            <span>MEM&nbsp;:&nbsp;{usedMem}&nbsp;/&nbsp;{totalMem}&nbsp;MB</span><br/>
            {/* <span>GPU&nbsp;:&nbsp;{gpu}</span> */}
          </div>
        </div>
        <hr/>
        <div className="row text-center">
          <div className="col-6">
            <h4>CPU load</h4>
            <div class="chart-container" style={{ position: 'relative' }}>
              <canvas id="cpuChart"></canvas>
            </div>
          </div>
          <div className="col-6">
            <h4>MEM state</h4>
            <div class="chart-container" style={{ position: 'relative' }}>
              <canvas id="memChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
