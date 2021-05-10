/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const scope = {};
getElement('#btn-show-modal-create').addEventListener('click', () => {
    getElement('#form-modal').setAttribute('data-action', 'create');
    getElement('#form-modal').removeAttribute('data-storyOId');
    handleValue('resetValue', '#form-modal', { names: ['username', 'firstname', 'lastname', 'password', 'confirmPassword', 'email', 'mobile'] });
});

const button = getElement('#save');
button.addEventListener('click', () => {
    const action = getElement('#form-modal').getAttribute('data-action');
    if (action === 'create') {
        const data = handleValue('getValue', '#form-modal',
            { names: ['username', 'firstname', 'lastname', 'password', 'confirmPassword', 'email', 'mobile'] });
        HttpService.post('/admin/account/create', data).then((response) => {
            if (response.success) {
                loggerSuccess(response.message);
                listAccountAdmin();
                handleValue('resetValue', '#form-modal',
                    { names: ['username', 'firstname', 'lastname', 'password', 'confirmPassword', 'email', 'mobile'] });
            } else {
                if (response.statusCode === 1001) {
                    return loggerError(handleMsgParamsErrors(response.error));
                }
                loggerError(response.message);
            }
        });
    } else {
        const data = handleValue('getValue', '#form-modal',
            { names: ['username', 'firstname', 'lastname', 'email', 'mobile'] });
        data.accountOId = getElement('#form-modal').getAttribute('data-accountOId');
        HttpService.post('/admin/account/update', data).then((response) => {
            if (response.success) {
                $('#form-modal').modal('hide');
                loggerSuccess(response.message);
                handleValue('resetValue', '#form-modal', { names: ['username', 'firstname', 'lastname', 'email', 'mobile'] });
                listAccountAdmin();
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

function listAccountAdmin(page = 1) {
    HttpService.get('/admin/account/list', { page, roleType: 'ADMIN' })
        .then((response) => {
            if (response.success) {
                const { data } = response;
                const startNo = countNo(data.page, data.limit);
                initPagination(data);
                $('#account-table>tbody').empty();
                data.docs.map((item, idx) => {
                    $('#account-table>tbody').append(`<tr>
                            <td> ${idx + startNo} </td>
                            <td> ${item.username || ''} </td>
                            <td> ${item.firstname || ''} </td>
                            <td> ${item.lastname || ''} </td>
                            <td> ${item.mobile || ''} </td>
                            <td> ${item.email || ''} </td>
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
initPagination = initPaginationTemplate(listAccountAdmin);
listAccountAdmin();

function onDelete(accountOId) {
    swal({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Sau khi xóa, dữ liệu sẽ bị mất!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((ok) => {
        if (ok) {
            HttpService.post('/admin/account/delete', { accountOId }).then((response) => {
                if (response.success) {
                    loggerSuccess(response.message);
                    listAccountAdmin();
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

function showInfo(accountOId) {
    HttpService.get('/admin/account/info', { accountOId })
        .then((response) => {
            if (response.success) {
                const account = response.data;
                getElement('#form-modal').setAttribute('data-action', 'update');
                getElement('#form-modal').setAttribute('data-accountOId', account._id);
                handleValue('setValue', '#form-modal', {
                    data: [
                        { name: 'username', value: account.username },
                        { name: 'firstname', value: account.firstname },
                        { name: 'lastname', value: account.lastname },
                        { name: 'email', value: account.email },
                        { name: 'mobile', value: account.mobile },
                    ],
                });
            }
        });
}
