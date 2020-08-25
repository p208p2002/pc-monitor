import React, { Component } from 'react';
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
      freeMem: 0,
      usedMem: 0,
      totalMem: Math.round(os.totalmem()/(2**20)),
      osType: os.type(),
    }

  }

  componentDidMount() {
    console.log(process.env.NODE_ENV)

    setInterval(() => {
      cpu.totalLoad().then(load => {
        let freemem = os.freemem()/2**20
        let { totalMem } = this.state
        
        this.setState({
          cpuLoad: load,
          freeMem: freemem,
          usedMem: Math.round(totalMem - freemem)
        })
      });
    }, 500)
  }

  render() {
    let { cpus, cpuLoad, totalMem, osType, usedMem } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <span>OS&nbsp;:&nbsp;{osType}</span><br />
            {/* {cpus.map((cpu,i)=>{
              return(
                <><span className="">CPU{`${i}`}&nbsp;:&nbsp;{cpu.model}&nbsp;({cpuLoad}%)</span><br /></>
              )
            })} */}
            <span className="">CPU&nbsp;:&nbsp;{cpus[0].model}&nbsp;({cpuLoad}%)</span><br />
            <span>MEM&nbsp;:&nbsp;{usedMem}&nbsp;/&nbsp;{totalMem}&nbsp;MB&nbsp;({Math.round(usedMem/totalMem*100)}%)</span><br />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
