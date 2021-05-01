window.addEventListener('DOMContentLoaded', function() {

    /**
     * @TODO
     * video sync
     * audio sync
     * canvas draw
     * buffer check
     */
    let watchTrackingVideoProgress = null;

    const video = document.querySelector('video');

    const videoElapsed = document.querySelector(".video-elapsed");
    const videoDuration = document.querySelector(".video-duration");
    const videoProgress = document.getElementById('videoProgress');

    const videoSlider = document.getElementById('videoSlider');
    const videoIndicator = document.getElementById('videoIndicator');

    const timeCodeArrowBox = document.getElementById('timeCodeArrowBox');
    const timeCodeArrowBoxText = timeCodeArrowBox.children[0];

    const volumeProgress = document.getElementById('volumeProgress');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIndicator = document.getElementById('volumeIndicator');

    const btnPlayPause = document.getElementById('btnPlayPause');
    const btnMute = document.getElementById('btnMute');

    const playVideo = async function() {
        video.play();
        trackingVideoProgress();
    }

    const pauseVideo = async function() {
        video.pause();
        stopTrackingVideoPlayProgress();
    }

    const getElementPercent = (element, clientX) => {
        const cursorPosition = clientX - element.offsetLeft;
        let percentage = cursorPosition / element.clientWidth * 100;

        if (percentage > 100) {
            percentage = 100;
        }

        if (percentage < 0) {
            percentage = 0;
        }

        return percentage;
    };

    const updateProgressBar = function(slider, indicator, percentage) {
        slider.style.width = percentage +'%';
        indicator.style.left = percentage +'%';
    }

    const adjustAudioVolume = function(e) {
        const percentage = getElementPercent(volumeProgress, e.clientX);
        updateProgressBar(volumeSlider, volumeIndicator, percentage);
    }

    const adjustVideoProgress = function(e) {
        const percentage = getElementPercent(videoProgress, e.clientX);
        updateProgressBar(videoSlider, videoIndicator, percentage);

        video.currentTime = (e.offsetX / videoProgress.offsetWidth) * video.duration;
    }

    function onVideoProgressMouseMove(event) {
        if (!isNaN(video.duration)) {
            const rect = videoProgress.getBoundingClientRect();
            const relX = event.pageX - (rect.left + document.body.scrollLeft);
            const relXPercent = (relX / videoProgress.offsetWidth) * 100;
            const relFormattedTime = secondsToHms((video.duration * relXPercent) / 100);

            timeCodeArrowBox.style.opacity = 1;
            timeCodeArrowBox.style.left = relXPercent + '%';
            timeCodeArrowBoxText.innerText = relFormattedTime;
        }
    }

    function onVideoProgressMouseOut() {
        timeCodeArrowBox.style.opacity = 0;
    }

    btnMute.addEventListener("click", function() {
        const isMute = this.classList.contains('video-icons-volume-high');

        if(isMute) {
            this.classList.replace('video-icons-volume-high', 'video-icons-volume-mute');
        } else {
            this.classList.replace('video-icons-volume-mute', 'video-icons-volume-high');
        }
    });

    btnPlayPause.addEventListener("click", function() {
        const isPressPlay = this.classList.contains('video-icons-play');

        if(isPressPlay && video.paused) {
            this.classList.replace('video-icons-play', 'video-icons-pause');
            playVideo();
        } else {
            this.classList.replace('video-icons-pause', 'video-icons-play');
           pauseVideo();
        }
    });




    // video.addEventListener('timeupdate', updateProgressPlayed);

    videoProgress.addEventListener('mousemove', onVideoProgressMouseMove);
    videoProgress.addEventListener('mouseout', onVideoProgressMouseOut);

    videoProgress.addEventListener('mousedown',function(e){
        e.preventDefault();
        pauseVideo();
        adjustVideoProgress(e);


        window.addEventListener('mousemove', adjustVideoProgress, false);
        window.addEventListener('mouseup', function handler (e) {
            e.preventDefault();
            playVideo();

            window.removeEventListener('mousemove', adjustVideoProgress, false);
            window.removeEventListener('mouseup', handler, false);
        }, false);
    });

    volumeProgress.addEventListener('mousedown',function(e){
        e.preventDefault();
        adjustAudioVolume(e);

        window.addEventListener('mousemove', adjustAudioVolume, false);
        window.addEventListener('mouseup', function handler (e) {
            e.preventDefault();

            window.removeEventListener('mousemove', adjustAudioVolume, false);
            window.removeEventListener('mouseup', handler, false);
        }, false);
    });

    video.onloadeddata = function() {
        videoElapsed.innerText = secondsToHms(video.currentTime);
        videoDuration.innerText = secondsToHms(video.duration);
    };

    function secondsToHms(msec) {
        const s = Math.floor(msec % 3600 % 60);
        const m = Math.floor(msec % 3600 / 60);
        const h = Math.floor(msec / 3600);

        return (h > 0 ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function trackingVideoProgress() {
        updatePlayProgress();
        watchTrackingVideoProgress = window.requestAnimationFrame(trackingVideoProgress);
    }

    function stopTrackingVideoPlayProgress() {
        window.cancelAnimationFrame(watchTrackingVideoProgress);
    }

    function updatePlayProgress() {
        videoElapsed.innerText = secondsToHms(video.currentTime);
        const widthvi = video.currentTime / video.duration * 100;

        videoSlider.style.width = widthvi + '%';
        videoIndicator.style.left = widthvi + "%";

        if (widthvi === 100) {
            pauseVideo();
        }
    }
});




/*

function drawVideos() {
    const videoContainer = document.querySelector('#test');
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const height = 200;
    const width = 320;
    canvas.height = height;

    function drawFrame() {
        const videos = videoContainer.querySelectorAll('video');
        canvas.width = videos.length * width;
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0, len = videos.length; i < len; i++) {
            const video = videos[i];
            context.drawImage(video, i * width, 0, width, height);
        }
        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
}


document.addEventListender("DOMContentLoaded", ()=> {
    drawVideos();
})

var time_total;
var timeout_setter;
var player;
var tag = document.createElement("script");//This code loads the IFrame Player API code asynchronously

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//This function creates an <iframe> (and YouTube player) OR uses the iframe if it exists at the "player" element after the API code downloads
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player",
        {
            height: "850",
            width: "477",
            videoId: "2GvIq2SpVFM",
            events:
                {
                    "onReady": onPlayerReady,
                    "onStateChange": onPlayerStateChange
                }
        });
}

//The API will call this function when the video player is ready
function onPlayerReady(event) {
    event.target.playVideo();
    time_total = convert_to_mins_and_secs(player.getDuration(), 1);
    loopy();
}

function loopy() {
    var current_time = convert_to_mins_and_secs(player.getCurrentTime(), 0);
    document.getElementById("progress-bar").style.width = (player.getCurrentTime() / player.getDuration()) * 100 + "%";
    console.log(current_time + " / " + time_total);
    timeout_setter = setTimeout(loopy, 1000);
}

function convert_to_mins_and_secs(seconds, minus1) {
    var mins = (seconds >= 60) ? Math.round(seconds / 60) : 0;
    var secs = (seconds % 60 != 0) ? Math.round(seconds % 60) : 0;
    var secs = (minus1 == true) ? (secs - 1) : secs; //Youtube always displays 1 sec less than its duration time!!! Then we have to set minus1 flag to true for converting player.getDuration()
    var time = mins + ":" + ((secs < 10) ? "0" + secs : secs);
    return time;
}

// 5. The API calls this function when the player's state changes
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        console.log("END!");
        clearTimeout(timeout_setter);
    } else {
        console.log(event.data);
    }
}*/
