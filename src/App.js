import React, { Component } from 'react';
import './App.css';
const os = window.require('os');
const cpu = window.require('windows-cpu');

if (!cpu.isSupported()) {
  throw new Error('windows-cpu is not supported on this platform');
}

function StatsBar(props) {
  let { rate, color = 'red' } = props
  let green =  255 - Math.round(2.55*rate)
  let red = Math.round(2.55*rate)
  return (
    <div style={{ position: 'relative', top: 0 }}>
      <span style={{
        width: `${rate}%`,
        height: '20px',
        display: 'inline-block',
        backgroundColor: color === 'auto'?`rgb(${red},${green},0)`:color,
        transition: 'all 1s',
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        top: 1,
        left: 5
      }}>
        {props.children}
      </div>
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cpus: os.cpus(),
      cpuLoad: 0,
      freeMem: 0,
      usedMem: 0,
      totalMem: Math.round(os.totalmem() / (2 ** 20)),
      osType: os.type(),
    }

  }

  componentDidMount() {
    console.log(process.env.NODE_ENV)

    setInterval(() => {
      cpu.totalLoad().then(load => {
        let freemem = os.freemem() / 2 ** 20
        let { totalMem } = this.state

        this.setState({
          cpuLoad: load,
          freeMem: freemem,
          usedMem: Math.round(totalMem - freemem)
        })
      });
    }, 1000)
  }

  render() {
    let { cpus, cpuLoad, totalMem, osType, usedMem } = this.state;
    let memLoad = Math.round(usedMem / totalMem * 100)
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <small style={{
              position: "absolute",
              marginRight: 5,
              right: 18,
              bottom: 5
            }}>{osType}</small><br />
            <StatsBar rate={cpuLoad} color='auto'>
              <span>CPU&nbsp;:&nbsp;{cpus[0].model}&nbsp;({cpuLoad}%)</span><br />
            </StatsBar>
            <StatsBar rate={memLoad} color='auto'>
              <span>MEM&nbsp;:&nbsp;{usedMem}&nbsp;/&nbsp;{totalMem}&nbsp;MB&nbsp;({memLoad}%)</span><br />
            </StatsBar>
            {/* <StatsBar rate={memLoad} /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
