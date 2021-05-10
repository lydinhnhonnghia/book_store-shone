/* eslint-disable no-undef */
const signInButton = document.getElementById('sign-in');
signInButton.addEventListener('click', () => {
    const elemUsername = document.getElementById('username');
    const elemPassword = document.getElementById('password');
    HttpService.post('/admin/sign-in', {
        username: elemUsername.value,
        password: elemPassword.value,
    })
        .then((response) => {
            if (response.success) {
                document.location.href = '/admin/dashboard';
            } else {
                if (response.statusCode === 1001) {
                    return loggerError(handleMsgParamsErrors(response.error));
                }
                loggerError(response.message);
            }
        });
});
