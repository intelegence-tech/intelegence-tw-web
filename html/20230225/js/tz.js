function init() {

}

function send_contactus_form() {
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
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data['email'])) {
        var input = document.getElementById(`form-input-email`);
        input.classList.add("invalid");
        valid = false;
        invalid_message = '電子郵件格式不符'
    }

    if (!valid) {
        alert(`請協助完整填寫各欄位以利儘快與您聯繫，謝謝！${invalid_message.length ? "\n(" + invalid_message + ")" : ""}`);
    }
}