(function () {

  navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, function (stream) {

      var mediaStream = stream;
      var video = document.querySelector('.camera__video');

      video.src = URL.createObjectURL(mediaStream);
      setInterval(captureFrame, 40);

    }, function (err) {
      alert('error');
    });
  }


  function captureFrame() {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas');
    var filterName = document.querySelector('.controls__filter').value;

    var ctx = canvas.getContext('2d');


    ctx.drawImage(video,0,0);
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      var pixel = [data[i], data[i + 1], data[i + 2]];
      pixel = applyFilterToPixel(pixel, filterName);
      data[i] = pixel[0];
      data[i + 1] = pixel[1];
      data[i + 2] = pixel[2];
      delete pixel;
    }
    imageData.data = data;
    //set the data back
    ctx.putImageData(imageData,0,0);
    delete imageData;
  }

  function applyFilterToPixel(pixel, filterName) {
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
  /*

    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();

                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };

    var applyFilterToPixel = function (pixel) {
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

        var filterName = document.querySelector('.controls__filter').value;

        return filters[filterName](pixel);
    };

    var applyFilter = function () {
        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                var pixel = canvas.getContext('2d').getImageData(x, y, 1, 1);

                pixel.data = applyFilterToPixel(pixel.data);

                canvas.getContext('2d').putImageData(pixel, x, y);
            }
        }
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext('2d').drawImage(video, 0, 0);
        applyFilter();
    };

    getVideoStream(function () {
        captureFrame();

        setInterval(captureFrame, 16);
    });*/
})();
