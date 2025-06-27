// Sparkle Effect Configuration
const SPARKLE_CONFIG = {
    color: 'lime',  // Can be set to "random" or any valid color
    count: 50,
    updateInterval: 40,
    defaultDimensions: {
        width: 800,
        height: 600
    }
};

// Sparkle Element Dimensions
const DIMENSIONS = {
    tiny: { width: 3, height: 3 },
    star: { width: 5, height: 5 },
    starInner: { width: 1, height: 5 }
};

class SparkleEffect {
    constructor() {
        this.x = this.ox = 400;
        this.y = this.oy = 300;
        this.swide = SPARKLE_CONFIG.defaultDimensions.width;
        this.shigh = SPARKLE_CONFIG.defaultDimensions.height;
        this.sleft = this.sdown = 0;
        this.tiny = [];
        this.star = [];
        this.starv = [];
        this.starx = [];
        this.stary = [];
        this.tinyx = [];
        this.tinyy = [];
        this.tinyv = [];
    }

    init() {
        if (!document.getElementById) return;

        for (let i = 0; i < SPARKLE_CONFIG.count; i++) {
            this.createSparkles(i);
        }

        this.setWindowDimensions();
        this.animate();

        // Event listeners
        window.onscroll = () => this.setScrollPosition();
        window.onresize = () => this.setWindowDimensions();
        document.onmousemove = (e) => this.handleMouseMove(e);
    }

    createSparkles(i) {
        // Create tiny sparkle
        const tinySparkle = this.createSparkleDiv(DIMENSIONS.tiny.width, DIMENSIONS.tiny.height);
        tinySparkle.style.visibility = "hidden";
        tinySparkle.style.zIndex = "999";
        document.body.appendChild(tinySparkle);
        this.tiny[i] = tinySparkle;

        // Create star sparkle
        const starSparkle = this.createSparkleDiv(DIMENSIONS.star.width, DIMENSIONS.star.height);
        starSparkle.style.backgroundColor = "transparent";
        starSparkle.style.visibility = "hidden";
        starSparkle.style.zIndex = "999";

        // Create star parts
        const leftPart = this.createSparkleDiv(DIMENSIONS.starInner.width, DIMENSIONS.starInner.height);
        const downPart = this.createSparkleDiv(DIMENSIONS.star.width, DIMENSIONS.starInner.width);

        starSparkle.appendChild(leftPart);
        starSparkle.appendChild(downPart);

        // Position star parts
        leftPart.style.top = "2px";
        leftPart.style.left = "0px";
        downPart.style.top = "0px";
        downPart.style.left = "2px";

        document.body.appendChild(starSparkle);
        this.star[i] = starSparkle;

        // Initialize velocities
        this.starv[i] = 0;
        this.tinyv[i] = 0;
    }

    animate() {
        this.updateSparklePositions();
        this.updateAllSparkles();
        setTimeout(() => this.animate(), SPARKLE_CONFIG.updateInterval);
    }

    updateSparklePositions() {
        if (Math.abs(this.x - this.ox) > 1 || Math.abs(this.y - this.oy) > 1) {
            this.ox = this.x;
            this.oy = this.y;
            for (let i = 0; i < SPARKLE_CONFIG.count; i++) {
                if (!this.starv[i]) {
                    this.createNewStar(i);
                    break;
                }
            }
        }
    }

    updateAllSparkles() {
        for (let i = 0; i < SPARKLE_CONFIG.count; i++) {
            if (this.starv[i]) this.updateStar(i);
            if (this.tinyv[i]) this.updateTiny(i);
        }
    }

    createNewStar(i) {
        this.star[i].style.left = (this.starx[i] = this.x) + "px";
        this.star[i].style.top = (this.stary[i] = this.y + 1) + "px";
        this.star[i].style.clip = "rect(0px, 5px, 5px, 0px)";

        const color = SPARKLE_CONFIG.color === "random" ? this.generateRandomColor() : SPARKLE_CONFIG.color;
        this.star[i].childNodes[0].style.backgroundColor =
            this.star[i].childNodes[1].style.backgroundColor = color;

        this.star[i].style.visibility = "visible";
        this.starv[i] = 50;
    }

    updateStar(i) {
        if (--this.starv[i] === 25) this.star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
        if (this.starv[i]) {
            this.stary[i] += 1 + Math.random() * 3;
            this.starx[i] += (i % 5 - 2) / 5;

            if (this.stary[i] < this.shigh + this.sdown) {
                this.star[i].style.top = this.stary[i] + "px";
                this.star[i].style.left = this.starx[i] + "px";
            } else {
                this.star[i].style.visibility = "hidden";
                this.starv[i] = 0;
            }
        } else {
            this.initializeTiny(i);
        }
    }

    initializeTiny(i) {
        this.tinyv[i] = 50;
        this.tiny[i].style.top = (this.tinyy[i] = this.stary[i]) + "px";
        this.tiny[i].style.left = (this.tinyx[i] = this.starx[i]) + "px";
        this.tiny[i].style.width = "2px";
        this.tiny[i].style.height = "2px";
        this.tiny[i].style.backgroundColor = this.star[i].childNodes[0].style.backgroundColor;
        this.star[i].style.visibility = "hidden";
        this.tiny[i].style.visibility = "visible";
    }

    updateTiny(i) {
        if (--this.tinyv[i] === 25) {
            this.tiny[i].style.width = "1px";
            this.tiny[i].style.height = "1px";
        }

        if (this.tinyv[i]) {
            this.tinyy[i] += 1 + Math.random() * 3;
            this.tinyx[i] += (i % 5 - 2) / 5;

            if (this.tinyy[i] < this.shigh + this.sdown) {
                this.tiny[i].style.top = this.tinyy[i] + "px";
                this.tiny[i].style.left = this.tinyx[i] + "px";
            } else {
                this.tiny[i].style.visibility = "hidden";
                this.tinyv[i] = 0;
            }
        } else {
            this.tiny[i].style.visibility = "hidden";
        }
    }

    createSparkleDiv(height, width) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = height + "px";
        div.style.width = width + "px";
        div.style.overflow = "hidden";
        return div;
    }

    handleMouseMove(e) {
        if (e) {
            this.y = e.pageY;
            this.x = e.pageX;
        } else {
            this.setScrollPosition();
            this.y = event.y + this.sdown;
            this.x = event.x + this.sleft;
        }
    }

    setScrollPosition() {
        if (typeof(self.pageYOffset) === 'number') {
            this.sdown = self.pageYOffset;
            this.sleft = self.pageXOffset;
        } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
            this.sdown = document.body.scrollTop;
            this.sleft = document.body.scrollLeft;
        } else if (document.documentElement &&
            (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
            this.sleft = document.documentElement.scrollLeft;
            this.sdown = document.documentElement.scrollTop;
        } else {
            this.sdown = 0;
            this.sleft = 0;
        }
    }

    setWindowDimensions() {
        let minWidth = 999999;
        let minHeight = 999999;

        if (document.documentElement && document.documentElement.clientWidth) {
            if (document.documentElement.clientWidth > 0) {
                minWidth = document.documentElement.clientWidth;
            }
            if (document.documentElement.clientHeight > 0) {
                minHeight = document.documentElement.clientHeight;
            }
        }

        if (typeof(self.innerWidth) === 'number' && self.innerWidth) {
            if (self.innerWidth > 0 && self.innerWidth < minWidth) {
                minWidth = self.innerWidth;
            }
            if (self.innerHeight > 0 && self.innerHeight < minHeight) {
                minHeight = self.innerHeight;
            }
        }

        if (document.body.clientWidth) {
            if (document.body.clientWidth > 0 && document.body.clientWidth < minWidth) {
                minWidth = document.body.clientWidth;
            }
            if (document.body.clientHeight > 0 && document.body.clientHeight < minHeight) {
                minHeight = document.body.clientHeight;
            }
        }

        if (minWidth === 999999 || minHeight === 999999) {
            minWidth = SPARKLE_CONFIG.defaultDimensions.width;
            minHeight = SPARKLE_CONFIG.defaultDimensions.height;
        }

        this.swide = minWidth;
        this.shigh = minHeight;
    }

    generateRandomColor() {
        const channels = [
            255,
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * (256 - channels[1] / 2))
        ];
        channels.sort(() => 0.5 - Math.random());
        return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
    }
}

// Initialize sparkle effect when window loads
window.onload = () => {
    const sparkleEffect = new SparkleEffect();
    sparkleEffect.init();
};