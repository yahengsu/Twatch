import React, { Component } from 'react';
import './App.css';
import Plot from 'react-plotly.js';

function handleClick(e) {
  e.preventDefault()
  console.log("TEST")
}

var graphs = [""]
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      response: '',
      data: [], 
      layout: {}, 
      frames: [], 
      config: {},
      revision: 0
  }
}
 


  componentDidMount() {
    this.callApi('/api/hello')
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async (route) => {
    const response = await fetch(route)
    const body = await response.json()
    console.log(body)
    console.log(response)

    if (response.status !== 200) throw Error(body.message)

    return body
  }

  render() {
    return (
        <div className="App">
        <button onClick={handleClick}>PREVIOUS</button>
        <button onClick={handleClick}>NEXT</button>
        <div className="Plot">
        <Plot
                data={this.state.data}
                layout={this.state.layout}
                frames={this.state.frames}
                config={this.state.config}
                onInitialized={(figure) => this.setState(figure)}
                onUpdate={(figure) => this.setState(figure)}
             />   
        </div>
     </div>
    )
  }
}

export default App;
