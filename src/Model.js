function Model(){

    this.getMeetingSetting = getMeetingSetting
    this.clickSubmit = clickSubmit
    this.cantMeet = cantMeet
    this.getSavedTimeslot = getSavedTimeslot

    function getMeetingSetting(query) {
        return fetch('/getMeetingSetting?id='+query).then(res => res.json())
    }

    function getSavedTimeslot(query) {
        return fetch('/getUserSave?id='+query).then(res => res.json())
    }

    function clickSubmit(query, finalSchedule){
        console.log("submitted TimeSLot:", finalSchedule)
        return fetch('/submit?id='+query, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalSchedule)
          })
    }

    function cantMeet(query){
        return fetch('/getUserSave?id=' + query)
    }

    return this
}

export default new Model()