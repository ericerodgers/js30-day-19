const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`OH NO`, err);
        });
};

function paintToCanvas() {
    [canvas.width, canvas.height] = [video.videoWidth, video.videoHeight];
    setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //take the pixels out of canvas
        let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //Mess with the pixels
        //1. Red Effect
            //pixels = redEffect(pixels);
        //2. RGB Split
            //pixels = rgbSplit(pixels);
        //3.Blur Effect
            //ctx.globalAlpha = 0.1;
        //4. Green Screen
            pixels = greenScreen(pixels);
        //put the pixels back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    //play the sound
    snap.currentTime = 0;
    snap.play();
    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i=0; i<pixels.data.length; i+=4) {
        pixels.data[i] = pixels.data[i]+100;// red channel
        pixels.data[i+1] = pixels.data[i+1]-50;// green channel
        pixels.data[i+2] = pixels.data[i+2]*0.5;// blue channel
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i=0; i<pixels.data.length; i+=4) {
        pixels.data[i-150] = pixels.data[i];// red channel
        pixels.data[i+100] = pixels.data[i+1];// green channel
        pixels.data[i-150] = pixels.data[i+2];// blue channel
    }
    return pixels;
}

function greenScreen(pixels) {
const levels = {};

document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
    console.log();
});

    for(let i=0; i<pixels.data.length; i+=4) {
    red = pixels.data[i];
    green = pixels.data[i+1];
    blue = pixels.data[i+2];
    alpha = pixels.data[i+3];

    if (red>=levels.rmin
        && red<=levels.rmax
        && green>=levels.gmin
        && green<=levels.gmax
        && blue>=levels.bmin
        && blue<=levels.bmax) {
            pixels.data[i+3] = 0;
        }
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);