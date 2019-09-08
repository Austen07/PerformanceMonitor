import React from 'react';
import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';
import './widget.css';

class Widget extends React.Component {

  render() {
    const {freeMem, totalMem, usedMem, memUseage, osType, upTime, 
          cpuModel, numCores, cpuSpeed, cpuLoad, macA, isActive } = this.props.data;

    const cpuWidgetID = `cpu-widget-${macA}`;
    const memWidgetID = `mem-widget-${macA}`;

    const cpu = {cpuLoad, cpuWidgetID};
    const mem = {freeMem, totalMem, usedMem, memUseage, memWidgetID};
    const info = {osType, upTime, cpuModel, numCores, cpuSpeed, macA};
    
    let notActiveDiv = '';
    if(!isActive) {
      notActiveDiv = <div className="not-active">Offline</div>
    }


    return (
      <div className="widget col-sm-12">
        {notActiveDiv}
        <Cpu cpuData={cpu}/>
        <Mem memData={mem}/>
        <Info infoData={info}/>
      </div>
    );
  }
}

export default Widget;