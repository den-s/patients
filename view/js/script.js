const headers = ['SL', 'Date', 'Diagnosis', 'Weight', 'Doctor']

function createElement (el, options) {
  const $el = document.createElement(el)
  if (options) {
    for (const [key, val] of options) {
      $el[key] = val
    }
  }

  return $el
}

function Patients () {
  let currentPatient = null
  let payload = {}

  this.setCurrentPatient = (event) => {
    currentPatient = event.target.value
  }

  this.getPatients = async function (event) {
    console.log('this.currentPatient ====> ', currentPatient)
    const response = await fetch(`https://jsonmock.hackerrank.com/api/medical_records?userId=${currentPatient}`)
    if (response.ok) {
      payload = await response.json()
    }
    console.log('this.payload ====> ', payload)
  }

  this.drawTable = () => {
    const tableHeader = document.getElementById('table-header')
    const tr = createElement('tr')
    const td = createElement('td')

    for (const header in headers) {
      const th = createElement('th')
      th.innerText = header
      tr.append(th)
    }
    tableHeader.append.tr
  }
}

(function bindActions () {
  const patients = new Patients()
  document.getElementById('patient-select').addEventListener('click', patients.setCurrentPatient)
  document.getElementById('submit-btn').addEventListener('click', patients.getPatients)
  patients.drawTable()
})()
