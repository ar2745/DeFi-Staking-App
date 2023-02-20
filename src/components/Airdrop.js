import React, {Component} from 'react'

class Airdrop extends Component {
    // Airdrop to have a timer that counts down
    // Initialize the countdown after our clients have staked a certain amount
    // Timer functionality, countdown, startTimer, state - for time to work   
    constructor() {
        super()
        this.state = {time: {}, seconds: 20 };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    countDown() {
        // countdown one second at a time
        // stop counting when hit zero

        let seconds = this.state.seconds - 1
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })

        if(seconds == 0) {
            clearInterval(this.timer)
        }
    }

    startTimer() {
        if(this.timer == 0 && this.state.seconds) {
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    secondsToTime(secs) {
        let hours, minutes, seconds
        hours = Math.floor(secs / (60 * 60))

        let divisor_for_minutes = secs % (60 * 60)
        minutes = Math.floor(divisor_for_minutes / 60)

        let divisor_for_seconds = divisor_for_minutes % 60
        seconds = Math.ceil(divisor_for_seconds / 60)

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }
        return obj
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
    }

    airdropTokens() {
        let stakingB = this.props.stakingBalance

        if(stakingB >= '50000000000000000000') {
            this.startTimer()
        }
    } 
    
    render() {
        this.airdropTokens()
        return(
            <div style={{color:'black'}}>{this.state.time.m}:{this.state.time.s}
            </div>
        )
    }
}

export default Airdrop;