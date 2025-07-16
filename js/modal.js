// js/modal.js

let clickStartedInside = false;

export function showModalImage(src) {
    const img = document.getElementById('modal-image');
    img.src = src;

    const overlay = document.querySelector('.modal__overlay');

    // Attach this once globally
    if (!overlay._listenerAttached) {
        overlay.addEventListener('click', (e) => {
            if (clickStartedInside) {
                e.stopPropagation();
                clickStartedInside = false;
            }
        });
        overlay._listenerAttached = true;
    }

    if (!document.getElementById('zoom-controls')) {
        const group = document.createElement('div');
        group.id = 'zoom-controls';
        group.className = 'btn-group position-absolute';
        group.style.bottom = '1em';
        group.style.right = '1em';
        group.style.zIndex = 1001;

        group.innerHTML = `
            <button id="zoom-in" type="button" class="btn btn-outline-primary btn-sm">+</button>
            <button id="zoom-out" type="button" class="btn btn-outline-primary btn-sm">−</button>
        `;

        document.querySelector('.modal__container').appendChild(group);
    }

    clickStartedInside = false;

    MicroModal.show('image-modal', {
        disableOverlayClose: false,
        onShow: () => {
            img.addEventListener('pointerdown', () => {
                clickStartedInside = true;
            });

            const container = img.parentElement;
            const panzoom = Panzoom(
                img,
                { maxScale: 5, minScale: 1, startScale: 1, contain: 'outside' },
                container
            );
            container.addEventListener('wheel', panzoom.zoomWithWheel);
            img._panzoom = panzoom;

            img.addEventListener('dblclick', (e) => {
                const panzoom = img._panzoom;
                const scale = panzoom.getScale();
                const newScale = scale < 1.1 ? 2 : 1;
                panzoom.zoomToPoint(newScale, { clientX: e.clientX, clientY: e.clientY });
            });
                     

            document.getElementById('zoom-in').onclick = () => img._panzoom.zoomIn();
            document.getElementById('zoom-out').onclick = () => img._panzoom.zoomOut();

            const keyHandler = (e) => {
                switch (e.key) {
                    case 'Escape':
                        MicroModal.close('image-modal');
                        document.removeEventListener('keydown', keyHandler);
                        break;
                    case '+':
                    case '=':
                        img._panzoom.zoomIn();
                        break;
                    case '-':
                        img._panzoom.zoomOut();
                        break;
                    case 'ArrowUp':
                        img._panzoom.pan(0, 20);
                        break;
                    case 'ArrowDown':
                        img._panzoom.pan(0, -20);
                        break;
                    case 'ArrowLeft':
                        img._panzoom.pan(20, 0);
                        break;
                    case 'ArrowRight':
                        img._panzoom.pan(-20, 0);
                        break;
                }
            };
            document.addEventListener('keydown', keyHandler);
        }
    });
}
