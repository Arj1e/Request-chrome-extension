var content = document.getElementById('container');
var logOutBtn = document.getElementById('logOut');
var backAndRemoveBtn = document.getElementById('backRmv');
// sprawdzenie sejsi
function checkSesion() {

  let data = localStorage.getItem('userid');
  if (data === null) {
    document.location.href = 'login.html';
  } else {
    return data;
  }
}
//pobranie div'ów gotowych do wypełnnienia danymi
async function getDivsToFill() {
  let divs = new Promise(function (resolve, reject) {
    let divsObj = {};
    divsObj.response = document.getElementById('response-div');
    divsObj.status = document.getElementById('status-div');
    divsObj.ready = document.getElementById('ready-div');
    resolve(divsObj);
  })
  let divsObj_out = await divs;
  return (divsObj_out);
}
//pobieranie danych z local storage
async function getValuesToRequest(){
  let valuesToOut = new Promise(function(resolve,reject){
  let value_obj = {};
  let out_url = localStorage.getItem('single_url');
  let out_type = localStorage.getItem('single_type');
  let out_json = localStorage.getItem('single_json');
  value_obj.resUrl = out_url;
  value_obj.resTyoe = out_type;
  value_obj.resJson = out_json;
  resolve(value_obj);
});
let output = await valuesToOut;
return output;

}
//usuwanie zawartosci do requestu z local storage i powrót do widoku głównego
function backNremove(){
  localStorage.removeItem('edit_serv');
  localStorage.removeItem('single_json');
  localStorage.removeItem('single_type');
  localStorage.removeItem('single_url');
  document.location.href='main.html';
}
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
//funckja inicjująca zdarzenia po kolei
async function extrasSetUp() {

  let values_to_request = await getValuesToRequest();
  console.log(values_to_request);
  let divsObj = await getDivsToFill();
  let response_to_divs = await getResponse(values_to_request.resUrl,values_to_request.resTyoe,values_to_request.resJson);
  for(let i in response_to_divs){
    console.log(i+' :'+response_to_divs[i]);
    divsObj.response.innerHTML += "<p>"+i+"</p> :"+response_to_divs[i]+"</br>";
  }
 // divsObj.response.innerHTML = response_to_divs.responseText;
  divsObj.status.innerHTML = response_to_divs.status;
  divsObj.ready.innerHTML = response_to_divs.readyState;
 
 

}
function logOut() {
  localStorage.removeItem('userid');
  checkSesion();
}
checkSesion();
extrasSetUp();
logOutBtn.addEventListener('click', logOut);
backAndRemoveBtn.addEventListener('click',backNremove);
