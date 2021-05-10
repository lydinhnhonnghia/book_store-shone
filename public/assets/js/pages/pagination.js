/* eslint-disable no-unused-vars */
function initPaginationTemplate(listCb) {
    function setPage(page) {
        listCb(page);
    }

    function firstPage() {
        listCb(1);
    }

    function endPage(end) {
        listCb(end);
    }

    const initTemplatePagination = (fromPage, toPage, currentPage, totalPages) => {
        const blockPaginationElem = $('.block-pagination');
        blockPaginationElem.empty();
        blockPaginationElem.append('<ul class="pagination"></ul>');
        const ulPaginationElem = $('.block-pagination .pagination');
        ulPaginationElem.append('<li id="first-item"> <i class="mdi mdi-chevron-double-left"></i></li>');
        for (let p = fromPage; p <= toPage; p += 1) {
            const active = currentPage === p;
            ulPaginationElem.append(`<li class="item-${p} ${active ? 'active' : ''}">${p}</li>`);
            !active && document.querySelector(`.item-${p}`).addEventListener('click', () => setPage(p));
        }
        ulPaginationElem.append('<li id="last-item"> <i class="mdi mdi-chevron-double-right"></i></li></ul>');
        if (currentPage > 1) {
            document.getElementById('first-item').addEventListener('click', () => firstPage());
        }
        if (currentPage < totalPages) {
            document.getElementById('last-item').addEventListener('click', () => endPage(totalPages));
        }
    };
    function initPaginate(dataPagination) {
        if (dataPagination.pages > 1) {
            if (dataPagination.pages > 5) {
                let to = null;
                let from = null;
                if (dataPagination.page === 1 || dataPagination.page === 2) {
                    if (dataPagination.page === 1) {
                        from = 1;
                        to = dataPagination.page + 4;
                    } else if (dataPagination.page === 2) {
                        from = dataPagination.page - 1;
                        to = dataPagination.page + 3;
                    }
                } else {
                    const spaceToEnd = dataPagination.pages - dataPagination.page;
                    if (spaceToEnd === 0) {
                        from = dataPagination.page - 4;
                        to = dataPagination.pages;
                    } else if (spaceToEnd === 1) {
                        from = dataPagination.page - 3;
                        to = dataPagination.pages;
                    } else {
                        from = dataPagination.page - 2;
                        to = dataPagination.page + 2;
                    }
                }
                initTemplatePagination(from, to, dataPagination.page, dataPagination.pages);
            } else {
                initTemplatePagination(1, dataPagination.pages, dataPagination.page, dataPagination.pages);
            }
        }
    }
    return initPaginate;
}

const countNo = (page, limit) => (page === 1 ? 1 : limit * (page - 1) + 1);
