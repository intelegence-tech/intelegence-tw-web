var news;

function init() {
    load_news();
    Array.from(document.getElementsByTagName("a")).forEach(e => {
        e.addEventListener("click", function () {
            document.getElementById("article").style.display = "none";
            if (document.getElementById("menu") && document.getElementById("menu").style.display != "none") {
                show_menu();
            }
            document.getElementById("main").style.display = "block";
            document.getElementById("content").style.display = "block";
        }, false);
    });
    //    setTimeout(x => show_article(0), 1000)
}

function show_menu() {
    var display = document.getElementById("menu").style.display;
    var new_display = display === "none" ? "block" : "none";
    var new_icon = display === "none" ? "image/mobile/icon-close.svg" : "image/mobile/icon-mb-menu.svg";
    document.getElementById("menu").style.display = new_display;
    document.getElementById("menu_icon").src = new_icon;
}

function load_news() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => { // Call a function when the state changes.
        if (request.readyState === XMLHttpRequest.DONE) {
            data = JSON.parse(request.response);
            news = data.news;
            news_html = '';
            article_othres_html = '';
            news.forEach((row, idx) => {
                news_html += `<div class="news-row" onclick="show_article(${idx});">
                    <div class="news-date">${row.DATE.replaceAll('/', '.')}</div>
                    <div class="news-category ${row.CATEGORY}"> ${row.CATEGORY_TEXT}</div>
                    <div class="news-title"> ${row.TITLE}</div>
                  </div>\n`;
                article_othres_html += `<div id="article-${idx}" class="article-others-row" onclick="show_article(${idx});">
                    <div class="news-title"> ${row.TITLE}</div>
                    </div>\n`;

            });
            div_news_list = document.getElementById('news-list');
            div_news_list.innerHTML = news_html;
            div_article_others = document.getElementById('article-others');
            div_article_others.innerHTML = article_othres_html;

        }
    }
    request.open("GET", "/api/news");
    request.send();

}

function show_article(id) {
    document.getElementById("article_img").addEventListener("load", function () {
        console.log("article_img onload");
        document.getElementById("loading").style.display = "none";
    }, false);
    document.getElementById("loading").style.display = "block";
    document.getElementById("article_img").src = news[id].IMG_URL;
    document.getElementById("article_title").innerText = news[id].TITLE;
    document.getElementById("article_date").innerText = news[id].DATE;
    document.getElementById("article_author").innerText = news[id].AUTHOR?.trim() || '';
    document.getElementById("article_content").innerHTML = `<p>${news[id].CONTENT.replaceAll("\n", "</p><p>")}</p>`;
    document.getElementById("article").style.display = "grid";

    Array.from(document.getElementsByClassName("article-others-row")).forEach(r => {
        if (r.id == `article-${id}`) r.style.display = "none";
        else r.style.display = "block";
    });

    document.getElementById("main").style.display = "none";
    document.getElementById("content").style.display = "none";
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function send_contactus_form() {
    var emailValidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    var form = document.getElementsByTagName("FORM")[0];
    var data = new FormData(form);
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

    document.getElementById("loading").style.display = "block";

    const request = new XMLHttpRequest();
    request.onreadystatechange = () => { // Call a function when the state changes.
        if (request.readyState === XMLHttpRequest.DONE) {
            document.getElementById("loading").style.display = "none";
            if (request.status === 200) {
                alert("已收到您的來訊，我們會儘速和您聯繫，謝謝！");
                form.reset();
            } else {
                alert("很抱歉，系統出現問題，如果您有需要聯繫的事宜，請先透過電話或Email和我們連絡，謝謝！");
            }
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }
    request.open("POST", "/api/save");
    request.send(data);
}
