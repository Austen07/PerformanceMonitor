import React from 'react';
import drawCircle from '../utilities/canvasLoading';


const Cpu = (props) => {
  const {cpuLoad, cpuWidgetID} = props.cpuData;
  const canvas = document.querySelector(`.${cpuWidgetID}`);
  drawCircle(canvas, cpuLoad);

  return (
    <div className="col-sm-3">
      <h3>CPU Load</h3>
      <div className="canvas-wrapper">
        <canvas className={cpuWidgetID} width="200" height="200"></canvas>
        <div className="cpu-text">{cpuLoad} %</div>
      </div>
    </div>
  );
};

export default Cpu;