let sendBtn = document.getElementById('sendRequest').addEventListener('click', setUpRequest);
var content = document.getElementById('container');
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
// pobranie danych z imput'ów
async function getInputs() {
  let inputsToOut = new Promise(function (resolve, reject) {
    let out_obj = {};
    let url_from_inp = document.getElementById('inp_url').value;
    let req_type_inp = document.getElementById('inp_type').value;
    let req_from_inp = document.getElementById('inp_rest_request').value;
    out_obj.url = url_from_inp;
    out_obj.type = req_type_inp;
    out_obj.request = req_from_inp;
    resolve(out_obj);
  });
  let output = await inputsToOut;
  return output;
}
// wysyłanie requestu w stałym interwale czasowym
async function getResponseWithTick(apiUrl, reqType, requestBody, tick) {
  var url = apiUrl;
  var type_of_req = reqType;
  var req_body = requestBody;
  var interval = tick;
  let response_out = new Promise(function (resolve, reject) {
    let xmlHook = new XMLHttpRequest();
    xmlHook.onreadystatechange = function () {
      if (xmlHook.readyState === 4) {
        if (xmlHook.status === 200) {
          let list = xmlHook.responseText;
          resolve(xmlHook);
        } else {
          reject(xmlHook.status);
          setTimeout(function () {
            getResponseWithTick(url, type_of_req, req_body, interval);
          }, interval);
          console.log('zakończono niepowodzeniem');
        }
      }
      else {
        console.log('w trakcie...');
      }
    }
    xmlHook.open(type_of_req, url, true);
    xmlHook.send(req_body);

  });
  let output = await response_out;
  return output;
}
// wysłanie pojedynczego requestu
async function getResponse(apiUrl, reqType, requestBody) {
  var url = apiUrl;
  var type_of_req = reqType;
  var req_body = requestBody;
  let response_out = new Promise(function (resolve, reject) {
    let xmlHook = new XMLHttpRequest();
    xmlHook.onreadystatechange = function () {
      if (xmlHook.readyState === 4) {
        if (xmlHook.status === 200) {
          let list = xmlHook.responseText;

          resolve(xmlHook);
        } else {
          reject(xmlHook.status);
          console.log('zakończono niepowodzeniem');
        }
      }
      else {
        console.log('w trakcie...');
      }
    }
    xmlHook.open(type_of_req, url, true);
    xmlHook.send(req_body);

  });
  let output = await response_out;
  return output;
}
// inicjacja zdarzeń po kolei
async function setUpRequest() {
  
  let input_values = await getInputs();
 // var response = await getResponse(input_values.url, input_values.type, input_values.request);
  localStorage.setItem('single_url',input_values.url);
  localStorage.setItem('single_type',input_values.type);
  localStorage.setItem('single_json',input_values.request);
  setTimeout(function(){
    document.location.href = 'singleshow.html';
  },200)
  
  console.log(response);


}