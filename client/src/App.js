import React, { Component } from 'react';
import './App.css';
import Plot from 'react-plotly.js';



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      response: '',
      data: [], 
      layout: {}, 
      graph: 0,
      revision: 0
  }
  this.incrementGraph = this.incrementGraph.bind(this)
  this.decrementGraph = this.decrementGraph.bind(this)
}

  
  componentDidMount() {
    this.callApi()
  }

  callApi = async () => {
    const response = await fetch('/graphs/' + this.state.graph)
    const body = await response.json()
    console.log(body)
    console.log(response)

    if (response.status !== 200) throw Error(body.message)

    this.setState({ 
      data: body.data,
      layout: body.layout
    })
  }

  incrementGraph() {
    console.log(this.state.graph)  
    if (this.state.graph + 1 > 5) {
      return
    }
    else {
      var current = this.state.graph
      this.setState({graph: current + 1})
      this.callApi()
    }
  }
  
  decrementGraph() {
    console.log(this.state.graph)
 
    if (this.state.graph - 1 < 0) {
      return
    }
    else {
      var current = this.state.graph
      this.setState({graph: current - 1})
      this.callApi()
    }
  }

  render() {
    return (
        <div className="App">
        <button onClick={this.decrementGraph}>PREVIOUS</button>
        <button onClick={this.incrementGraph}>NEXT</button>
        <div className="Plot">
        <Plot
                data={this.state.data}
                layout={this.state.layout}
                onInitialized={(figure) => this.setState(figure)}
                onUpdate={(figure) => this.setState(figure)}
             />   
        </div>
     </div>
    )
  }
}

export default App;
