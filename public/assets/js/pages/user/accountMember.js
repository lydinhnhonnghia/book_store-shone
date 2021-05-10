/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let initPagination = null;

function listAccountMember(page = 1) {
    HttpService.get('/admin/account/list', { page, roleType: 'MEMBER' })
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
                        </tr>`);
                });
            }
        });
}
initPagination = initPaginationTemplate(listAccountMember);
listAccountMember();
