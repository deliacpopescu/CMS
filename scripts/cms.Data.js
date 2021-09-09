CMS.prototype.getAllEmployees = function (render) {
    const query = firebase.firestore()
        .collection('employees')
        .orderBy('lastName', 'asc');
    this.getDocumentsInQuery(query, render);
};

CMS.prototype.getSortedEmployees = function (sortCriteria, sortType, render) {
    const query = firebase.firestore()
        .collection('employees')
        .orderBy(sortCriteria, sortType);
    this.getDocumentsInQuery(query, render);
};

CMS.prototype.addNewEmployee = function (data) {
    return firebase.firestore().collection('employees').add(data);
};

CMS.prototype.editExistingEmployee = function (id, data) {
    return firebase.firestore().collection('employees').doc(id).update(data);
};

CMS.prototype.deleteExistingEmployee = function (id) {
    return firebase.firestore().collection('employees').doc(id).delete();
};

CMS.prototype.getDocumentsInQuery = function (query, render) {
    query.onSnapshot((snapshot) => {
        if (!snapshot.size) {
            return render();
        }

        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
                render(change.doc);
            }
        });
    });
};