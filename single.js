const SPEED = 40; // px/sec
const PAUSE = 2;  // seconds
const item = document.querySelector('.item');
const container = item.parentElement;

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

    // clear and create new keyframe
    const animationName = 'scroll-item';
    if (styleSheet.cssRules.length > 0)
        styleSheet.deleteRule(0);

    styleSheet.insertRule(`
        @keyframes ${animationName} {
            0%, ${firstPauseEndPercent}% { transform: none; }
            ${secondPauseStartPercent}%, 100% { transform: translateX(var(--stop-x)); }
        }
    `);

    // apply animation
    item.style.animation = `${animationName} ${totalDuration}s linear infinite`;
}

// initialize item when the font has loaded (to get correct measurements)
document.fonts.ready.then(() => {
    //setupItem(container, item); //shouldn't be needeed because RO will trigger it immediately

    // handle resizing dynamically
    const ro = new ResizeObserver(() => setupItem(container, item));
    ro.observe(container);
    ro.observe(item);
});