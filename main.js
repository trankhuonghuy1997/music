'use strict;'

// cú pháp query selector
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Khai báo biến
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
 
// render and scroolTop
const app = {
    currentIndex: 0,
    isPlaying : false,
    isRandom: false,
    songs: [
        {
            name: 'Waiting For You',
            singer: 'Mono',
            path: './song/song1.mp3', 
            image:'./img/song1.jpg'
        },

        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê',
            path: './song/song2.mp3', 
            image:'./img/song2.jpg'
        },
        {
            name: 'Đừng bắt anh mạnh mẻ',
            singer: 'Hồ Quang Hiếu',
            path: './song/song3.mp3', 
            image:'./img/song3.jpg'
        },
        
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}') ;">
                    </div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join(' ');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        // scale hình ảnh đại diện
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0? newCDWidth + 'px': 0;
            cd.style.opacity = newCDWidth/ cdWidth;       
        }

        // Lắng nghe sự kiện khi ấn nút play
        playBtn.onclick = function() {
           if(app.isPlaying) {
                audio.pause();
           } else {
                audio.play();
           }
        }
            // Xử lý audio play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
            // Xử lý audio pause
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
            // xử lý thanh progress
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime/ audio.duration*100);
                progress.value = progressPercent;  
            }
        }
            // Xử lý sự kiện tua bài hát
        progress.onchange = function(e) {
             const seekTime = audio.duration / 100 * e.target.value;
             audio.currentTime = seekTime;
        }
            // Lắng nghe sự kiện ấn next 
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
        }
            // Lắng nghe sự kiện bài trước
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
        }
            //Bật tắt chế độ random
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }
    },
    // Hàm load bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    // hàm gọi bào tiếp theo
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Hàm gọi bài trước đó
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    // hàm gọi chế độ random
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random()*this.songs.length);
        }
        while(newIndex === this.currentIndex);
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // Thực thi
    start: function() {
        // render playlist
        this.render();
        // Lắng nghe và xử lỹ sự kiện
        this.handleEvent();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();
        // tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();
    }
}
// Thực thi ứng dụng
app.start();