import React, {Component} from 'react'
import './App.css'
import Navbar from './Navbar.js'
import Web3 from 'web3'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticlesSettings from './ParticleSettings'

class App extends Component {
    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('No Ethereum browser detected! You should check out MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId()
        
        // Load Tether Contract
        const tetherData = Tether.networks[networkId]
        if(tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({tether})

            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance: tetherBalance.toString()})
            console.log({balance: tetherBalance})
        }
        else {
            window.alert("Error! Tether contract not deployed - Network Undetected")
        }

        // Load RWD Contract
        const rewardData = RWD.networks[networkId]
        if(rewardData) {
            const rwd = new web3.eth.Contract(RWD.abi, rewardData.address)
            this.setState({rwd})

            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString()})
            console.log({balance: rwdBalance})
        }
        else {
            window.alert("Error! Reward Token contract not deployed - Network Undetected")
        }

        // Load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank})

            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: stakingBalance.toString()}) 
            console.log({balance: stakingBalance})
        }
        else {
            window.alert("Error! DecentralBank Contract not deployed - Network Undetected") 
        }

        this.setState({loading: false})
        console.log(this.state)
    }

    // staking function
    stakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {this.setState({loading: false})
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {this.setState({loading: false})
        })
    })
    } 

    // unstaking function
    unstakeTokens = (amount) => {
        this.setState({loading: true})        
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {this.setState({loading: false})        
        })
    }
    
    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true 
        }
    }

    // Our React Code
    render() {
        let content
        {this.state.loading ? content = <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>LOADING....</p> : content = <Main tetherBalance={this.state.tetherBalance} rwdBalance={this.state.rwdBalance} stakingBalance={this.state.stakingBalance} stakeTokens={this.stakeTokens} unstakeTokens={this.unstakeTokens}/>}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticlesSettings />
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>    
                        </main> 
                    </div>
                    
                </div>            
            </div>
        )
    }
}

export default App;

// HTML - The markup language for writing basic text and websites
// CSS - Styles the website (colors, fonts, sizes)
// Javascript - Allows the websites to be dynamic 