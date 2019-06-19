var config;
// obsługa sesji
function checkSesion() {
    let data = localStorage.getItem('userid');
    if (data === null) {

    } else {
        document.location.href = 'main.html';
    }
}
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
async function assignConfig() {
    config = await readConfig();
    //console.log(config);
}
//funkcja pobierająca login i pass
async function getUserData() {
    var getLoginAndPass = new Promise(function (resolve, reject) {
        let userData = {};
        let log_val = document.getElementById('inp_password').value;
        let pass_val = document.getElementById('inp_password').value;
        if (log_val != '' && pass_val != '') {
            userData.login = log_val;
            userData.password = pass_val;
            resolve(userData);
        } else {
            alert('Uzupełnij pola !');
        }
    });
    let userObj = await getLoginAndPass;
    return userObj;
}
// funckja sprawdzająca użytkownika w bazie danych
async function checkIfUserExist(userInfoObj, restUrl) {
    let sendUserToServer = new Promise(function (resolve, reject) {
        var jsonToSend = JSON.stringify(userInfoObj);
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function (response) {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let answer = xmlhttp.responseText;
                    var answerFromServerObj = JSON.parse(answer);
                    resolve(answerFromServerObj);
                } else {
                    reject(xmlhttp.status);
                    console.log('Problem z serwerem, nie można zautoryzować. Status: ' + xmlhttp.status);
                }
            }
            else {
                console.log('w trakcie...');
            }
        }
        xmlhttp.open("POST", restUrl, true);
        xmlhttp.send(jsonToSend);
    });
    let userId = await sendUserToServer;

    return userId;
}
//inicjacja procedury logowania
async function loginProcedure() {
    let user_info = await getUserData();
    let user_from_server = await checkIfUserExist(user_info, config.checkUser);
    if (user_from_server.length == 0) {
        alert('Błędny login lub hasło!');
    } else {
        console.log('istnieje');
        let id_to_cookie = user_from_server[0].id;
        localStorage.setItem("userid", id_to_cookie);
        document.location.href = 'main.html';
    }
}
var logInBtn = document.getElementById("logIn");
var createUsr = document.getElementById("create");

logInBtn.addEventListener('click', loginProcedure);
createUsr.addEventListener('click', function () { document.location.href = 'create.html' });
assignConfig();
checkSesion();

