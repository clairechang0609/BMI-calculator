const btn = document.querySelector('.btn');
const btnWrap = document.querySelector('.btn-wrap');
const record = document.querySelector('.record');
const deleteAll = document.querySelector('.delete');
const alertText = document.querySelector('.alert');
let data = JSON.parse(localStorage.getItem('BMIinfo')) || []; //一開始為空陣列
updateData(data);

//今天日期
const today = () => {
    let today = new Date();
    let month = today.getMonth();
    let date = today.getDate();
    let year = today.getFullYear();
    let time = (month + 1) + '-' + date + '-' + year;
    return time;
}

//BMI數值
const bmiNum = (w, h) => {
    let BMIAll = w / Math.pow(h / 100, 2);
    let BMI = BMIAll.toFixed(2); //取到小數點第二位
    return BMI;
}

//狀態管理
const BMIJudge = (BMI) => {
    if (BMI >= 35) {
        judgeFinal = '重度肥胖';
        colorFinal = '#FF1200';
    } else if (BMI < 35 && BMI >= 30) {
        judgeFinal = '中度肥胖';
        colorFinal = '#FF6C03';
    } else if (BMI < 30 && BMI >= 27) {
        judgeFinal = '輕度肥胖';
        colorFinal = '#FF982D';
    } else if (BMI < 27 && BMI >= 24) {
        judgeFinal = '過重';
        colorFinal = '#FF982D';
    } else if (BMI < 24 && BMI >= 18.5) {
        judgeFinal = '理想';
        colorFinal = '#86D73F';
    } else if (BMI < 18.5) {
        judgeFinal = '過輕';
        colorFinal = '#31BAF9';
    }
}

//儲存資料
const getRecord = () => {
    let heightValue = document.querySelector('#height').value;
    let weightValue = document.querySelector('#weight').value;

    if (isNaN(heightValue) || isNaN(weightValue) || heightValue < 0 || weightValue < 0){
        alertText.textContent = '＊請輸入有效數字';
    } else if (heightValue == '' || weightValue == ''){
        alertText.textContent = '＊您忘了輸入資料';
    } else { //輸入正確才開始跑值
        alertText.textContent = '';       
        BMIJudge(bmiNum(weightValue, heightValue));
        const BMIlist = {
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
        changBtn(BMIlist.BMI, BMIlist.judge, BMIlist.color);
    }
}
btn.addEventListener('click', getRecord, false);

//將資料呈現在頁面上
function updateData(content) {
    var dataAll = '';
    var total = content.length;
    for (let i = 0; i < total; i++) {
        dataAll += `<li class="record-box">
                        <ul>
                            <li class="color" style="background: ${data[i].color}"></li>
                            <li>${data[i].judge}</li>
                            <li><span>BMI</span>${data[i].BMI}</li>
                            <li><span>weight</span>${data[i].weight}</li>
                            <li><span>height</span>${data[i].height}</li>
                            <li><span>${data[i].date}</span></li>
                        </ul>
                        <a href="#" class="fas fa-trash-alt" data-num="${i}"></a>
                    </li>`;
    }
    record.innerHTML = dataAll;
}

// 刪除record，從父元素監聽
const deleteRecord = e => {
    e.preventDefault();
    let targetNum = e.target.dataset.num;
    if (e.target.nodeName !== 'A'){
        return
    } else {
        data.splice(targetNum, 1);
        localStorage.setItem('BMIinfo', JSON.stringify(data));
        updateData(data);
    }
}
record.addEventListener('click', deleteRecord, false);

//刪除全部紀錄
const deleteAllRecord = e => {
    e.preventDefault();
    data = [];
    localStorage.setItem('BMIinfo', JSON.stringify(data));
    updateData(data);
}
deleteAll.addEventListener('click', deleteAllRecord, false);

//btn點擊改變樣式
const changBtn = (BMI, judge, color) => {
    btnWrap.innerHTML = `<div class="btn-new">
                            <h5>${BMI}</h5>
                            <p>BMI</p>
                            <a herf="#" class="reload fas fa-sync"></a>
                        </div>
                        <h4>${judge}</h4>`;

    let btnNew = document.querySelector(`.btn-new`);
    let reload = document.querySelector(`.reload`);

    btnWrap.setAttribute(`style`, `color: ${color}`);
    btnNew.setAttribute(`style`, `border: 6px solid ${color}`);
    reload.setAttribute(`style`, `background: ${color}`);

    //改變樣式之後按重新整理btn重整頁面
    reload.onclick = e => {
        e.preventDefault();
        btnWrap.innerHTML = `<input type="button" class="btn" value="看結果">`;
        document.querySelector('#height').value = '';
        document.querySelector('#weight').value = '';
    }
}