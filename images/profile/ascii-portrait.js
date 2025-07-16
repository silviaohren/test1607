// ASCII Portrait Dynamic Implementation

// Original portrait data structure
const portraitData = {
    chars: [
        "##########%%#%#**-      +##%##%#%#%##%#%%%%%%",
        "#############%+:          .##%#%%%%%%%%%%%%%%",
        "#####%#%##= .:              ..:#*#%%%%%%%%%%%",
        "#######*+-             .      .-:#%%%%%%%%%%%",
        "########.               .       .**%%%%%%%%%%",
        "####%##+     .::.              . .:%%%%%%%%%",
        "####%#-     :---:.                ..%%%%%%%%%",
        "######     .-====-..               .=%%%%%%%%",
        "######     :-=+++++-..              .:##%%%%%",
        "###%%+    .-==*********+++=         ..%*%%%%%",
        "##%%%*.   --::-+*#*#*=:---==.      .. #%%%%%%",
        "###%%+.  .-==---=*##+=-==+**#-:.   ...+%%#%%%",
        "%%%##*   -=-==---+##+===+*****=:    .. %##%%%",
        "%%%%%-#  ---==-:+*#=---=+*+**:..  .  .+##%%%",
        "%%%%%%%  --..:--++**+-::-:=***-.   .: =%##+%",
        "%%%%%%.  --:-=---+**#*++*#####*=  .    .-#%#%",
        "%%%=    ++*==-=-++#**###*##%%%#+       -:=-*%",
        "%%%.   :*:+#===-=++*######%%##*+      .+.-##%",
        "%%%+. . -#*=*#=-:--- =*#%##%%##*+      ...-+%",
        "##%.   =##:+**=---+**##*#%%####-       ..-##%",
        "%%%    +*#+=*#*==++##########**-      . .*%#%",
        "%%#.   ++**-+##--+++**######*#*-        .%%%%",
        "%%--   =-*#==*#%..::-=+###***=   .  ..-%%%%",
        "%%%=- + =-++=+#%%=+*+++*=*****+=  .  :+:%%%%%",
        "%%#%*+#:--:-=+*#%--===****+++++-. . .-+#%%%%%",
        "%%%*#%-:--::-=+*#%%===++++++===-.....:*-#%%%%%",
        "%%%###+  -:-=+*#%%++****++===:.. . .:-+-##%%%%%",
        "%%%#+..  ::--=*##%#+**+*+==:.:.. .  .:-=++###%%",
        "%%.+. .  ---+*#%%#=====-:::-::..   .....=-#%%",
        "%%%+=#+ .  --=+*#%%%::::::----    ......:+###",
        "-----=-==++=++*#%%%+.::---------      ..::--..",
        "****###########%%%#+.:::----.-:....:::::.",
        "##########%%%%%%%%#=::::----.-=--:::::::",
        "########%%%%%%%%%#*::::::--.--=--:::---:",
        "##%###%%%%%%%####*+=:::::-.:-=-=----====:.",
        "##%##########*++====:::::..-=-----====--",
        "*******+++++**+=-==.:::::.-=----------"
    ],
    colors: [
        // Define color mapping for characters
        { char: '#', color: '#ffffff' },  // White
        { char: '%', color: '#ffffff' },  // White
        { char: '*', color: '#ffffff' },  // White
        { char: '+', color: '#fc7dff' },  // Pink
        { char: '-', color: '#fc7dff' },  // Pink
        { char: ':', color: '#286fbd' },  // Blue
        { char: '.', color: '#286fbd' },  // Blue
        { char: ' ', color: '#000000' }   // Black/Background
    ]
};

class ASCIIPortrait {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.charHeight = 9; // Half of previous 18
        this.charWidth = 5.5;  // Half of previous 11
        this.fontFamily = 'monospace';
        this.setupCanvas();
        this.matrix = this.createMatrix();
        this.originalMatrix = this.matrix.map(row => [...row]);
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        this.isHovering = false;
        this.ripples = [];
        this.rippleInterval = null;
        this.ripplesAnimating = false;
        this.setupEventListeners();
        this.render();
    }

    setupCanvas() {
        this.canvas.width = portraitData.chars[0].length * this.charWidth;
        this.canvas.height = portraitData.chars.length * this.charHeight;
        this.canvas.style.backgroundColor = '#000000';
        this.container.appendChild(this.canvas);
        this.ctx.font = `${this.charHeight}px ${this.fontFamily}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.startRippleLoop();
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.stopRippleLoop();
            // Let ripples finish animating
        });
    }

    createMatrix() {
        return portraitData.chars.map(line => line.split(''));
    }

    getCharColor(char) {
        const colorData = portraitData.colors.find(c => c.char === char);
        return colorData ? colorData.color : '#ffffff';
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const char = this.matrix[y][x];
                this.ctx.fillStyle = this.getCharColor(char);
                this.ctx.fillText(
                    char,
                    x * this.charWidth,
                    y * this.charHeight
                );
            }
        }
    }

    restoreOriginal() {
        this.matrix = this.originalMatrix.map(row => [...row]);
        this.render();
    }

    startRippleLoop() {
        if (this.rippleInterval) return;
        this.ripples = [];
        this.ripplesAnimating = true;
        this.rippleInterval = setInterval(() => {
            if (this.isHovering) {
                this.startRipple();
            }
        }, 600); // 0.6 seconds
        this.startRipple(); // Start immediately on hover
        this.animateRipples();
    }

    stopRippleLoop() {
        if (this.rippleInterval) {
            clearInterval(this.rippleInterval);
            this.rippleInterval = null;
        }
        // Do not clear ripples; let them finish animating
        // Set a flag so no new ripples are created
        this.ripplesAnimating = true;
    }

    startRipple() {
        this.ripples.push({
            x: Math.floor(this.mouseX / this.charWidth),
            y: Math.floor(this.mouseY / this.charHeight),
            startTime: performance.now(),
            radius: 0
        });
    }

    animateRipples() {
        if (!this.isHovering && this.ripples.length === 0) {
            this.ripplesAnimating = false;
            this.restoreOriginal();
            return;
        }
        const now = performance.now();
        const speed = 80; // pixels per second
        const maxRadius = Math.max(this.canvas.width, this.canvas.height);
        // Update all ripples
        this.ripples.forEach(ripple => {
            const elapsed = (now - ripple.startTime) / 1000;
            ripple.radius = elapsed * speed;
        });
        // Remove ripples that have expanded past the canvas
        this.ripples = this.ripples.filter(ripple => ripple.radius < maxRadius);
        this.applyRippleEffects();
        this.render();
        if (this.isHovering || this.ripples.length > 0) {
            requestAnimationFrame(() => this.animateRipples());
        } else {
            this.ripplesAnimating = false;
            this.restoreOriginal();
        }
    }

    applyRippleEffects() {
        // Start from original
        this.matrix = this.originalMatrix.map(row => [...row]);
        const charSet = ['#', '%', '*', '+', '-', ':', '.'];
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.originalMatrix[y][x] === ' ') continue;
                let perturbed = false;
                for (const ripple of this.ripples) {
                    const dx = x - ripple.x;
                    const dy = y - ripple.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) * this.charWidth; // Use charWidth for distance calculation
                    if (dist > ripple.radius - 8 && dist < ripple.radius + 8) {
                        const phase = Math.floor((dist + ripple.radius) / 8) % charSet.length;
                        this.matrix[y][x] = charSet[phase];
                        perturbed = true;
                        break;
                    }
                }
                if (!perturbed) {
                    this.matrix[y][x] = this.originalMatrix[y][x];
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const portrait = new ASCIIPortrait('ascii-portrait-container');
    window.asciiPortrait = portrait;
}); 