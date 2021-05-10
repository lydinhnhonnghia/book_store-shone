/* eslint-disable no-undef */

const elemWraContent = getElement('.wrapper-content');
const storyOId = elemWraContent.getAttribute('data-storyOId');
const accountOId = elemWraContent.getAttribute('data-accountOId');

let initPagination = null;

function listChaptersOfStory(page = 1) {
    HttpService.get('/chapter/list', {
        page,
        limit: 30,
        storyOId,
        fieldsSelected: '_id chapterNumber title',
        sortKey: 'chapterNumber',
        sortOrder: 1,
    })
        .then((response) => {
            if (response.success) {
                const { data } = response;
                initPagination(data);
                const elemWraChapter = getElement('.wrapper-chapters');
                let tmpChapters = '';
                data.docs.map((item) => {
                    tmpChapters += `<div class="item-chapter">
                      <a href="/story/${storyOId}/${item.chapterNumber}">Chương ${item.chapterNumber} (${item.title})</a> 
                    </div>`;
                });
                elemWraChapter.innerHTML = tmpChapters;
            }
        });
}
initPagination = initPaginationTemplate(listChaptersOfStory);
listChaptersOfStory();

const btnBookmark = getElement('#bookmark');
btnBookmark.addEventListener('click', () => {
    const status = btnBookmark.classList.contains('bookmarked') ? 'Inactive' : 'Active';
    HttpService.post('/bookmark/save', { storyOId, accountOId, status }).then((response) => {
        if (response.success) {
            if (status === 'Active') {
                btnBookmark.classList.remove('btn-gradient-light');
                btnBookmark.classList.add('btn-gradient-success', 'bookmarked');
                btnBookmark.innerText = 'Bỏ đánh dấu';
            }
            if (status === 'Inactive') {
                btnBookmark.classList.add('btn-gradient-light');
                btnBookmark.classList.remove('btn-gradient-success', 'bookmarked');
                btnBookmark.innerText = 'Đánh dấu';
            }
        } else {
            // eslint-disable-next-line no-console
            console.error(response.error);
        }
    });
});
