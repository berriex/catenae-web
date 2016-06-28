import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import config from '../config/environment';

export default Ember.Service.extend({
  session: {},

  storageSession: storageFor('storageSession'),

  init() {
    this._super();
    let savedSession = this.get('storageSession');
    this.set('session', savedSession || this.get('session'));
  },

  isLogged() {
    let s = this.get('session').content;
    return s.isLogged || false;
  },


  loginWithGoogle(cb) {
    let self = this;
    $.ajax(config.APP.apiURL+'/auth/google', {
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'googleCB'
    }).then( function(resp){
      return self.registerSession( resp.accessToken, cb );
    });
  },


  loginWithGithub(cb) {
    let self = this;
    $.ajax(config.APP.apiURL+'/auth/github', {
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'githubCB'
    }).then( function(resp){
      return self.registerSession( resp.accessToken, cb );
    });
  },

  registerSession: function(token, cb){
    let self = this;
    $.ajax(config.APP.apiURL+'/profile', {
      type: 'GET',
      dataType: 'json',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+token);}
    }).done(function(resp){
      let newSession = {
        userId: resp.id,
        accessToken: token,
        username: resp.username,
        isLogged: true
      }
      self.set('storageSession.accessToken', token);
      self.set('storageSession.username', resp.username);
      self.set('storageSession.userId', resp.id);
      self.set('storageSession.isLogged', true);
      self.set('session', newSession);
      return cb();
    }).fail(function(jqXHR, textStatus, errorThrown){
      console.log( 'registerSession error:' );
      console.log( textStatus );
      console.log( errorThrown );
    });
  },

  destroySession: function( cb ){
    this.get('storageSession').clear();
    this.set('session', {});
    return cb();
  }

});
