/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var key = 'AAAAuRdXDiw:APA91bFuynW6S1N32DCP-rUWBynPxj4PPjwzkW1U0mabYukSl3_rQRRDC2s4W7vFaZ9aVHQZbstuRlSXoO2c-nisoUmSuoyyNTUacSOaC09UyptPYplf2pBx9ftlp2MqXM2R4SgGZXz6'
var to = ''
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "794960530988"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var devicesRef = db.collection('devices');
            let query = devicesRef.where('token', '==', data.registrationId).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching devices')
                        devicesRef.add({
                            token: data.registrationId
                        })
                        return
                    } 

                    snapshot.forEach(device => {
                        console.log(device.id, '=>', device.data());
                    });
                })
                .catch(err => {
                    console.log('Error getting devices', err);
                })           

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
            push.finish(function(){
                console.log("notification received successfully");
            })
       });
    },

    sendNotification: function() {
        var notification = {
            'title': 'Portugal vs. Denmark',
            'body': '5 to 1',
            'icon': 'firebase-logo.png',
          };

        var devicesRef = db.collection('devices');
        devicesRef.get().then(snapshot => {

            if (snapshot.empty) {
                console.log('No matching devices')
                return
            } 
            let tokens = []
            snapshot.forEach(device => {
                console.log(device.id, '=>', device.data());
                const {token} = device.data()
                fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    'to': token,
                    "data": {
                        "title": "test",
                        "message": "Test message"
                    }
                })
                }).then(function(response) {
                    response.json(data => {
                        console.log('~~~data', data);
                    })
                }).catch(function(error) {
                console.error(error);
                })
                for(i=0;i<100; i++){}
            });
            console.log('~~~tokens', tokens);
            
            
        })        
    }
};
