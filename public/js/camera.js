window.addEventListener("load", function () {
    var fileUpload = document.createElement('script');
    fileUpload.src = "/js/html5-qrcode.min.js";
    fileUpload.onload = initQr;
    document.body.appendChild(fileUpload);
});

var decodedData = {};
var i = 0;

function initQr() {

    var body = document.querySelector('body');

    var results = document.querySelector('.results');
    var resultText = document.querySelector('.results__text');
    var resultsHistory = document.querySelector('.results__history');

    const html5QrCode = new Html5Qrcode( /* element id */ "reader", {
        aspectRatio: 1
    });
    // File based scanning
    const fileinput = document.getElementById('qr-input-file');
    fileinput.addEventListener('change', e => {
        if (e.target.files.length == 0) {
            // No file selected, ignore
            return;
        }

        const imageFile = e.target.files[0];
        // Scan QR Code
        html5QrCode.scanFile(imageFile, true)
            .then(decodedText => {
                // success, use decodedText
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
            })
            .catch(err => {
                // failure, handle it.
                alert("Ошибка сканирования: " + err);
            });
    });

    var close = document.querySelector('.results__title svg');
    close.addEventListener('click', function () {
        document.querySelector('.results').classList.remove('is-active');
        body.classList.remove('is-results');
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