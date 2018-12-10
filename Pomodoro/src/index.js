import React from 'react'
import ReactDOM from 'react-dom'

let x

class Pomodoro extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: 25,
      break: 5,
      btn: 'start',
      status: 'focus',
      display: 1500
    }
    this.start = this.start.bind(this)
    this.rst = this.rst.bind(this)
    this.bd = this.bd.bind(this)
    this.bi = this.bi.bind(this)
    this.sd = this.sd.bind(this)
    this.si = this.si.bind(this)
  }
  minutes() {
    let m = Math.floor(this.state.display/60)
    m = m < 10 ? '0' + m : m
    return m
  }
  seconds() {
    let s = this.state.display - Math.floor(this.state.display / 60) * 60
    s = s < 10 ? '0' + s : s
    return s
  }
  start(e) {
    if (this.state.btn == 'start') {
      this.setState({
        btn: 'pause'
      })
      x = setInterval( () => {
        if (this.state.display > 0) {
          this.setState({
            display: this.state.display - 1
          })
        }
        else {
          // this.sound.play()
          this.sound.currentTime = 0
          if (this.state.status == 'focus') {
            this.setState({
              status: 'break',
              display: this.state.break * 60
            })
          }
          else if (this.state.status == 'break') {
            this.setState({
              status: 'focus',
              display: this.state.focus * 60
            })
          }
        }
      }, 1000)
      document.documentElement.classList.add('focus')
      document.getElementById('focus').classList.add('hide')      
      document.getElementById('break').classList.add('hide')
      document.getElementById('timer-label').classList.add('hide')      
      document.getElementById('start_stop').classList.add('hide')
      document.getElementById('circle').style.border = '2px solid white'
      setTimeout((() => document.getElementById('circle').style.border = ''), 100)
    }
    else if (this.state.btn == 'pause') {
      clearInterval(x)
      document.documentElement.classList.remove('focus')
      document.getElementById('timer-label').classList.remove('hide')      
      document.getElementById('start_stop').classList.remove('hide')
      document.getElementById('circle').style.border = '2px solid white'
      setTimeout((() => document.getElementById('circle').style.border = ''), 100)
      this.setState({
        btn: 'start'
      })
    }
  }
  rst(e) {
    clearInterval(x)
    document.documentElement.classList.remove('focus')
    document.getElementById('focus').classList.remove('hide')      
    document.getElementById('break').classList.remove('hide')
    document.getElementById('timer-label').classList.remove('hide')      
    document.getElementById('start_stop').classList.remove('hide')
    this.setState({
      focus: 25,
      break: 5,
      btn: 'start',
      status: 'focus',
      display: 1500
    })
    this.sound.pause()
    this.sound.currentTime = 0
  }
  bd(e) {
    if (this.state.break > 1) {
      this.setState({
        break: this.state.break - 1
      })
      if (this.state.status == 'break') {
        this.setState({
          display: this.state.break * 60 - 60
        })
      }
    }
  }
  bi(e) {
    if (this.state.break < 60) {
      this.setState({
        break: this.state.break + 1
      })
      if (this.state.status == 'break') {
        this.setState({
          display: this.state.break * 60 + 60
        })
      }
    }
  }
  sd(e) {
    if (this.state.focus > 5) {
      this.setState({
        focus: this.state.focus - 5
      })
      if (this.state.status == 'focus') {
        this.setState({
          display: this.state.focus * 60 - 300
        })
      }
    }
  }
  si(e) {
    if (this.state.focus < 60) {
      this.setState({
        focus: this.state.focus + 5
      })
      if (this.state.status == 'focus') {
        this.setState({
          display: this.state.focus * 60 + 300
        })
      }
    }
  }
  render() {
    return (
      <div>        
        <button className='finger' id='reset' onClick={this.rst}>×</button>
        <div id='focus'>
          <div className='finger'>Focus</div>
          <div className='row'>
            <button className='left' id='focus-decrement' onClick={this.sd}>
              -
            </button>
            <p className='finger' id='focus-length'>{this.state.focus}</p>
            <button className='right' id='focus-increment' onClick={this.si}>
              +
            </button>
          </div>
        </div>
        <div id='circle' onClick={this.start}>
          <div id='timer-label' className='finger'>{this.state.status}</div>
          <div id='time-left'>
            <p id='m'>{this.minutes()}</p>
            <p>:</p>
            <p>{this.seconds()}</p>
          </div>
          <div className='finger' id='start_stop'>{this.state.btn}</div>
        </div>
        <div id='break'>
          <div className='row'>
            <button className='left' id='break-decrement' onClick={this.bd}>
              -
            </button>
            <p className='finger' id='break-length'>{this.state.break}</p>
            <button className='right' id='break-increment' onClick={this.bi}>
              +
            </button>
          </div>
          <div className='finger'>Break</div>
        </div>
        <audio
          id='beep'
          src='https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
          ref={(audio) => { this.sound = audio }}
        />
      </div>
    )
  }
}

ReactDOM.render(<Pomodoro />, document.getElementById('root'))