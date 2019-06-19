var content = document.getElementById('container');
var logOutBtn = document.getElementById('logOut');
var backAndRemoveBtn = document.getElementById('backRmv');
var removeBtn = document.getElementById('removeRow');
// obsługa configu 
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
// spraawdzanie sesji
function checkSesion() {

  let data = localStorage.getItem('userid');
  if (data === null) {
    document.location.href = 'login.html';
  } else {
    return data;
  }
}
//pobranie divów do wypełnienia danymi
async function getDivsToFill() {
  let divs = new Promise(function (resolve, reject) {
    let divsObj = {};
    divsObj.apiName = document.getElementById('apinameDiv');
    divsObj.apiType = document.getElementById('apitypeDiv');
    divsObj.apiResponse = document.getElementById('responseDiv');
    divsObj.apiRequest = document.getElementById('requestDiv');
    resolve(divsObj);
  })
  let divsObj_out = await divs;
  return (divsObj_out);
}
// pobranie id do wykonania requestu z local storage
async function getServerId() {
  let serwer_ID = new Promise(function (resolve, reject) {

    let id_from_storage = localStorage.getItem('edit_serv');
    resolve(id_from_storage);

  })
  let output_ID = await serwer_ID;
  return (output_ID);
}
// poranie danych do requestu z bazy danych
async function getApiInfo(url, idOfRow) {
  var getApisPromise = new Promise(function (resolve, reject) {
    // tutaj podaj id uzytkownika do pobrania api
    let userId = { 'serwerid': idOfRow };

    let serwerToDownload = JSON.stringify(userId);

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
    xmlHook.send(serwerToDownload);

  });
  let output_Info = await getApisPromise;
  return output_Info;
}
// usuwanie danych Api z bazy danych
async function deleteFromServer(url, idOfRow) {
  var deleteApi = new Promise(function (resolve, reject) {
    // tutaj podaj id uzytkownika do pobrania api
    let serverId = { 'serwerid': idOfRow };

    let rowToDelete = JSON.stringify(serverId);

    let xmlHook = new XMLHttpRequest();
    xmlHook.onreadystatechange = function () {
      if (xmlHook.readyState === 4) {
        if (xmlHook.status === 200) {
          let list = xmlHook.responseText;

          resolve(list);
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
    xmlHook.send(rowToDelete);

  });
  let output_Info = await deleteApi;
  return output_Info;
}
// wysyłanie requestu do api
async function sendRequest(apiUrl, value) {

  let response_from_server = new Promise(function (resolve, reject) {

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          let list = xmlhttp.responseText;
          let listObj = JSON.parse(list);
          resolve(listObj);
        } else {
          let list = xmlhttp.responseText;
          let listObj = JSON.parse(list);
          reject(listObj);
          console.log('zakończono niepowodzeniem');
        }
      }
      else {
        console.log('w trakcie...');
      }
    }
    xmlhttp.open("GET", apiUrl, true);
    xmlhttp.send(value);
  })
  let response_OUT = await response_from_server;
  return (response_OUT);
}
function testconsole(toShow) {
  let numberOfServers = toShow.length;

}
//usuwanie id api z localstorage natępnie powrót do main
function backNremove() {
  localStorage.removeItem('edit_serv');
  document.location.href = 'main.html';
}
// inicjalizacja działań po kolei
async function extrasSetUp() {
  let config = await readConfig();
  let server_Id = await getServerId();
  let serwer_info_obj = await getApiInfo(config.singleApiGet, server_Id);
  console.log(serwer_info_obj);
  let divsObj = await getDivsToFill();
  let singleSerwerObject = serwer_info_obj[0];
  let responseFromApi = await sendRequest(singleSerwerObject.surl, singleSerwerObject.srequest);
  divsObj.apiName.innerHTML = singleSerwerObject.sname;
  divsObj.apiType.innerHTML = singleSerwerObject.stype;
  divsObj.apiRequest.innerHTML = singleSerwerObject.srequest;
  //divsObj.apiResponse.innerHTML = responseFromApi;
  for(let i in responseFromApi){
    //console.log(i+' :'+response_to_divs[i]);
    divsObj.apiResponse.innerHTML += "<p>"+i+"</p> :"+responseFromApi[i]+"</br>";
  }
}
// usuwanie api z bazy danych po id api
async function deleteApi() {
  if (confirm('Aby usunąć naciśnij ok')) {
    let config = await readConfig();
    let idToDelete = await getServerId();
    let setUpDeleteRequest = deleteFromServer(config.deleteApi, idToDelete);
    console.log(setUpDeleteRequest);
    setTimeout(function () {
      document.location.href = 'main.html';
    }, 100)

  } else {
    // Do nothing!
  }
}
function logOut() {
  localStorage.removeItem('userid');
  checkSesion();
}
checkSesion();
extrasSetUp();
logOutBtn.addEventListener('click', logOut);
backAndRemoveBtn.addEventListener('click', backNremove);
removeBtn.addEventListener('click', function () {
  deleteApi();
});

