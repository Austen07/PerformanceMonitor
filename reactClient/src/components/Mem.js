import React from 'react';
import drawCircle from '../utilities/canvasLoading';

const Mem = (props) => {
  const {freeMem, totalMem, usedMem, memUseage, memWidgetID} = props.memData;
  const canvas = document.querySelector(`.${memWidgetID}`);
  drawCircle(canvas, memUseage * 100);
  
  const totalMemGB = totalMem / (1073741824 * 100) / 100;
  const freeMemGB = Math.floor(freeMem / (1073741824 * 100)) / 100;

  return (
    <div className="col-sum-3 mem">
      <h3>Memory Usage</h3>
      <div className="canvas-wrapper">
        <canvas className={memWidgetID} width="200" height="200"></canvas>
        <div className="mem-text">{memUseage * 100} %</div>
      </div>
      <div>Total Memory: {totalMemGB} G</div>
      <div>Free Memory: {freeMemGB} G</div>
    </div>
  );
};

export default Mem;