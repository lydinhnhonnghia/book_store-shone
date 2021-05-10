/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let descriptionEditor = null;

// eslint-disable-next-line no-undef
ClassicEditor
    .create(document.querySelector('#description'), {
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
        descriptionEditor = editor;
    });

const scope = {};
getElement('#btn-show-modal-create').addEventListener('click', () => {
    getElement('#form-modal').setAttribute('data-action', 'create');
    getElement('#form-modal').removeAttribute('data-storyOId');
    handleValue('resetValue', '#form-modal', { names: ['code', 'name', 'source', 'state', 'categoryOId', 'authorOId', 'shortDescription'] });
});

const button = getElement('#save');
button.addEventListener('click', () => {
    const action = getElement('#form-modal').getAttribute('data-action');
    if (action === 'create') {
        const data = handleValue('getValue', '#form-modal', { names: ['code', 'name', 'source', 'state', 'categoryOId', 'authorOId'] });
        data.description = descriptionEditor.getData();
        const file = document.querySelector('#form-modal form').image.files[0];
        data.image = file;
        const formData = new FormData();
        for (const prop in data) {
            formData.append(prop, data[prop]);
        }

        HttpService.post('/admin/story/create', formData).then((response) => {
            if (response.success) {
                loggerSuccess(response.message);
                listStory();
                handleValue('resetValue', '#form-modal',
                    { names: ['code', 'name', 'source', 'state', 'categoryOId', 'authorOId', 'shortDescription', 'image', 'tmpImage'] });
                descriptionEditor.setData('');
            } else {
                if (response.statusCode === 1001) {
                    return loggerError(handleMsgParamsErrors(response.error));
                }
                loggerError(response.message);
            }
        });
    } else {
        const data = handleValue('getValue', '#form-modal',
            { names: ['code', 'name', 'source', 'state', 'categoryOId', 'authorOId', 'shortDescription'] });
        data.storyOId = getElement('#form-modal').getAttribute('data-storyOId');
        data.description = descriptionEditor.getData();
        const file = document.querySelector('#form-modal form').image.files[0];
        if (file) {
            data.image = file;
        }

        const formData = new FormData();
        for (const prop in data) {
            formData.append(prop, data[prop]);
        }
        HttpService.post('/admin/story/update', formData).then((response) => {
            if (response.success) {
                $('#form-modal').modal('hide');
                loggerSuccess(response.message);
                listStory();
                handleValue('resetValue', '#form-modal',
                    { names: ['code', 'name', 'source', 'state', 'categoryOId', 'authorOId', 'shortDescription'] });
                descriptionEditor.setData('');
            } else {
                if (response.statusCode === 1001) {
                    return loggerError(handleMsgParamsErrors(response.error));
                }
                loggerError(response.message);
            }
        });
    }
});

let initPagination = null;

function listStory(page = 1) {
    HttpService.get('/admin/story/list', { page })
        .then((response) => {
            if (response.success) {
                const { data } = response;
                const startNo = countNo(data.page, data.limit);
                initPagination(data);
                $('#story-table>tbody').empty();
                data.docs.map((item, idx) => {
                    $('#story-table>tbody').append(`<tr>
                            <td> ${idx + startNo} </td>
                            <td> ${item.code} </td>
                            <td> ${item.name} </td>
                            <td> ${(item.category || {}).name || ''}</td>
                            <td> ${(item.author || {}).name || ''}</td>
                            <td> ${item.state} </td>
                            <td> 
                                <div class="input-group-prepend">
                                    <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ${item.status || ''}
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" onclick="onUpdateStatus('Active', '${item._id}')" href="#">Active</a>
                                        <a class="dropdown-item" onclick="onUpdateStatus('Inactive', '${item._id}')" href="#">Inactive</a>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <button type="button" onclick="showChaptersOfStory('${item._id}')"
                                    title="Xem chi tiết các chương của truyện"
                                    class="btn btn-icon btn-warning btn-rounded">
                                    <i class="mdi mdi-library-books"></i>
                                </button>
                                <button type="button" onclick="showInfo('${item._id}')"
                                    data-toggle="modal" data-target="#form-modal" class="btn btn-icon btn-info btn-rounded">
                                    <i class="mdi mdi-lead-pencil"></i>
                                </button>
                                <button type="button" onclick="onDelete('${item._id}')" 
                                    class="btn btn-icon btn-danger btn-rounded">
                                    <i class="mdi mdi-close-circle"></i>
                                </button>
                            </td> 
                        </tr>`);
                });
            }
        });
}
initPagination = initPaginationTemplate(listStory);
listStory();

function showChaptersOfStory(storyOId) {
    document.location.href = `/admin/story/${storyOId}/chapters`;
}

function onDelete(storyOId) {
    swal({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Sau khi xóa, dữ liệu sẽ bị mất!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((ok) => {
        if (ok) {
            HttpService.post('/admin/story/delete', { storyOId }).then((response) => {
                if (response.success) {
                    loggerSuccess(response.message);
                    listStory();
                } else {
                    if (response.statusCode === 1001) {
                        return loggerError(handleMsgParamsErrors(response.error));
                    }
                    loggerError(response.message);
                }
            });
        }
    });
}

function onUpdateStatus(status, storyOId) {
    HttpService.post('/admin/story/update-status', { status, storyOId }).then((response) => {
        if (response.success) {
            loggerSuccess(response.message);
            listStory();
        } else {
            if (response.statusCode === 1001) {
                return loggerError(handleMsgParamsErrors(response.error));
            }
            loggerError(response.message);
        }
    });
}

const listAuthor = () => {
    HttpService.get('/admin/author/list-active')
        .then((response) => {
            if (response.success) {
                scope.authors = response.data;
                appendOptionOfSelect('authors', response.data, {
                    firstText: 'Không chọn',
                    propText: 'name',
                    propValue: '_id',
                });
            }
        });
};
listAuthor();

const listCategory = () => {
    HttpService.get('/admin/category/list-active')
        .then((response) => {
            if (response.success) {
                scope.categories = response.data;
                appendOptionOfSelect('categories', response.data, {
                    firstText: 'Không chọn',
                    propText: 'name',
                    propValue: '_id',
                });
            }
        });
};
listCategory();

function showInfo(storyOId) {
    HttpService.get('/admin/story/info', { storyOId })
        .then((response) => {
            if (response.success) {
                const story = response.data;
                getElement('#form-modal').setAttribute('data-action', 'update');
                getElement('#form-modal').setAttribute('data-storyOId', story._id);
                descriptionEditor.setData(story.description);
                handleValue('setValue', '#form-modal', {
                    data: [
                        { name: 'code', value: story.code },
                        { name: 'name', value: story.name },
                        { name: 'authorOId', value: story.authorOId },
                        { name: 'categoryOId', value: story.categoryOId },
                        { name: 'source', value: story.source },
                        { name: 'state', value: story.state },
                        { name: 'shortDescription', value: story.shortDescription || '' },
                    ],
                });
            }
        });
}
