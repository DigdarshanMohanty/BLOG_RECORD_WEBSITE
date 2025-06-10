function validateForm() {
    const title = document.querySelector('input[name="title"]').value.trim();
    const description = document.querySelector('textarea[name="description"]').value.trim();

    if (title === "") {
        alert("Title cannot be empty");
        return false;
    }

    if (description === "") {
        alert("Description cannot be empty");
        return false;
    }

    return true;
}
