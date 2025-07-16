function seedRandom(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;
        return (h >>> 0) / 4294967296;
    };
}

export function shuffle(array, seedStr) {
    const rand = seedRandom(seedStr);
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(rand() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
  

export function applyRowHighlights() {
    document.querySelectorAll('.jspsych-maxdiff-table tr').forEach((row) => {
        row.classList.remove('most-selected', 'least-selected');

        const left = row.querySelector('input[name$="left"]:checked');
        const right = row.querySelector('input[name$="right"]:checked');

        if (left) row.classList.add('least-selected');  // now left = least
        if (right) row.classList.add('most-selected');  // now right = most
    });
}

export function sendToServer(data) {
    console.log("sending data");
    fetch('https://script.google.com/macros/s/AKfycbx8NF6BxzV4hF1s9EKbZAJmiIXNaDOv6hpv2y7_HUrg9SprRqKx-gti-1Qz3y7DEgk8Hw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
