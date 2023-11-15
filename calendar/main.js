$(document).ready(function() {

    $('.door').attr('data-enabled', 'true');
    $('button[data-page]').click(function() {
        var target = $(this).attr('data-page');
        if(target.includes('door')) {
            if($(this).attr('data-enabled') == 'true') {
                playSoundFx('open');
            }else{
                return;
            }
        }
        goToPage(target);
    });
    $('[data-show]').click(function() {
        var target = $(this).attr('data-show').split(",");
        target.forEach(function(item) {
            showElement(item);
        });
    });
    $('[data-toggle]').click(function() {
        var target = $(this).attr('data-toggle').split(",");
        target.forEach(function(item) {
            toggleElement(item);
        });
    });
    $('[data-hide]').click(function() {
        var target = $(this).attr('data-hide').split(",");
        target.forEach(function(item) {
            hideElement(item);
        });
    });
    $('[data-enable]').click(function() {        
        var target = $(this).attr('data-enable').split(",");
        target.forEach(function(item) {
            enableElement(item);
        });
    });
    $('[data-disable]').click(function() {
        var target = $(this).attr('data-disable').split(",");
        target.forEach(function(item) {
            disableElement(item);
        });
    });
    $('[data-run]').click(function() {
        var target = $(this).attr('data-run');
        window[target]();
    });
    $('[data-sound-fx]').click(function() {
        var target = $(this).attr('data-sound-fx');
        var enabled = $(this).attr('data-enabled') ?? 'true';
        if(enabled === 'true') {
            playSoundFx(target ?? null);
        }
    });
    $('[data-play]').click(function() {
        var target = $(this).attr('data-play');
        $('page:visible [data-id="'+target+'"]').get(0).play();
    });
    $('[data-stop]').click(function() {
        var target = $(this).attr('data-stop');
        $('page:visible [data-id="'+target+'"]').get(0).pause();
    });


    let doorCode = null;
    let doorNumber = null;
    $(document).on('.door[data-enabled="false"]', 'click', function(event) {
        doorNumber = $(this).find('div').text();
        doorCode =  $(this).attr('data-code');
        $('doorCodeInput').val('');
        $('doorPadlock').fadeIn();
    });

    $('.unlockDoor').click(function(event) {
        let userInput = $('doorCodeInput').val();
        if(doorCode == userInput) {
            playSoundFx('unlock');
            $(`[data-door="door${doorNumber}"]`).attr('data-enabled', 'true');
        }else{
            playSoundFx('locked');
        }


        $(`.doorPadlock`).fadeOut();
        $('doorCodeInput').val('');
        doorCode = null;
        doorNumber = null;
    });


    var dragStartX, dragStartY, initialTop, initialLeft;
    var draggable = null;
    $('[data-drag-x]').on('touchstart', function(event) {
        event.preventDefault();
        draggable = this;
        var clientX = event.clientX || event.touches[0].clientX;
        var rect = draggable.getBoundingClientRect();
        dragStartX = clientX;
        initialLeft = rect.left;

        document.addEventListener('mousemove', onMoveX);
        document.addEventListener('touchmove', onMoveX);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    });

    $('[data-drag]').on('touchstart', function(event) {
        event.preventDefault();
        draggable = this;
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        var rect = draggable.getBoundingClientRect();
        dragStartX = clientX;
        dragStartY = clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    });

    function onMove(event) {
        var clientX = event.clientX || event.touches[0].clientX;
        var newLeft = initialLeft + clientX - dragStartX;
        var clientY = event.clientY || event.touches[0].clientY;
        var newTop = initialTop + clientY - dragStartY;
        draggable.style.transform = `translateX(${newLeft}px) translateY(${newTop}px)`;
    }

    function onMoveX(event) {
        var clientX = event.clientX || event.touches[0].clientX;
        var newLeft = initialLeft + clientX - dragStartX;
        draggable.style.transform = `translateX(${newLeft}px)`;
    }
    
    function onEnd() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
    }



});


let bgAudio = null;
let bgAudioPlayer = null;
let soundAudio =  null; 
let soundAudioPlayer = null;
let soundFxAudio =  null; 
let soundFxAudioPlayer = null;
let globalInterval = null;

function goToPage(page) {
    $('page:visible').fadeOut();
    const curPage = $('page[id="' + page + '"]');
    const curBackground = $(curPage).data('bg-audio');
    const curBgVolume = $(curPage).data('bg-volume');
    const curSound = $(curPage).data('sound');
    if(globalInterval) clearInterval(globalInterval);
    playSound(curSound ?? null);
    playBackground(curBackground ?? null, curBgVolume ?? 0.5);
    $(curPage).fadeIn();
}

function playBackground(newBgAudio, bgVolume) {
    if(newBgAudio && newBgAudio !== bgAudio) {
        bgAudio = newBgAudio;
        if(bgAudioPlayer) {
            bgAudioPlayer.pause();
        }
        bgAudioPlayer = new Audio('audio/' + bgAudio + '.mp3');
        bgAudioPlayer.play();
        bgAudioPlayer.loop = true;
    }

    if(newBgAudio === null) {
        bgAudio = null;
        if(bgAudioPlayer) bgAudioPlayer.pause();
    }else{
        bgAudioPlayer.volume = bgVolume ?? 0.5;
    }
}

function playSound(newSoundAudio) {
    if(newSoundAudio) {
        soundAudio = newSoundAudio;
        if(soundAudioPlayer) {
            soundAudioPlayer.pause();
        }   
        soundAudioPlayer = new Audio('audio/' + soundAudio + '.mp3');
        setTimeout(function() {    
            soundAudioPlayer.play();
        }, 1500);
    }

    if(newSoundAudio === null) {
        soundAudio = null;
        if(soundAudioPlayer) soundAudioPlayer.pause();
    }
}


function playSoundFx(newSoundFxAudio) {
    if(newSoundFxAudio) {
        soundFxAudio = newSoundFxAudio;
        if(soundFxAudioPlayer) {
            soundFxAudioPlayer.pause();
        }   
        soundFxAudioPlayer = new Audio('audio/' + soundFxAudio + '.mp3');
        soundFxAudioPlayer.play();
    }

    if(newSoundFxAudio === null) {
        soundFxAudio = null;
        if(soundAudioFxPlayer) soundAudioFxPlayer.pause();
    }
}

function showElement(element) {
    $('page:visible [data-id="' + element + '"]').fadeIn();
}

function hideElement(element) {
    $('page:visible [data-id="' + element + '"]').fadeOut();
}

function toggleElement(element) {
    $('page:visible [data-id="' + element + '"]').fadeToggle();
}

function enableElement(element) {
    $('page:visible [data-id="' + element + '"]').attr('data-enabled', 'true');
}

function disableElement(element) {
    $('page:visible [data-id="' + element + '"]').attr('data-enabled', 'false');
}

let blurTime;
function windowFocus() {
    window.addEventListener("focus", function(event) {
        const focusTime = new Date();
        const elapsedSeconds = (focusTime - blurTime) / 1000;
        if (elapsedSeconds >= 10 && $('#door3:visible').length > 0) {
            enableElement('present-button');
            playSoundFx('sparkle');
        }
    }, false);

    window.addEventListener("blur", function(event) {
        blurTime = new Date();
        hideElement('paper-button');
        hideElement('note');
    }, false);
}

var hasGyro = false;
var waterElement = document.querySelector('#door2 .water');
async function waterCycle(event) {
    if(hasGyro==false) {
        $('#door2 .water').removeClass('a-rotating');
        hasGyro = true;
    }
    var alpha = event.alpha; // rotation around z-axis (-180 to 180)

    document.getElementById('waterElement').style.transform = `rotateZ(${alpha}deg)`;
}

function requestGyroscopeAccess(functionToCall) {
    hasGyro = false;
    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', (event) => { 
                            window[functionToCall](event);
                        });
                    }
                })
                .catch();
        } else {
            window.addEventListener('deviceorientation', (event) => { 
                window[functionToCall](event);
            });
        }
    }
}

function isDisconnected() {
    globalInterval = setInterval(function() {
        console.log(navigator.onLine);
        if (!navigator.onLine) {
            enableElement('powerbox');
        } else {
            disableElement('powerbox');
        }
    }, 3000); 
}

let javascriptNode = null;
let micStream = null;
function door4(){
    if($('#door4 .clock').hasClass('a-code') || $('#door4 .clock').hasClass('a-rotating')) { return; }
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        micStream = stream;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        let timeoutId;
        const startTimer = () => {

            $('#door4 .clock').stop().addClass('a-rotating');
            timeoutId = setTimeout(() => {
                console.log('Success!');

                $('#door4 .clock').removeClass('a-rotating').addClass('a-code');
                stream.getTracks().forEach(track => track.stop());
                javascriptNode.disconnect();
            }, 10000); // 10 seconds
        };

        startTimer();
        

        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += (array[i]);
            }

            const average = values / length;
            console.log(Math.round(average));
            if (average > 5) {
                console.log('Noise detected!');  
                const clockElement = document.querySelector('#door4 .clock');
                clockElement.classList.remove('a-rotating');
                void clockElement.offsetWidth; // force a reflow
                clockElement.classList.add('a-rotating');
                clearTimeout(timeoutId);
                startTimer();
            }
        }
    })
    .catch(err => {
        console.log('The following error occurred: ' + err.name)
    });
}

function door10(){
    let fogOpacity = 0;
    const fogElement = document.querySelector('#door10 .fog');
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        micStream = stream;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);


        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += (array[i]);
            }

            const average = values / length;
            
            if (average > 30) {
                fogOpacity = fogOpacity >= 0.98 ? 1 : fogOpacity + 0.02;
            }else{
                fogOpacity = fogOpacity <= 0.01 ? 0 : fogOpacity - 0.01 ;
            }

            fogElement.style.opacity = fogOpacity;
        }
    })
    .catch(err => {
        console.log('The following error occurred: ' + err.name)
    });
}



function stopMic(){
    if(micStream){
        micStream.getTracks().forEach(track => track.stop());
    }
    if(javascriptNode){
        javascriptNode.disconnect();
    }
}


function requestCameraAccess() {
    return navigator.mediaDevices.getUserMedia({ video: true });
}

function measureBrightness(stream) {
    const glowElement = document.querySelector('#door7 .glow');
    const roofElement = document.querySelector('#door7 .roof');
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        video.addEventListener('play', function() {
            const interval = setInterval(() => {
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let brightness = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    brightness += (0.3 * imageData[i] + 0.5 * imageData[i + 1] + 0.2 * imageData[i + 2]);
                }

                brightness /= (imageData.length / 4);
                brightness = (brightness - 127.5) / 127.5; // Normalize to -1 to 1
                let opacity = brightness - 0.8; // Calculate how much brightness is over 0.8
                opacity = Math.max(0, Math.min(1, opacity)); // Clamp between 0 and 1
                console.log(opacity);
                glowElement.style.opacity = opacity;
                // glowElement.style.opacity = brightness;
                resolve(brightness);
            }, 1000); // Measure brightness every 1 second

            video.addEventListener('ended', () => clearInterval(interval));
        });
    }); 
}

function door7(){
    requestCameraAccess()
    .then(measureBrightness)
    .then(brightness => console.log(brightness))
    .catch(error => console.error(error));
}