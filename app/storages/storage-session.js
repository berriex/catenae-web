import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {
      userId: '',
      accessToken: '',
      username: '',
      isLogged: false
    };
  }
});

export default Storage;
