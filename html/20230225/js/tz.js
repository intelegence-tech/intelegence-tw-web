function init() {

}

function send_contactus_form() {
    var emailValidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    var form = document.getElementsByTagName("FORM");
    var data = new FormData(form[0]);
    var valid = true;
    var invalid_message = '';
    for (const [key, value] of data) {
        var input = document.getElementById(`form-input-${key}`);
        if (value.trim().length === 0) {
            input.classList.add("invalid");
            valid = false;
        } else {
            input.classList.remove("invalid");
        }
    }
    if (!(emailValidRegex.test(data.get('email')))) {
        var input = document.getElementById(`form-input-email`);
        input.classList.add("invalid");
        valid = false;
        invalid_message = '電子郵件格式不符'
    }

    if (!valid) {
        alert(`請協助完整填寫各欄位以利儘快與您聯繫，謝謝！${invalid_message.length ? "\n(" + invalid_message + ")" : ""}`);
        return;
    }

    data.set('ts', new Date().toISOString());

    const request = new XMLHttpRequest();
    request.onreadystatechange = () => { // Call a function when the state changes.
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            alert("已收到您的來訊，我們會儘速和您聯繫，謝謝！");
        }
        else {
            alert("很抱歉，系統出現問題，如果您有需要聯繫的事宜，請先透過電話或Email和我們連絡，謝謝！");
        }
      }
    request.open("POST", "/save");
    request.send(data);
}