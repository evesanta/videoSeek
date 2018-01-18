// var Vue = require('vue');
import Vue from "vue";

// ElementUI
import ElementUI from 'element-ui'

// ElementUIでの言語設定、datePickerとかで適用される
import locale from 'element-ui/lib/locale/lang/ja'

Vue.use(ElementUI, {
  locale
});

import firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA7kKVhbRc58r1iHWvu8gwpTfJpuRtappE",
  authDomain: "movieseek-372ea.firebaseapp.com",
  databaseURL: "https://movieseek-372ea.firebaseio.com",
  projectId: "movieseek-372ea",
  storageBucket: "movieseek-372ea.appspot.com",
  messagingSenderId: "23308203782"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    //    console.log(user)
  } else {

  }
})

var app = new Vue({
  el: '#app',

  methods: {
    say: function (index) {
      const video = document.getElementById("video");
      video.currentTime = this.tableData2[index].time;
      video.play();
      //      document.getElementById("tableBody").scrollTop = 41;
    },
    login: function () {
      firebase.auth().signInWithRedirect(provider);
    },
    saisei: function () {
      video.paused ? video.play() : video.pause();

    }
  },

  updated: function () {
    this.loaded = "loaded"
  },

  filters: {
    toTime: function (value) {
      if (!value) return ''
      return Math.floor(value / 60) + ":" + ('00' + (value % 60)).slice(-2);
    }
  },
  watch: {
    nowTime: function (nowTime) {
      this.tableData2.forEach((data, index, array) => {
        if (data.time <= nowTime && nowTime < data.endTime) {
          document.getElementById("tableBody").scrollTop = index * 42;
        }
      })
    }
  },

  data: {
    news: [],
    nowTime: 0,
    tableData2: [],
    title: '',
    videoUrl: '',
    loaded: ""
  }
})

const video = document.getElementById("video");
video.addEventListener('timeupdate', () => {
  app.nowTime = video.currentTime
}, false);

firebase.database().ref('title').once('value', function (snapshot) {
  app.title = snapshot.val();
});

firebase.database().ref('url').once('value', function (snapshot) {
  document.getElementById("video").src = snapshot.val();
});

firebase.database().ref('chapter').once('value', function (snapshot) {
  var table = []
  var val = snapshot.val()
  for (var index in val) {
    if (index != 0) table[table.length - 1].endTime = index;
    const shortName = (val[index].length > 20) ?
      val[index].slice(0, 17) + "..." : val[index];
    table.push({
      time: index,
      endTime: Infinity,
      name: shortName,
      nowPlay: false
    })
  }
  app.tableData2 = table
  //  console.log(table)
});

// this.app.$options.methods.update(this.app.$options.data)
