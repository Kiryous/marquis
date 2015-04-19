// Функция вывода текста по строкам
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// Отрисовка цитаты канвасом
function createImage() {
    var canvasId = 'image-debug';
    var canvas = document.getElementById(canvasId),
        ctx = canvas.getContext('2d'),
        cover = document.getElementById('cover'),
        text = document.getElementById('text'),
        title = document.getElementById('title'),
        // subtitle = document.getElementById('subtitle'),
        backgroundImage = document.getElementById('background-image'),
        bgPosition = document.getElementById('bg-position').value;

    // Собираем параметры заголовка из скрытых полей
    var titleFontFamily = document.getElementById('title-font-family').value,
        titleFontSize = document.getElementById('title-font-size').value,
        titleFontWeight = document.getElementById('title-font-weight').value;

     // Склеиваем параметры заголовка
    var titleFontStyle = titleFontWeight + ' ' + titleFontSize + 'px ' + titleFontFamily,
        maxWidth = '800';

    // Включаем видимость канваса
    document.getElementById(canvasId).style.display='block';

    canvas.height = cover.offsetHeight;
    canvas.width = cover.offsetWidth;

    // Получаем высоту фоновой картинки 
    var scaleW = canvas.width / backgroundImage.clientWidth;
    var scaleH = canvas.height / backgroundImage.clientHeight;
    var scale = scaleW > scaleH ? scaleW : scaleH;
    var cropWidth = backgroundImage.width * scale;
    var cropHeight = backgroundImage.height * scale;

    // Рисуем отцентрованную по вертикали картинку 
    ctx.drawImage(backgroundImage, 0, -bgPosition*0.01*(cropHeight-canvas.offsetHeight), cropWidth, cropHeight);
    
    // Затемняем картинку 
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill();

    // Пишем заголовок
    ctx.font = titleFontStyle;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.textAlign = 'center';
    wrapText(ctx, title.value, 485, 151, maxWidth, 1.25 * titleFontSize);

    // Пишем логотип
    ctx.font = '24px Shadow';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'center';
    ctx.fillText('Молоко', 480, 448);

    // Пишем подзаголовок (пока нет)
    // ctx.font = authorStyle;
    // ctx.fillText(author.value, 90, 60 + quote.clientHeight);
}

// Чтение и вставка файла из инпута
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var cover = document.getElementById('cover');

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                cover.style.backgroundImage = 'url(' + e.target.result + ')';
                var backgroundImage = document.getElementById('background-image');
                backgroundImage.src = e.target.result;
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
    setTimeout(createImage, 100);
}

// Вставка файла по ссылке
function changeBg(url) {
    var backgroundImage = document.getElementById('background-image');
    document.getElementById('cover').style.backgroundImage = 'url(' + url + ')';
    backgroundImage.crossOrigin = "Anonymous";
    backgroundImage.onload = createImage();
    backgroundImage.src = url;
}

function changeBgPosition (position) {
	document.getElementById('cover').style.backgroundPosition = 'center ' + position +'%';
	createImage();
}

//Транслитерация названия файла
function transLit(w, v) {
    var tr = 'a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
    var ww= '', ch = '';
    w = w.toLowerCase().replace(/ /g, '-');
    for (i = 0; i < w.length; ++i) {
        cc = w.charCodeAt(i);
        if (cc >= 1072) {ch= tr[cc - 1072];} else {ch = w[i];}
        ww += ch;
    }
    return (ww.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/[-]{2,}/gim, '-').replace(/^\-+/g, '').replace(/\-+$/g, ''));
}

// Создание кнопки скачивания
function downloadImg(link) {
    var canvasId = 'image-debug';
    var canvas = document.getElementById(canvasId),
        title = document.getElementById('title'),
        subtitle = document.getElementById('subtitle');

    createImage();
    var filename = title.value.slice(0,15)+'...(Молоко).png';
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
}

function showPreview(button) {
    var canvas = document.getElementById('image-debug');
    createImage();
    if (canvas.style.visibility=='hidden'|canvas.style.visibility=='') { 
        canvas.style.visibility = 'visible';
        button.className='button button_selected';
    } else if (canvas.style.visibility=='visible') {
        canvas.style.visibility = 'hidden';
        button.className='button';
    }
}


// Отрисовка при изменении
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('title').addEventListener('change', createImage, false);
// document.getElementById('subtitle').addEventListener('change', createImage, false);
// document.getElementById('imageUrl').addEventListener('change', changeBg(this.value), false);
document.getElementById('bg-position').addEventListener('change', changeBgPosition, false);