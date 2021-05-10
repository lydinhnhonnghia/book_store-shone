/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const scope = {};
getElement('#btn-show-modal-create').addEventListener('click', () => {
    getElement('#form-modal').setAttribute('data-action', 'create');
    getElement('#form-modal').removeAttribute('data-storyOId');
    handleValue('resetValue', '#form-modal', { names: ['name', 'description'] });
});

const button = getElement('#save');
button.addEventListener('click', () => {
    const action = getElement('#form-modal').getAttribute('data-action');
    if (action === 'create') {
        const data = handleValue('getValue', '#form-modal', { names: ['name', 'description'] });
        HttpService.post('/admin/author/create', data).then((response) => {
            if (response.success) {
                loggerSuccess(response.message);
                listAuthor();
                handleValue('resetValue', '#form-modal', { names: ['name', 'description'] });
            } else {
                loggerError(response.message);
            }
        });
    } else {
        const data = handleValue('getValue', '#form-modal', { names: ['name', 'description'] });
        data.authorOId = getElement('#form-modal').getAttribute('data-authorOId');
        HttpService.post('/admin/author/update', data).then((response) => {
            if (response.success) {
                $('#form-modal').modal('hide');
                loggerSuccess(response.message);
                listAuthor();
            } else {
                loggerError(response.message);
            }
        });
    }
});

let initPagination = null;

function listAuthor(page = 1) {
    HttpService.get('/admin/author/list', { page })
        .then((response) => {
            if (response.success) {
                const { data } = response;
                const startNo = countNo(data.page, data.limit);
                initPagination(data);
                $('#author-table>tbody').empty();
                data.docs.map((item, idx) => {
                    $('#author-table>tbody').append(`<tr>
                            <td> ${idx + startNo} </td>
                            <td> ${item.name} </td>
                            <td> ${item.description} </td>
                            <td>
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
initPagination = initPaginationTemplate(listAuthor);
listAuthor();

function onDelete(authorOId) {
    swal({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Sau khi xóa, dữ liệu sẽ bị mất!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((ok) => {
        if (ok) {
            HttpService.post('/admin/author/delete', { authorOId }).then((response) => {
                if (response.success) {
                    loggerSuccess(response.message);
                    listAuthor();
                } else {
                    loggerError(response.message);
                }
            });
        }
    });
}

function showInfo(authorOId) {
    HttpService.get('/admin/author/info', { authorOId })
        .then((response) => {
            if (response.success) {
                const story = response.data;
                getElement('#form-modal').setAttribute('data-action', 'update');
                getElement('#form-modal').setAttribute('data-authorOId', story._id);
                handleValue('setValue', '#form-modal', {
                    data: [
                        { name: 'name', value: story.name },
                        { name: 'description', value: story.description },
                    ],
                });
            }
        });
}
