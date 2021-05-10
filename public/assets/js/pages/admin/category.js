/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

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
        HttpService.post('/admin/category/create', data).then((response) => {
            if (response.success) {
                loggerSuccess(response.message);
                listCategory();
                handleValue('resetValue', '#form-modal', { names: ['name', 'description'] });
            } else {
                if (response.statusCode === 1001) {
                    return loggerError(handleMsgParamsErrors(response.error));
                }
                loggerError(response.message);
            }
        });
    } else {
        const data = handleValue('getValue', '#form-modal', { names: ['name', 'description'] });
        data.categoryOId = getElement('#form-modal').getAttribute('data-categoryOId');
        HttpService.post('/admin/category/update', data).then((response) => {
            if (response.success) {
                $('#form-modal').modal('hide');
                loggerSuccess(response.message);
                listCategory();
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

function listCategory(page = 1) {
    HttpService.get('/admin/category/list', { page })
        .then((response) => {
            if (response.success) {
                const { data } = response;
                const startNo = countNo(data.page, data.limit);
                initPagination(data);
                $('#category-table>tbody').empty();
                data.docs.map((item, idx) => {
                    $('#category-table>tbody').append(`<tr>
                            <td> ${idx + startNo} </td>
                            <td> ${item.name} </td>
                            <td> ${formatDate(item.createdAt)} </td>
                            <td> ${item.status} </td>
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
initPagination = initPaginationTemplate(listCategory);
listCategory();

function onDelete(categoryOId) {
    swal({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Sau khi xóa, dữ liệu sẽ bị mất!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((ok) => {
        if (ok) {
            HttpService.post('/admin/category/delete', { categoryOId }).then((response) => {
                if (response.success) {
                    loggerSuccess(response.message);
                    listCategory();
                } else {
                    loggerError(response.message);
                }
            });
        }
    });
}

function showInfo(categoryOId) {
    HttpService.get('/admin/category/info', { categoryOId })
        .then((response) => {
            if (response.success) {
                const story = response.data;
                getElement('#form-modal').setAttribute('data-action', 'update');
                getElement('#form-modal').setAttribute('data-categoryOId', story._id);
                handleValue('setValue', '#form-modal', {
                    data: [
                        { name: 'name', value: story.name },
                        { name: 'description', value: story.description },
                    ],
                });
            }
        });
}
