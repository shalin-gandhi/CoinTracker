import React from 'react'
import { TableRow, TableRowColumn } from 'material-ui/Table'

class CoinRow extends React.Component {

	constructor(props) {
		super(props)
		this.state = { price: props.coin.price_usd, symbol: props.coin.symbol, change: 0 }
        props.socket.on('trades', (tradeMsg) => {
	    	if(this.state.symbol === tradeMsg.coin) {
				const newPrice = parseFloat(tradeMsg.msg.price)
				const change = newPrice - this.state.price
				this.setState({
					price: newPrice,
					change
				})
			}
        })
	}

	getClass(value = 0) {
		return value > 0 ? "bull" : value < 0 ? "bear" : ""
	}

	getAnimation() {
		return this.state.change > 0 ? "animate-bull" : this.state.change < 0 ? "animate-bear" : ""
	}

	componentWillReceiveProps(nextProps) {
		
	}
 
	render() {
  		const { coin, index, ...otherProps } = this.props
  		
		return <TableRow className = {this.getAnimation(coin.price_usd)} {...otherProps} style = {{color: "#fff", borderBottom: "1px solid rgb(224, 224, 224, 0.4)"}} selected = { false }>
				<TableRowColumn>{index}</TableRowColumn>
				<TableRowColumn>{coin.name}</TableRowColumn>
				<TableRowColumn style = {{textDecoration: "underline", cursor: "pointer"}}>{coin.symbol}</TableRowColumn>
				<TableRowColumn>{coin.market_cap_usd}</TableRowColumn>
				<TableRowColumn>${this.state.price.toFixed(2)}</TableRowColumn>
				<TableRowColumn>{coin.available_supply}</TableRowColumn>
				<TableRowColumn>{coin.volume}</TableRowColumn>
				<TableRowColumn className = {this.getClass(coin.percent_change_24h)}>{coin.percent_change_24h}</TableRowColumn>
			</TableRow>
	}
}

export default CoinRow