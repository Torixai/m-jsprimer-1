console.log("loaded!!!");

function main(){
    const userId = getUserId();
    getUserInfo(userId)
    .then((userInfo) => createView(userInfo))
    .then((view) => displayView(view))
    .catch((error) => {
        console.error(`An Error Has Occured! [${error}]`);

    });
}

function getUserInfo(userId) {
    return new Promise ((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", `https://api.github.com/users/${userId}`);
    request.addEventListener("load", (event) => {
        if (event.target.status !== 200) {
            reject(new Error(`${event.target.status}: ${event.target.statusText}`));
        }


        const userInfo = JSON.parse(event.target.responseText);
        resolve(userInfo);
    });

    request.addEventListener("error", () => {
        reject(new Error ("network error!"));
    });
    request.send();
});
}

function getUserId() {
    const value = document.getElementById("userId").value;
    return encodeURIComponent(value);
}

function createView(userInfo) {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="200px">
    <dl>
        <dt>Location</dt>
        <dt>${userInfo.location}</dt>
        <dt><a href="${userInfo.repos_url}">Repositories</a></dt>
        <dt>${userInfo.public_repos}</dt>
    </dl>
    `;

}

function displayView(view) {
    const result = document.getElementById("result");
    result.innerHTML = view;
}

function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + string;
        } else {
            return result + String(value) + string;
        }
    });  
}