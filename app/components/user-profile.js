import Ember from 'ember';


export default Ember.Component.extend({

  userSession: Ember.inject.service(),

  init() {
    this._super();
    let s = this.get('userSession');
    this.isLogged = s.isLogged() || false;
  },




  actions: {
    loginWithGoogle() {
      this.get('userSession').loginWithGoogle(function(){
        window.location.reload(true);
      });
    },
    loginWithGithub() {
      this.get('userSession').loginWithGithub(function(){
        window.location.reload(true);
      });
    },
    logout() {
      this.get('userSession').destroySession(function(){
        window.location.reload(true);
      });
    }
  }

});
