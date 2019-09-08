import React, {Component} from 'react';
import socket from './utilities/socketConnection';
import Widget from './components/Widget';



class App extends Component {
  state = {
    performanceData: {},
  };

  componentDidMount() {
    socket.on("data", (data) => {
      // console.log(data);
      const currentState = ({...this.state.performanceData});
     
      currentState[data.macA] = data;

      this.setState({
        performanceData: currentState,
      });
    });
  }

  render() {
    let widgets = [];
    const data = this.state.performanceData;

    Object.entries(data).forEach(([key, val]) => {
      widgets.push(<Widget key={key} data={val} />);
    });

    return (
      <div>
        {widgets}
      </div>
    );
  }
}


export default App;