const headers = ['SL', 'Date', 'Diagnosis', 'Weight', 'Doctor'];

const prepareDate = (ts) => {
  let myTS = ts
  if (typeof ts === 'string') {
    const dateArray = ts.split("-");
    const myDate = new Date( dateArray[2], dateArray[1] - 1, dateArray[0]);
    myTS = myDate.getTime();
  }
  const date = new Date(myTS);
  const day = `0${date.getDay()}`
  const month = `0${date.getMonth()}`
  return `${day.substr(-2)}/${month.substr(-2)}/${date.getFullYear()}`
}

function Table () {
  const $tableHeader = document.getElementById('table-header');
  const $tableBody = document.getElementById('table-body');
  const createElement = (el, options) => {
    const $el = document.createElement(el);
    if (options) {
      for (const [key, val] of options) {
        $el[key] = val;
      }
    }
    return $el;
  }

  const renderRow = (values, type = 'td') => {
    const tr = createElement('tr');
    for (const item of values) {
      const th = createElement(type);
      th.innerText = item;
      tr.append(th);
    }
    return tr;
  }

  const prepareDataForRow = (data) => {
    return [
      data.userId,
      prepareDate(data?.timestamp),
      `${data.diagnosis?.name} ${data.diagnosis?.id ? '(' + data.diagnosis?.id + ')' : null}`,
      data.meta?.weight,
      data.doctor?.name
    ]
  }

  this.drawTable = (payload) => {
    $tableHeader.appendChild(renderRow(headers, 'th'));

    for (const item of payload.data.sort((a, b) => a.timestamp < b.timestamp)) {
     $tableBody.appendChild(renderRow(prepareDataForRow(item)))
    }
  }

  this.clearTable = () => {
    $tableBody.innerHTML = ''
    $tableHeader.innerHTML = ''
  }
}

function UserInfo() {
  this.renderUserInfo = (pl) => {
    for (const item of pl) {
      if (item.userName && item.userDob && item?.meta?.height) {
        document.getElementById('patient-name').innerText = item.userName;
        document.getElementById('patient-dob').innerText = prepareDate(item.userDob);
        document.getElementById('patient-height').innerText = item.meta.height;
        break;
      }
    }
  }
}

function Patients () {
  let currentPatient = null;
  let payload = null
  const table = new Table();
  const userInfo = new UserInfo();
  const $filterBtn = document.getElementById('submit-btn')
  const $loader = document.getElementById('loader-view')
  const $profileView = document.getElementById('profile-view')

  const toggleButtonState = (isRemove = false) => {
    if ($filterBtn.hasAttribute('disabled') || isRemove) $filterBtn.removeAttribute('disabled');
    else $filterBtn.setAttribute('disabled', 'disabled');
  }

  const toggleLoader = () => {
    if (!$loader.style.display || $loader.style.display=== 'none') {
      $loader.style.display = 'block';
    }
    else $loader.style.display = 'none';
  }

  const toggleData = (isShow) => {
    if (!$profileView.style.display || $profileView.style.display=== 'none' || isShow) $profileView.style.display = 'block';
    else $profileView.style.display = 'none';
  }

  this.setCurrentPatient = (event) => {
    const lastPatient = currentPatient
    currentPatient = event?.target?.value;
    toggleButtonState(!!currentPatient);
  }

  this.getPatients = async (event) => {
    toggleLoader();
    table.clearTable()
    const response = await fetch(`https://jsonmock.hackerrank.com/api/medical_records?userId=${currentPatient}`);
    if (response.ok) {
      payload = await response.json()
      table.drawTable(payload);
      userInfo.renderUserInfo(payload.data)
      toggleData(true)
    } else {
      console.warn(`Error number #${response.status}`);
      toggleData()
    }
    toggleLoader();
  }
}

(function bindActions () {
  const patients = new Patients();

  document.getElementById('patient-select').value = -1
  patients.setCurrentPatient(null)

  document.getElementById('patient-select').addEventListener('click', patients.setCurrentPatient);
  document.getElementById('submit-btn').addEventListener('click', patients.getPatients);
})()
