var content = document.getElementById('container');
var logOutBtn = document.getElementById('logOut').addEventListener('click', logOut);
var goRestBtn = document.getElementById('restAdd').addEventListener('click', function () { document.location.href = 'rest.html'; });
var goSoapBtn = document.getElementById('soapAdd').addEventListener('click', function () { document.location.href = 'soap.html'; });
var goSingleBtn = document.getElementById('singleAdd').addEventListener('click', function () { document.location.href = 'singlein.html'; });
//wczytywanie configu
async function readConfig() {
  let configValues = new Promise(function (resolve, reject) {
    var xmlconfig = new XMLHttpRequest();
    xmlconfig.overrideMimeType('aplication/json');
    xmlconfig.open('GET', 'config.json', true);
    xmlconfig.onreadystatechange = function () {
      if (xmlconfig.readyState == 4 && xmlconfig.status == '200') {
        let jsonout = JSON.parse(xmlconfig.responseText);
        resolve(jsonout);
        console.log('config loaded succesfull');
      }
    }
    xmlconfig.send(null);
  });
  let output = await configValues;
  return output;
}
function checkSesion() {

  let data = localStorage.getItem('userid');
  if (data === null) {
    document.location.href = 'login.html';
  } else {
    return data;
  }
}
// promise pobiera obiekt Json zawierający adresy oraz nazwy serwerów do pingowania
function getApisListFromServer(url, idOfUser) {
  var getApisPromise = new Promise(function (resolve, reject) {
    // tutaj podaj id uzytkownika do pobrania api
    let userId = { 'userid': idOfUser };

    let userToSend = JSON.stringify(userId);

    let xmlHook = new XMLHttpRequest();
    xmlHook.onreadystatechange = function () {
      if (xmlHook.readyState === 4) {
        if (xmlHook.status === 200) {
          let list = xmlHook.responseText;
          var listObj = JSON.parse(list);
          resolve(listObj);
        } else {
          reject(xmlHook.status);
          console.log('zakończono niepowodzeniem');
        }
      }
      else {
        console.log('w trakcie...');
      }
    }
    xmlHook.open("POST", url, true);
    xmlHook.send(userToSend);

  });
  return getApisPromise;
}
// Funkcja wysyla zapytanie do api o jego status
function sendRestRequest(apiName, apiUrl, divId, tick) {
  var url = apiUrl;
  var appName = apiName;
  var timeOut = tick
  var idOfDiv = divId;
  var divcontain = document.getElementById(idOfDiv);
  divcontain.setAttribute('class', 'row');
  let start_time = new Date().getTime();
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {

    let request_time = new Date().getTime() - start_time;

    if (this.readyState == 4 && this.status == 200) {
      divcontain.classList.add("ok");
      divcontain.innerHTML = appName + ": Odpowiada, Ping: " + request_time + "ms";
      setTimeout(function () {
        sendRestRequest(appName, url, idOfDiv, timeOut);
      }, timeOut)

    }
    if (this.status == 400) {
      divcontain.innerHTML = appName + ": Nie odpowiada, Ping: " + request_time + "ms";

    }
    if (this.status == 500) {
      divcontain.innerHTML = appName + ": Nie odpowiada, Ping: " + request_time + "ms";

    }
    if (this.status == 404) {
      divcontain.innerHTML = appName + ": Nie odpowiada, Ping: " + request_time + "ms";

    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
// funkcja wysyłająca zapytania do Soap Api
function sendSOAPRequest(apiName, apiUrl, divId, soapValue, tick) {
  var url = apiUrl;
  var appName = apiName;
  var idOfDiv = divId;
  var timeOut = tick;
  var xmlToSend = soapValue;
  var divcontain = document.getElementById(idOfDiv);
  divcontain.setAttribute('class', 'row');
  let start_time = new Date().getTime();
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {

    let request_time = new Date().getTime() - start_time;

    if (this.readyState == 4 && this.status == 200) {
      divcontain.classList.add("ok");
      divcontain.innerHTML = appName + ": Odpowiada, Ping: " + request_time + "ms";
      setTimeout(function () {
        sendSOAPRequest(appName, url, idOfDiv, xmlToSend, timeOut);
      }, timeOut)

    }

    if (this.status == 500) {
      divcontain.innerHTML = appName + ": Nie odpowiada";

    }
    if (this.status == 400) {
      divcontain.innerHTML = appName + ": Nie odpowiada";

    }
    if (this.status == 404) {
      divcontain.innerHTML = appName + ": Nie odpowiada";

    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send(xmlToSend);
}

function testconsole(toShow) {
  let numberOfServers = toShow.length;

}
function editServer() {
  console.log(this.id);
  localStorage.setItem('edit_serv', this.id);
  document.location.href = 'extras.html';
}
async function setUpCore() {
  let config = await readConfig();

  getApisListFromServer(config.getAllApis, checkSesion()).then(function (result) {

    for (let i = 0; i < result.length; i++) {
      let div = document.createElement("div");
      div.setAttribute('id', result[i].serwerid);
      div.setAttribute('class', 'row');
      div.addEventListener('click', editServer);
      content.appendChild(div);
    }
    return result;

  }).then(function (result) {

    for (let i = 0; i < result.length; i++) {
      if (result[i].stype == 'rest') {
        sendRestRequest(result[i].sname, result[i].surl, result[i].serwerid, result[i].tick);
      } else {
        sendSOAPRequest(result[i].sname, result[i].surl, result[i].serwerid, result[i].srequest, result[i].tick);
      }
    }

  }); 
}
function logOut() {
  localStorage.removeItem('userid');
  checkSesion();
}
setUpCore();