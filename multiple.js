const speedInput = document.querySelector('#speed');
let SPEED = parseFloat(speedInput.value); // px/sec
const PAUSE = 2;  // seconds
const items = document.querySelectorAll('.item');

const styleEl = document.createElement('style');
document.head.appendChild(styleEl);
const styleSheet = styleEl.sheet;

function setupItem(container, item) {
    console.log("setup");
    const overflow = item.scrollWidth - container.clientWidth;
    if (overflow <= 0) {
        item.style.animation = 'none';
        item.style.transform = 'none';
        return;
    }

    // compute durations
    const moveDuration = overflow / SPEED;
    const totalDuration = moveDuration + PAUSE * 2;
    const firstPauseEndPercent = (PAUSE / totalDuration) * 100;
    const secondPauseStartPercent = 100 - firstPauseEndPercent;

    // set stop distance
    item.style.setProperty('--stop-x', `-${overflow}px`);

    // remove old keyframe if exists
    const animationName = `scroll-${container.dataset.id}`;
    for (let i = styleSheet.cssRules.length - 1; i >= 0; i--)
        if (styleSheet.cssRules[i].name === animationName)
            styleSheet.deleteRule(i);

    // create keyframe dynamically
    styleSheet.insertRule(`
        @keyframes ${animationName} {
            0%, ${firstPauseEndPercent}% { transform: none; }
            ${secondPauseStartPercent}%, 100% { transform: translateX(var(--stop-x)); }
        }
    `, styleSheet.cssRules.length);

    // apply animation
    item.style.animation = `${animationName} ${totalDuration}s linear infinite`;
}

// handle speed changes
const speedDisplay = document.querySelector('span');
speedDisplay.textContent = SPEED;
speedInput.addEventListener('input', (e) => {
    SPEED = parseFloat(e.target.value);
    speedDisplay.textContent = SPEED;
    items.forEach((item) => {
        setupItem(item.parentElement, item);
    });
});

// initialize all items when the font has loaded (to get correct measurements)
document.fonts.ready.then(() => {
    items.forEach((item, i) => {
        const container = item.parentElement;
        container.dataset.id = i; // unique id for keyframes
        //setupItem(container, item); //shouldn't be needeed because RO will trigger it immediately

        // handle resizing dynamically
        const ro = new ResizeObserver(() => setupItem(container, item));
        ro.observe(container);
        ro.observe(item);
    });
});