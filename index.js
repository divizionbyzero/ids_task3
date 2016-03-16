(function () {

  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, function (stream) {
          var video = document.querySelector('.camera__video');
          var mediaStream = stream;
          video.src = URL.createObjectURL(mediaStream);
          video.onloadedmetadata = function () {
            setInterval(captureFrame, 40);
          };
        }, function (err) {
          console.log("The following error occured: " + err.name);
        }
    );
  } else {
    console.log("getUserMedia not supported");
  }

  var captureFrame = function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas'),
        filterName = document.querySelector('.controls__filter').value,
        ctx,
        imageData,
        data,
        pixel = [];

    ctx = canvas.getContext('2d');
    ctx.drawImage(video,0,0);
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      pixel = [data[i], data[i + 1], data[i + 2]];
      pixel = applyFilterToPixel(pixel, filterName);
      data[i] = pixel[0];
      data[i + 1] = pixel[1];
      data[i + 2] = pixel[2];
    }
    ctx.putImageData(imageData,0,0);
  };

  var applyFilterToPixel =  function (pixel, filterName) {
    var filters = {
      invert: function (pixel) {
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];

        return pixel;
      },
      grayscale: function (pixel) {
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        pixel[0] = pixel[1] = pixel[2] = v;

        return pixel;
      },
      threshold: function (pixel) {
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
        pixel[0] = pixel[1] = pixel[2] = v;

        return pixel;
      }
    };
    return filters[filterName](pixel);
  };
})();
