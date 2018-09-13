import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Plot from 'react-plotly.js';


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
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello')
    const body = await response.json()
    console.log(body)
    console.log(response)

    if (response.status !== 200) throw Error(body.message)

    return body
  }

  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">{this.state.response}</p>
        </div>
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
