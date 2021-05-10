/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const HttpService = {
    get: (url, query = {}) => axios.get(url, {
        params: { ...query },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error);
            return { error };
        }),
    post: (url, data = {}) => axios.post(url, data)
        .then((response) => response.data)
        .catch((error) => {
            console.log(error);
            return { error };
        }),
};
