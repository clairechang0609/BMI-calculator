var btn = document.querySelector('.btn');
var btnWrap = document.querySelector('.btn-wrap');
var record = document.querySelector('.record');
var data = JSON.parse(localStorage.getItem('BMIinfo')) || []; //一開始為空陣列
updateData(data);

//今天日期
function today() {
    var today = new Date();
    var month = today.getMonth();
    var date = today.getDate();
    var year = today.getFullYear();
    var time = (month + 1) + '-' + date + '-' + year;
    return time;
}

//BMI數值
function bmiNum(w, h) {
    var BMIAll = w / ((h / 100) * (h / 100));
    var BMI = BMIAll.toFixed(2); //取到小數點第二位
    return BMI;
}

//儲存資料
function getRecord() {
    var heightValue = document.querySelector('#height').value;
    var weightValue = document.querySelector('#weight').value;
    var judgeFinal = '';
    var colorFinal = '';

    if (isNaN(heightValue) || isNaN(weightValue) || heightValue < 0 || weightValue < 0){
        alert('請輸入有效數字');
    } else if (heightValue == '' || weightValue == ''){
        alert('您忘了輸入資料');
    } else { //輸入正確才開始跑值
        if (bmiNum(weightValue, heightValue) >= 35) {
            judgeFinal = '重度肥胖';
            colorFinal = 'red';
        } else if (bmiNum(weightValue, heightValue) < 35 && bmiNum(weightValue, heightValue) >= 30) {
            judgeFinal = '中度肥胖';
            colorFinal = 'darkorange';
        } else if (bmiNum(weightValue, heightValue) < 30 && bmiNum(weightValue, heightValue) >= 27) {
            judgeFinal = '輕度肥胖';
            colorFinal = 'orange';
        } else if (bmiNum(weightValue, heightValue) < 27 && bmiNum(weightValue, heightValue) >= 24) {
            judgeFinal = '過重';
            colorFinal = 'orange';
        } else if (bmiNum(weightValue, heightValue) < 24 && bmiNum(weightValue, heightValue) >= 18.5) {
            judgeFinal = '理想';
            colorFinal = 'green';
        } else if (bmiNum(weightValue, heightValue) < 18.5) {
            judgeFinal = '過輕';
            colorFinal = 'blue';
        }
        var BMIlist = {
            color: colorFinal,
            judge: judgeFinal,
            BMI: bmiNum(weightValue, heightValue),
            weight: weightValue,
            height: heightValue,
            date: today()
        }
        data.push(BMIlist);
        localStorage.setItem('BMIinfo', JSON.stringify(data));
        updateData(data);
        changBtn(bmiNum(weightValue, heightValue), judgeFinal);
    }
}
btn.addEventListener('click', getRecord, false);

//將資料呈現在頁面上
function updateData(content) {
    var dataAll = '';
    var total = content.length;
    for (var i = 0; i < total; i++) {
        var color = '<li class="color ' + data[i].color + '"></li>'
        var judgeText = '<li>' + data[i].judge + '</li>';
        var bmiText = '<li><span>BMI</span>' + data[i].BMI + '</li>';
        var weightText = '<li><span>weight</span>' + data[i].weight + '</li>';
        var heightText = '<li><span>height</span>' + data[i].height + '</li>';
        var dateText = '<li><span>' + data[i].date + '</span></li>';
        var btn = '<a href="#" class="fas fa-trash-alt" data-num="' + i + '"></a>';
        dataAll += '<li class="record-box"><ul>' + color + judgeText + bmiText + weightText + heightText + dateText + '</ul>' + btn + '</li>';
    }
    record.innerHTML = dataAll;
}

// 刪除record，從父元素監聽
function deleteRecord(e) {
    e.preventDefault();
    var targetNum = e.target.dataset.num;
    if (e.target.nodeName !== 'A'){
        return
    } else {
        data.splice(targetNum, 1);
        localStorage.setItem('BMIinfo', JSON.stringify(data));
        updateData(data);
    }
}
record.addEventListener('click', deleteRecord, false);

//btn點擊改變樣式
function changBtn(BMI, judge) {
    var btnMain = '<div class="btn-new"><h5>' + BMI + '</h5><p>BMI</p><a herf="#" class="reload fas fa-sync"></a></div>';
    var btnJudge = '<h4>' + judge + '</h4>';
    btnWrap.innerHTML = btnMain + btnJudge;

    var btnNew = document.querySelector('.btn-new');
    var reload = document.querySelector('.reload');

    if (judge == '重度肥胖'){
        btnWrap.setAttribute('style', 'color: #FF1200');
        btnNew.setAttribute('style', 'border: 6px solid #FF1200');
        reload.setAttribute('style', 'background: #FF1200');
    } else if (judge == '中度肥胖' || judge == '輕度肥胖'){
        btnWrap.setAttribute('style', 'color: #FF6C03');
        btnNew.setAttribute('style', 'border: 6px solid #FF6C03');
        reload.setAttribute('style', 'background: #FF6C03');
    } else if (judge == '過重'){
        btnWrap.setAttribute('style', 'color: #FF982D');
        btnNew.setAttribute('style', 'border: 6px solid #FF982D');
        reload.setAttribute('style', 'background: #FF982D');
    } else if (judge == '理想') {
        btnWrap.setAttribute('style', 'color: #86D73F');
        btnNew.setAttribute('style', 'border: 6px solid #86D73F');
        reload.setAttribute('style', 'background: #86D73F');
    } else {
        btnWrap.setAttribute('style', 'color: #31BAF9');
        btnNew.setAttribute('style', 'border: 6px solid #31BAF9');
        reload.setAttribute('style', 'background: #31BAF9');
    }

    //改變樣式之後按重新整理btn重整頁面
    reload.onclick = function (e) {
        e.preventDefault();
        window.location.reload();
    }
}