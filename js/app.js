/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var initialized = false;
var phoneNumberEl = null;
var sendSMSButton = null;
var callButton = null;
var demoInfo = null;
var _mozMobileMessage = null;
var _telephony = null;

function enable() {
  if (!sendSMSButton) {
    return;
  }
  if ( phoneNumberEl.value && phoneNumberEl.validity.valid) {
    sendSMSButton.removeAttribute('disabled');
    callButton.removeAttribute('disabled');
  } else {
    sendSMSButton.setAttribute('disabled', 'disabled');
    callButton.setAttribute('disabled', 'disabled');
  }
}

function setDemoInfo(text) {
  demoInfo.textContent = text || '';
  setTimeout(function() {
    demoInfo.textContent = '';
  }, 5000);
}

window.onload = function() {
  if (initialized) {
    return;
  }
  initialized = true;
  // Init DOM Params
  phoneNumberEl = document.getElementById('phone-number');
  sendSMSButton = document.getElementById('send-sms');
  callButton = document.getElementById('call');
  demoInfo = document.getElementById('demo-info');
  

  // Init API
  _mozMobileMessage = navigator.mozMobileMessage;
  _telephony = navigator.mozTelephony;
  // Add listeners
  phoneNumberEl.addEventListener('input', function(phonenumberEl) {
    enable();
  });
  sendSMSButton.addEventListener('mousedown', function() {
    
    if (!_mozMobileMessage) {
      console.error('Check your security level in the Manifest.')
      return;
    }
    Overlay.show('Sending SMS')
    var requests = _mozMobileMessage.send(
      [phoneNumberEl.value],
      "Hola London Web Standards' Audience!"
    );
    
    requests.forEach(function(request, idx) {
      request.onsuccess = function() {
        Overlay.hide();
        setDemoInfo('SMS Sent!');
      };
      request.onerror = function() {
        Overlay.hide();
        setDemoInfo('Error while sending the SMS');
      };
    });
  });
  callButton.addEventListener('mousedown', function() {
    var call = _telephony.dial(phoneNumberEl.value);

    if (!call) {
      console.error('Check your security level in the Manifest.')
      return;
    }

    call.onconnected = function() {
      setDemoInfo('Call: Connected');
    };
    call.ondisconnected = function() {
      setDemoInfo('Call: Disconnected');
    };
    call.onerror = function() {
      setDemoInfo('Call: Error');
    };
  });

  enable();
};
