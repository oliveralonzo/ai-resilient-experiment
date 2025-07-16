// js/config.js

export const binary = [
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

export const gradient = [
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

const labels = {
    binary: {
        prefix: "Binary",
        items: [
            "Opacity",
            "Hue Blue",
            "Weight",
            "Highlight Yellow Continuous",
            "Highlight Yellow with White Space",
            "Caption Continuous",
            "Caption with White Space",
            "Uppercase",
            "Font Size",
            "Underline"
        ]
    },
    gradient: {
        prefix: "Gradient",
        items: [
            "Opacity",
            "Hue Blue",
            "Weight",
            "Highlight Yellow Continuous",
            "Highlight Yellow with White Space",
            "Caption Continuous",
            "Caption with White Space",
            "Font Size"
        ]
    }
};

function _getItemLabel(setName, n) {
    return labels[setName]?.items?.[n - 1] ?? `${n}`;
}

export function getLabel(setName, n) {
    const prefix = labels[setName]?.prefix ?? '';
    return `<strong>${prefix}:</strong> ${_getItemLabel(setName, n)}`;
}

export function getPlainLabel(setName, n) {
    return _getItemLabel(setName, n);
}
