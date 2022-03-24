import React, { Component } from 'react';
import ScheduleSelector from 'react-schedule-selector'
import './style.css'
import model from './Model'

class Calendar extends Component {
  constructor(props){
    super(props);
    this.state = {
      schedule: [],
      enabledTime: [],
      startDate: null,
      numDays: 7,
      status: "",
      type: "host"
    }
  }

  componentDidMount() {
    let hostDataPromise = model.getMeetingSetting(this.getId())
    let saveDataPromise = model.getSavedTimeslot(this.getId())
    Promise.all([hostDataPromise, saveDataPromise]).then((values)=>{
      let meeting = values[0]
      let save = values[1]
      let schedule = save.map(date => new Date(date))
      let enabledTime = meeting.hostslots.map(date => new Date(date).getTime())
      let timerange = meeting.timerange.map(date => new Date(date))
      let numDays = (timerange[1].getTime() - timerange[0].getTime()) / (1000 * 3600 * 24) + 1
      this.setState({enabledTime: enabledTime, schedule: schedule, startDate: timerange[0], numDays: numDays})
    })
  }

  getId = ()=>{
    let url = window.location.href
    return url.substring(url.lastIndexOf('/') + 1)
  }

  handleChange = (newSchedule) => {
    this.setState({ schedule: newSchedule })
  }

  clickSubmit = () => {
    let enabledTime = this.state.enabledTime
    let validSchedule = this.state.schedule
      .map(function (date) { return date.getTime() })
      .filter(function (time, i, self) {
          return self.indexOf(time) === i && enabledTime.includes(time)
      })
      .map(function (time) { return new Date(time).toISOString() })
    model.clickSubmit(this.getId(), validSchedule)
    .then(status => this.setState({status: "Saved"}))
  }

  cantMeet = () =>{
    model.cantMeet(this.getId())
    .then(status => this.setState({status: "Notified"}))
  }

  renderDateCell = (datetime, selected, refSetter) => {
    if(this.state.enabledTime.includes(datetime.getTime())){
      return (<div className={selected? 'selected-cell':'selectable-cell'}></div>)
    }
    return (<div className='disabled-cell'></div>)
  }

  render() {
    return (
      <div className="Calendar">
        <h1>My Calendar</h1>
        <button onClick={this.clickSubmit}>
          Submit
        </button>
        <button onClick={this.cantMeet}>
          Can't Meet
        </button>
        <div>{this.state.status}</div>
        <ScheduleSelector
          renderDateCell={this.renderDateCell}
          onChange={this.handleChange}
          startDate={this.state.startDate}
          selection={this.state.schedule}
          numDays={this.state.numDays}
          minTime={8}
          maxTime={20}
          hourlyChunks={2}
        />
      </div>
    );
  }
}

export default Calendar;