// js/experiment.js

import { binary, gradient, getLabel, getPlainLabel } from './config.js';
import { showModalImage } from './modal.js';
import { shuffle, applyRowHighlights, sendToServer } from './utils.js';

function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

const participantID = getParam('pid');

if (!participantID) {
    document.body.innerHTML = "<p>Error: Missing participant ID.</p>";
    throw new Error("Missing participant ID");
}

const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: true,
    on_finish: () => {
        jsPsych.data.get().localSave('csv', `data_${participantID}.csv`);
    }
});

const timeline = [];

function makeIntro(url) {
    return {
        type: jsPsychExternalHtml,
        url,
        cont_btn: 'start',
        execute_script: false
    };
}

function makeMaxDiffTrial(items, setName, fullSet) {
    const trialSetIndex = fullSet.findIndex(row =>
        row.length === items.length && row.every((val, i) => val === items[i])
    );

    const shuffledItems = shuffle([...items], `${participantID}_${setName}_${trialSetIndex}`);

    const altHTML = shuffledItems.map(n =>
        `<div class="maxdiff-option">
      <img src="images/${setName}/${n}.png" class="maxdiff-img" />
      <div class="maxdiff-label">${getLabel(setName, n)}</div>
    </div>`
    );

    return {
        type: jsPsychMaxdiff,
        alternatives: altHTML,
        labels: ['Least preferred', 'Most preferred'],
        required: true,
        randomize_alternative_order: false,
        button_label: 'Next',
        preamble: `
      <div class="maxdiff-preamble">
        <p>Select the item you <strong>most</strong> and <strong>least</strong> prefer. 
        You can click any image to enlarge it for easier reading.</p>
        <p>Press <strong>Next</strong> at the bottom to continue.</p>
      </div>
    `,
        on_load: () => {
            const table = document.querySelector('.jspsych-maxdiff-table');
            if (!table) return;

            table.querySelectorAll('td').forEach(td => {
                if (td.querySelector('input[type="radio"]')) {
                    td.classList.add('clickable-radio-cell');
                }
            });

            table.addEventListener('click', (e) => {
                const td = e.target.closest('td');
                if (!td) return;

                const radio = td.querySelector('input[type="radio"]');
                if (radio) radio.click();
            });

            table.addEventListener('change', () => {
                applyRowHighlights();
            });

            applyRowHighlights();

            document.querySelectorAll('.maxdiff-img').forEach(img => {
                img.addEventListener('click', () => {
                    showModalImage(img.src);
                });
            });
        },
        data: {
            set: setName,
            item_ids: shuffledItems,
            item_labels: shuffledItems.map(n => getPlainLabel(setName, n)),
            alternatives: altHTML,
            trial_set_index: trialSetIndex
        },
        on_finish: (data) => {
            const altHTML = data.alternatives;
            const leftHTML = data.response?.left;
            const rightHTML = data.response?.right;

            const left = altHTML.findIndex(html => html === leftHTML);
            const right = altHTML.findIndex(html => html === rightHTML);

            const labels = data.item_labels || [];

            data.participant_id = participantID;
            data.least = left;
            data.most = right;

            data.most_label = labels?.[right];
            data.least_label = labels?.[left];

            const unselected = labels
                .map((label, i) => ({ label, i }))
                .filter(obj => obj.i !== left && obj.i !== right);

            unselected.forEach((obj, index) => {
                data[`unselected_label_${index + 1}`] = obj.label;
            });

            const now = new Date();
            data.timestamp = now.toLocaleString('en-US', { hour12: false });


            sendToServer(data);
        }
    };
}

timeline.push(makeIntro('instructions/intro.html'));

timeline.push(makeIntro('instructions/binary.html'));
const binaryShuffled = shuffle([...binary], participantID);
timeline.push(...binaryShuffled.map(t =>
    makeMaxDiffTrial(t, 'binary', binary)
));

timeline.push(makeIntro('instructions/gradient.html'));
const gradientShuffled = shuffle([...gradient], participantID);
timeline.push(...gradientShuffled.map(t =>
    makeMaxDiffTrial(t, 'gradient', gradient)
));

jsPsych.run(timeline);
