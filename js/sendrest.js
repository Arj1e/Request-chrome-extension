var userId = localStorage.getItem('userid');
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
// wysyłanie danych do rest do bazy danych
async function sendRestToServer(apiUrl, soapToAddObj) {
  var sendSoapInfo = new Promise(function (resolve, reject) {

    var jsonToSend = JSON.stringify(soapToAddObj);
    let xmlHook = new XMLHttpRequest();
    xmlHook.onreadystatechange = function () {
      if (xmlHook.readyState === 4) {
        if (xmlHook.status === 200) {
          let answer = xmlHook.responseText;

          resolve(answer);
        } else {
          reject(xmlHook.status);
          console.log('zakończono niepowodzeniem');
        }
      }
      else {
        console.log('w trakcie...');
      }
    }
    xmlHook.open("POST", apiUrl, true);
    xmlHook.send(jsonToSend);

  });
  let outPutInfo = await sendSoapInfo;
  return outPutInfo;

}
// pobranie danych z inputów
async function getValues() {
  let returnJsonObcjet = new Promise(function (resolve, reject) {
    let apiUrl = document.getElementById('inp_rest_url').value;
    let apiName = document.getElementById('inp_rest_name').value;
    let apiRequest = document.getElementById('inp_rest_request').value;
    let apiTick = document.getElementById('inp_rest_tick').value;
    let userObj = {};
    userObj.apiurl = apiUrl;
    userObj.apiname = apiName;
    userObj.apirequest = apiRequest;
    userObj.apitype = 'rest';
    userObj.userid = userId;
    userObj.tick= apiTick;
    resolve(userObj);
  })
  let output_obj = await returnJsonObcjet;
  return output_obj;
}
//inicjalizowanie zdarzeń po kolei
async function startSendingProcess() {
  let userObj_JSON = await getValues();
  let config = await readConfig();

  sendRestToServer(config.addApi, userObj_JSON).then(function (result) {
    console.log(result);
    setTimeout(function(){document.location.href= 'main.html';},400);
  });
  
}
let sendButton= document.getElementById('sendRest');
sendButton.addEventListener('click', startSendingProcess);