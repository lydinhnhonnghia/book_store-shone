/* eslint-disable no-unused-vars */
function appendOptionOfSelect(className, array = [], options = {
    firstText: 'Không chọn',
    firstValue: '',
    propText: '',
    propValue: '',
}) {
    const authorElems = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < authorElems.length; i += 1) {
        authorElems[i].innerHTML = '';
        const firstOption = document.createElement('option');
        firstOption.value = options.firstValue || '';
        firstOption.textContent = options.firstText || 'Không chọn';
        authorElems[i].appendChild(firstOption);
        array.map((item) => {
            const option = document.createElement('option');
            option.value = item[options.propValue];
            option.textContent = item[options.propText];
            if (options.concatPropText) option.textContent += `(${item[options.concatPropText] || ''})`;
            authorElems[i].appendChild(option);
        });
    }
}

const getElement = (element) => document.querySelector(element);
const getAllElement = (element) => document.querySelectorAll(element);
const handleValue = (action, rootElement, {
    names = [],
    data = [{ name: '', value: '' }],
}) => {
    if (action === 'resetValue') {
        names.map((name) => {
            getElement(`${rootElement} [name="${name}"]`).value = '';
        });
    } else if (action === 'getValue') {
        const objReturned = names.reduce((obj, name) => {
            obj[name] = getElement(`${rootElement} [name="${name}"]`).value;
            return obj;
        }, {});
        return objReturned;
    } else if (action === 'setValue') {
        data.map((item) => {
            getElement(`${rootElement} [name="${item.name}"]`).value = item.value;
        });
    }
};

const loggerSuccess = (msg) => {
    swal(
        'Success',
        msg,
        'success',
    );
};

const loggerError = (msg) => {
    swal(
        'Error',
        msg,
        'error',
    );
};

const handleMsgParamsErrors = (errors = []) => {
    let msg = '';
    errors.map((error) => {
        msg += `${error.msg}\n`;
    });
    return msg;
};

const formatDate = (dateTZ) => new Date(dateTZ).toLocaleString();
