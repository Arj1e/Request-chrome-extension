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
// obsługa localstorage
function checkSesion(){
    let data = localStorage.getItem('userid');
        if(data === null){
            
        }else{
            document.location.href='main.html';
        }
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
            reject('No data found');
        }
    });
    let userObj = await getLoginAndPass;
    return userObj;
}
// funckja sprawdzająca użytkownika w bazie danych
async function createUserRequest(userInfoObj,restUrl) {
    let sendUserToServer = new Promise(function (resolve, reject) {
        var jsonToSend = JSON.stringify(userInfoObj);
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function (response) {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let answer = xmlhttp.responseText;
                    resolve(answer);
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
    let create_status = await sendUserToServer;

    return create_status;
}
// wykonywanie działań po kolei 
async function createUserProcedure() {

    let config = await readConfig();
    console.log(config);
    let user_info = await getUserData();
    let user_from_server = await createUserRequest(user_info,config.createUser);
    if (user_from_server== 'succes') {
        alert('utworzono nowe konto');

        setTimeout(function(){
            document.location.href='login.html'; 
        },500); 
        console.log(user_from_server);
            
    }else{
        alert('Użytkownik istnieje');
        console.log(user_from_server);
    }

}
let createBtn = document.getElementById('createUsr');
let backBtn = document.getElementById('back');
createBtn.addEventListener('click',createUserProcedure);
backBtn.addEventListener('click',function(){
    document.location.href='main.html';
})
checkSesion();
