const binary = [
    [1, 2, 3, 4],
    [1, 5, 6, 7],
    [1, 8, 9, 10],
    [2, 5, 8, 10],
    [2, 6, 9, 7],
    [3, 5, 9, 7],
    [3, 6, 8, 10],
    [4, 5, 7, 10],
    [4, 6, 8, 9],
    [1, 2, 7, 8],
    [3, 4, 6, 9],
    [1, 3, 5, 10],
    [2, 4, 6, 7],
    [2, 3, 8, 10],
    [4, 5, 6, 9]
];

const gradient = [
    [1, 2, 3, 4],
    [1, 5, 6, 7],
    [1, 8, 2, 5],
    [2, 6, 7, 3],
    [3, 8, 4, 6],
    [4, 5, 7, 8],
    [1, 3, 5, 7],
    [2, 4, 6, 8],
    [1, 6, 8, 3],
    [2, 7, 5, 4],
    [3, 7, 8, 1],
    [4, 6, 2, 5],
    [1, 4, 7, 6],
    [2, 3, 5, 8]
];

// Simple shuffle function
function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

const jsPsych = initJsPsych();

const timeline = [];

// Intro trial helper
function makeIntro(text) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<p>${text}</p>`,
        choices: ['Start']
    };
}

// Modal image preview handler
function showModalImage(src) {
    document.getElementById('modal-image').src = src;
    MicroModal.show('image-modal');
}

// MaxDiff trial helper with image alternatives and modal triggers
function makeMaxDiffTrial(items) {
    return {
        type: jsPsychMaxdiff,
        alternatives: items.map(n =>
            `<img src="images/${n}.png" class="maxdiff-img" onclick="showModalImage('images/${n}.png')" />`
        ),
        labels: ['Most preferred', 'Least preferred'],
        required: true,
        randomize_alternative_order: true,
        preamble: '<p>Select the item you <strong>most</strong> and <strong>least</strong> prefer. You can click any image to enlarge it for easier reading.</p>'
    };
}

// Add binary block
timeline.push(makeIntro('Starting the binary item block.'));
const binaryTrials = shuffle(binary).map(makeMaxDiffTrial);
timeline.push(...binaryTrials);

// Add gradient block
timeline.push(makeIntro('Starting the gradient item block.'));
const gradientTrials = shuffle(gradient).map(makeMaxDiffTrial);
timeline.push(...gradientTrials);

// Run the experiment
jsPsych.run(timeline);
