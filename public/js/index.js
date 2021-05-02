window.addEventListener('DOMContentLoaded', function () {

    /**
     * @TODO
     * video sync
     * audio sync
     * canvas draw
     * buffer check
     * bookmark
     * video clip, clipping
     * download
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

    // 제거 될 항목.
    video.onloadeddata = function () {
        videoElapsed.innerText = secondsToHms(video.currentTime);
        videoDuration.innerText = secondsToHms(video.duration);
    };

    const playVideo = async function () {
        video.play();
        btnPlayPause.classList.replace('video-icons-play', 'video-icons-pause');
        trackingVideoProgress();
    }

    const pauseVideo = async function () {
        video.pause();
        btnPlayPause.classList.replace('video-icons-pause', 'video-icons-play');
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

    const updateProgressBar = function (slider, indicator, percentage) {
        slider.style.width = percentage + '%';
        indicator.style.left = percentage + '%';
    }

    const adjustAudioVolume = function (e) {
        const percentage = getElementPercent(volumeProgress, e.clientX);
        updateProgressBar(volumeSlider, volumeIndicator, percentage);
    }

    const adjustVideoProgress = function (e) {
        const percentage = getElementPercent(videoProgress, e.clientX);
        updateProgressBar(videoSlider, videoIndicator, percentage);

        video.currentTime = (e.offsetX / videoProgress.offsetWidth) * video.duration;
    }

    function onVideoEnded() {
        pauseVideo();
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

    function secondsToHms(seconds) {
        const s = Math.floor(seconds % 3600 % 60);
        const m = Math.floor(seconds % 3600 / 60);
        const h = Math.floor(seconds / 3600);

        return (h > 0 ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function trackingVideoProgress() {
        updateVideoProgress();
        watchTrackingVideoProgress = window.requestAnimationFrame(trackingVideoProgress);
    }

    function stopTrackingVideoPlayProgress() {
        window.cancelAnimationFrame(watchTrackingVideoProgress);
    }

    function updateVideoProgress() {
        videoElapsed.innerText = secondsToHms(video.currentTime);

        const progressPercent = video.currentTime / video.duration * 100;

        videoSlider.style.width = progressPercent + '%';
        videoIndicator.style.left = progressPercent + "%";

        if (progressPercent === 100) {
            pauseVideo();
        }
    }

    btnMute.addEventListener("click", function () {
        const isMute = this.classList.contains('video-icons-volume-high');

        if (isMute) {
            this.classList.replace('video-icons-volume-high', 'video-icons-volume-mute');
        } else {
            this.classList.replace('video-icons-volume-mute', 'video-icons-volume-high');
        }
    });

    btnPlayPause.addEventListener("click", function () {
        const isPlay = this.classList.contains('video-icons-play');

        if (isPlay && video.paused) {
            playVideo();
        } else {
            pauseVideo();
        }
    });


    videoProgress.addEventListener('mousemove', onVideoProgressMouseMove);
    videoProgress.addEventListener('mouseout', onVideoProgressMouseOut);

    videoProgress.addEventListener('mousedown', function (e) {
        e.preventDefault();
        pauseVideo();
        adjustVideoProgress(e);


        window.addEventListener('mousemove', adjustVideoProgress, false);
        window.addEventListener('mouseup', function handler(e) {
            e.preventDefault();
            playVideo();

            window.removeEventListener('mousemove', adjustVideoProgress, false);
            window.removeEventListener('mouseup', handler, false);
        }, false);
    });

    volumeProgress.addEventListener('mousedown', function (e) {
        e.preventDefault();
        adjustAudioVolume(e);

        window.addEventListener('mousemove', adjustAudioVolume, false);
        window.addEventListener('mouseup', function handler(e) {
            e.preventDefault();

            window.removeEventListener('mousemove', adjustAudioVolume, false);
            window.removeEventListener('mouseup', handler, false);
        }, false);
    });
});


