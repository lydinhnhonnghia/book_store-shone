/* eslint-disable no-undef */
let contentEditor = null;

// eslint-disable-next-line no-undef
ClassicEditor
    .create(document.querySelector('#content'), {
        minHeight: '300px',
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                {
                    model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1',
                },
                {
                    model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2',
                },
                {
                    model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3',
                },
                {
                    model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4',
                },
                {
                    model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5',
                },
            ],
        },
    })
    .then((editor) => {
        contentEditor = editor;
    });

const listChapter = (storyOId) => {
    HttpService.get('/admin/chapter/list', {
        storyOId, fieldsSelected: '_id chapterNumber title', limit: 100, sortKey: 'chapterNumber', sortOrder: 1,
    })
        .then((response) => {
            if (response.success) {
                appendOptionOfSelect('chapters', response.data.docs, {
                    firstText: 'Không chọn',
                    propText: 'chapterNumber',
                    concatPropText: 'title',
                    propValue: '_id',
                });
            }
        });
};

const contentWrapper = getElement('.content-wrapper');
const story = JSON.parse(contentWrapper.getAttribute('data-story') || '{}');

listChapter(story.storyOId);

handleValue('setValue', '#form-chapter', {
    data: [
        { name: 'code', value: story.code },
        { name: 'name', value: story.name },
        { name: 'authorName', value: story.authorName },
        { name: 'categoryName', value: story.categoryName },
    ],
});

function getInfoChapter(chapterOId) {
    HttpService.get('/admin/chapter/info', { chapterOId })
        .then((response) => {
            if (response.success) {
                const chapter = response.data;
                handleValue('setValue', '#form-chapter', {
                    data: [
                        { name: 'chapterNumber', value: chapter.chapterNumber },
                        { name: 'title', value: chapter.title },
                    ],
                });
                contentEditor.setData(chapter.content);
            }
        });
}

getElement('.chapters').addEventListener('change', (evt) => {
    const action = evt.target.value ? 'update' : 'create';
    getElement('#form-chapter').setAttribute('data-action', action);
    if (action === 'update') {
        getInfoChapter(evt.target.value);
    } else {
        handleValue('resetValue', '#form-chapter', { names: ['chapterNumber', 'title'] });
        contentEditor.setData('');
    }
});

const buttonSave = document.getElementById('save');
buttonSave.addEventListener('click', () => {
    const data = handleValue('getValue', '#form-chapter', { names: ['chapterNumber', 'title'] });
    data.content = contentEditor.getData();
    data.storyOId = story.storyOId;
    const action = getElement('#form-chapter').getAttribute('data-action');
    if (action === 'update') {
        data.chapterOId = handleValue('getValue', '#form-chapter', { names: ['chapterOId'] }).chapterOId;
    }
    if (!data.title) return loggerError('Tiêu đề không được để trống');
    if (!data.chapterNumber) return loggerError('Chương không được để trống');
    if (!data.content) return loggerError('Nội dung không được để trống');
    HttpService.post(`/admin/chapter/${action}`, data).then((response) => {
        if (response.success) {
            loggerSuccess(response.message);
            if (action === 'create') {
                handleValue('resetValue', '#form-chapter', { names: ['chapterNumber', 'title'] });
                contentEditor.setData('');
            }
            listChapter(story.storyOId);
        } else {
            if (response.statusCode === 1001) {
                return loggerError(handleMsgParamsErrors(response.error));
            }
            loggerError(response.message);
        }
    });
});
