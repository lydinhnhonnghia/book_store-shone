/* eslint-disable no-undef */

const elemBlkChapContent = getElement('.block-chapter-content');
const storyOId = elemBlkChapContent.getAttribute('data-storyOId');
const chapterNumber = elemBlkChapContent.getAttribute('data-chapterNumber');

function prevChapter() {
    document.location.href = `/story/${storyOId}/${+chapterNumber - 1}`;
}

function nextChapter() {
    document.location.href = `/story/${storyOId}/${+chapterNumber + 1}`;
}

getAllElement('.item-arrow-left').forEach((elm) => {
    elm.addEventListener('click', () => {
        prevChapter();
    });
});

getAllElement('.item-arrow-right').forEach((elm) => {
    elm.addEventListener('click', () => {
        nextChapter();
    });
});
