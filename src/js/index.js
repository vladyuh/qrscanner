window.addEventListener("load", function () {
    var fileUpload = document.createElement('script');
    fileUpload.src = "/js/html5-qrcode.min.js";
    fileUpload.onload = initQr;
    document.body.appendChild(fileUpload);
});

var decodedData = {};
var i = 0;

function initQr() {
    const html5QrCode = new Html5Qrcode("reader");
    var results = document.querySelector('.results');
    var resultText = document.querySelector('.results__text');
    var resultsHistory = document.querySelector('.results__history');
    //Успешная обработка QR кода
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {

        var body = document.querySelector('body');

        var item = document.createElement('p');
        item.classList.add('item');

        var copy = document.createElement('span');
        copy.classList.add('item__copyBtn');

        var share = document.createElement('span');
        share.classList.add('item__shareBtn');

        var text = document.createElement('span');
        text.classList.add('item__text');

        item.appendChild(text);
        item.appendChild(copy);
        item.appendChild(share);

        if (validURL(decodedText)) {
            //Очищаем текущий результат
            resultText.textContent = "";
            //Добавляем ссылку
            var link = document.createElement('a');
            link.setAttribute("href", decodedText);
            link.setAttribute('target', "_blank");
            link.classList.add('link');
            link.textContent = decodedText;
            resultText.appendChild(item);
            resultText.querySelector('.item__text').appendChild(link);

            item.classList.add('item-link');

        } else {
            resultText.textContent = "";
            resultText.appendChild(item);
            resultText.querySelector('.item__text').textContent = decodedText;
        }

        decodedData[i] = decodedText;
        i++;
        console.log(decodedData);

        var resultItem = document.querySelector('.results__text p.item');

        resultsHistory.prepend(resultItem.cloneNode(true));

        //Показываем попап результатов
        results.classList.add('is-active');
        body.classList.add('is-results');
        //Приостанавливаем сканер
        html5QrCode.pause();
    };
    //Конфиг сканера
    const config = {
        fps: 10,
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
        },
        aspectRatio: 1.33
    };

    function cameraStart() {
        html5QrCode.start({
            facingMode: "environment"
        }, config, qrCodeSuccessCallback);
    }

    //Запуск камеры
    var start = document.querySelector('#startScan');
    start.addEventListener('click', function(){
        cameraStart();
        this.style.display = "none";
    })
    

    var close = document.querySelector('.results__title svg');
    close.addEventListener('click', function () {
        //Скрываем попап
        results.classList.remove('is-active');
        body.classList.remove('is-results');
        //Возобновляем сканер
        if (html5QrCode.getState() === Html5QrcodeScannerState.PAUSED) {
            html5QrCode.resume();
        }
    })
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}