// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/
// Modified by ZqlwMatt. https://github.com/ZqlwMatt

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var vidWidth = vid.videoWidth/2;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");

    var isDragging = false;
    var isHoveringBorder = false;
    
    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        // function trackLocationTouch(e) {
        //     // Normalize to [0, 1]
        //     bcr = videoMerge.getBoundingClientRect();
        //     position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        // }
        function startDrag(e) {
            isDragging = true;
            trackLocation(e);
        }
        function stopDrag(e) {
            isDragging = false;
        }
        function drag(e) {
            if (isDragging) {
                trackLocation(e);
            }
        }

        function checkHover(e) {
            var bcr = videoMerge.getBoundingClientRect();
            var cursorPosition = ((e.pageX - bcr.x) / bcr.width) * vidWidth;
            isHoveringBorder = Math.abs(cursorPosition - (vidWidth * position)) < 30; // Adjust threshold as needed
            videoMerge.style.cursor = isHoveringBorder ? "pointer" : "default";
        }

        videoMerge.addEventListener("mousedown", startDrag, false);
        videoMerge.addEventListener("mousemove", drag, false);
        videoMerge.addEventListener("mousemove", checkHover, false);
        window.addEventListener("mouseup", stopDrag, false);

        function drawLoop() {
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            var colStart = (vidWidth * position).clamp(0.0, vidWidth);
            var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
            mergeContext.drawImage(vid, colStart+vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
            requestAnimationFrame(drawLoop);

            
            var arrowLength = 0.08 * vidHeight;
            var arrowheadWidth = 0.025 * vidHeight;
            var arrowheadLength = 0.03 * vidHeight;
            var arrowPosY = vidHeight * 0.500;
            var arrowWidth = 0.008 * vidHeight;
            var currX = vidWidth * position;

            // Draw circle
            mergeContext.arc(currX, arrowPosY, arrowLength*0.72, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "#FFD79340";
            mergeContext.fill()
            //mergeContext.strokeStyle = "#444444";
            //mergeContext.stroke()
            
            // Draw border
            mergeContext.beginPath();
            mergeContext.moveTo(vidWidth * position, 0);
            mergeContext.lineTo(vidWidth * position, vidHeight);
            mergeContext.closePath();
            mergeContext.strokeStyle = "#FFFFFF";
            mergeContext.lineWidth = 6.5;
            mergeContext.globalAlpha = isHoveringBorder ? 1 : 0.7; // Adjust opacity based on hover state
            mergeContext.stroke();

            // Draw arrow
            mergeContext.beginPath();
            mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);
            
            // Move right until meeting arrow head
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);
            
            // Draw right arrow head
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
            mergeContext.lineTo(currX + arrowLength/2, arrowPosY);
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
            mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

            // Go back to the left until meeting left arrow head
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);
            
            // Draw left arrow head
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
            mergeContext.lineTo(currX - arrowLength/2, arrowPosY);
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);
            
            mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
            mergeContext.lineTo(currX, arrowPosY - arrowWidth/2);

            mergeContext.closePath();

            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.fill();
            mergeContext.globalAlpha = 1; // Reset global alpha
        }
        requestAnimationFrame(drawLoop);
    } 
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
    
    
function resizeAndPlay(element)
{
  var cv = document.getElementById(element.id + "Merge");
  cv.width = element.videoWidth/2;
  cv.height = element.videoHeight;
  element.play();
  element.style.height = "0px";  // Hide video without stopping it
  // element.style.width = "0px";
    
  playVids(element.id);
}


// Click to animation
function clickToPlay(element) {
  // 添加自动播放功能
  // autoPlayOnScroll(element);

  element.addEventListener("click", function() {
      element.play();
  });

  element.addEventListener("ended", function() {
    // element.pause();
    element.currentTime = this.duration - 12;
    element.play();
  });
}

// 新增自动播放功能
function autoPlayOnScroll(element) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 只有当视频是暂停状态时才开始播放
        if (element.paused) {
          element.play();
        }
      } else {
        // 当视频不在视图中时暂停
        element.pause();
      }
    });
  }, { threshold: 0.6 }); // 当60%的视频可见时触发

  observer.observe(element);
}

// 修改初始化视频函数
function initializeVideos() {
  const videos = document.querySelectorAll('video.scrollplay');
  videos.forEach(video => {
    // 确保视频最初是暂停状态
    video.pause();
    
    autoPlayOnScroll(video);
    
    video.addEventListener("click", function() {
      if (this.paused) {
        this.play();
      } else {
        this.pause();
      }
    });
    
    video.addEventListener("ended", function() {
      this.currentTime = this.duration - 12; // fake loop
      this.play();
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeVideos);