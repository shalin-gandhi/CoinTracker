import React from 'react'
import CircularProgress from 'material-ui/CircularProgress';
import '../styles/App.css'

class CoinDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			data: ""
		}
		this.fetchData = this.fetchData.bind(this)
		this.renderGraph = this.renderGraph.bind(this)
	}

	componentDidMount() {
		this.fetchData();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.symbol === this.props.symbol && this.state.data !== "")
			return false
		return true
	}

	getClass(value = 0) {
		return value > 0 ? "bull" : value < 0 ? "bear" : ""
	}

	renderGraph(data) {

		function legendFormatter(data) {
		  if (data.x == null) {
		    // This happens when there's no selection and {legend: 'always'} is set.
		    return '<br><br>';
		  }

		  var html = this.getLabels()[0] + ': ' + data.xHTML;
		  data.series.forEach(function(series) {
		    if (!series.isVisible) return;
		    var labeledData = series.labelHTML + ': ' + series.yHTML;
		    if (series.isHighlighted) {
		      labeledData = '<b>' + labeledData + '</b>';
		    }
		    html += '<br>' + series.dashHTML + ' ' + labeledData;
		  });
		  return html;
		}

		new window.Dygraph(this.refs.chart,
			data.price.slice(0,-1), {
				axes: {
		            x: {
		                axisLabelFormatter: function (unix_timestamp, gran) {
		                    var date = new Date(unix_timestamp);

							// Hours part from the timestamp
							var hours = date.getHours();
							// Minutes part from the timestamp
							var minutes = "0" + date.getMinutes();
							// Seconds part from the timestamp
							var seconds = "0" + date.getSeconds();

							// Will display time in 10:30:23 format
							var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
							return formattedTime
		                },
		                valueFormatter: function (unix_timestamp) {
		                	var date = new Date(unix_timestamp);
		                	return date
		                }
		            }
		        },
				labels: ["Time","Price"],
			  	fillGraph: false,
			  	drawGrid: false,
			  	labelsDiv: document.getElementById('legend'),
			    legend: 'always',
			    legendFormatter: legendFormatter
			});
	}


	fetchData() {
		let { isLoading, data } = this.state
		let { symbol } = this.props
		if (isLoading || symbol === "")
			return
		this.setState({isLoading:true});
		fetch("https://coincap.io/page/"+symbol)
		.then((response) => response.json())
		.then((response) => {
			data = response
			isLoading = false
			this.setState({data, isLoading})
			this.fetchHistoryData()
		}).catch(function(error) {
		  console.log('There has been a problem with your fetch operation: ', error.message);
		});
	}

	fetchHistoryData() {
		let { isLoading } = this.state
		let { symbol } = this.props
		if (isLoading || symbol === "")
			return
		this.setState({isLoading:true});
		fetch("http://coincap.io/history/1day/"+symbol)
		.then((response) => response.json())
		.then((response) => {
			const data = response
			isLoading = false
			this.setState({isLoading})
			this.renderGraph(data)
		}).catch(function(error) {
		  console.log('There has been a problem with your fetch operation: ', error.message);
		});
	}


	render() {

		const coinData = this.state.data

		if (coinData === "")
			return <div style = {{height: "596px", textAlign: "center"}}>
    					<CircularProgress size={60} thickness={7} />
					</div>
		else
			return <div>
						<div className = "coinNameBlock">
							<h2>{coinData.display_name} ({coinData.id})</h2>
						</div>
						<div className = "coinPriceBlock">
							<h2 className = {this.getClass(coinData.cap24hrChange)}><span>${parseFloat(coinData.price_usd).toFixed(2)}</span>&nbsp;
								<span>({coinData.cap24hrChange}%)</span>
							</h2>
						</div>
						<div style = {{clear: "both", border: "solid 1px gray", padding: "10px"}}>
							<div className = "coinStatTable">
								<div className = "mb10">Market Cap</div>
								<div>${parseFloat(coinData.market_cap).toFixed(2)}</div>
							</div>
							<div className = "coinStatTable">
								<div className = "mb10">24 Hour Volume</div>
								<div>{coinData.volume}</div>
							</div>
							<div className = "coinStatTable">
								<div className = "mb10">Available Supply</div>
								<div>{coinData.supply}</div>
							</div>
						</div>
						<div id="legend"></div>
						<div id="graph" ref="chart"></div>
					</div>
	}
}

export default CoinDetail;